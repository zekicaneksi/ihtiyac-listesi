import { Request, Response } from "express";
import { User } from "@/setup/database/collections/users";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { ObjectId } from "mongodb";
import { notifyDeleteItem } from "@/websocket/websocket_servers/home/messages";

interface Body {
  roomId: string;
  itemId: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  if (
    !ObjectId.isValid(bodyData.roomId) ||
    !ObjectId.isValid(bodyData.itemId)
  ) {
    res.statusCode = 400;
    res.send("invalid room id or item id");
  }

  const updatedRoom = await dbCon.collection<Room>("rooms").findOneAndUpdate(
    {
      _id: new ObjectId(bodyData.roomId),
      members: { $in: [user._id] },
      "items.addedBy": user._id,
    },
    { $pull: { items: { _id: new ObjectId(bodyData.itemId) } } },
    { projection: { members: 1 } },
  );

  if (!updatedRoom) {
    return res
      .status(400)
      .send("room or item doesn't exist, or not present in such a room");
  }

  notifyDeleteItem(
    updatedRoom.members.map((e) => e.toString()),
    bodyData.itemId,
    bodyData.roomId,
  );

  res.statusCode = 200;
  res.send("left room");
};
