import { Request, Response } from "express";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { User } from "@/setup/database/collections/users";
import { ObjectId } from "mongodb";
import { notifyCancelWillBuy } from "@/websocket/websocket_servers/home/messages";

interface Body {
  roomId: string;
  itemId: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  if (!ObjectId.isValid(bodyData.roomId) || !ObjectId.isValid(bodyData.itemId))
    return res.status(400).send("invalid ids");

  const itemId = new ObjectId(bodyData.itemId);
  const roomId = new ObjectId(bodyData.roomId);

  const dbRes = await dbCon.collection<Room>("rooms").findOneAndUpdate(
    {
      _id: roomId,
      members: user._id,
      "items._id": itemId,
      "items.willBeBoughtBy": user._id,
    },
    { $set: { "items.$[elem].willBeBoughtBy": null } },
    {
      arrayFilters: [{ "elem._id": itemId, "elem.willBeBoughtBy": user._id }],
      projection: { members: 1 },
    },
  );

  if (!dbRes) return res.status(404).send("record not found");

  notifyCancelWillBuy(
    dbRes.members.map((e) => e.toString()),
    itemId.toString(),
    roomId.toString(),
  );

  return res.status(201).send("OK");
};
