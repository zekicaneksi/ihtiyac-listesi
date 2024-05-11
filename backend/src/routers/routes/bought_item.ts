import { Request, Response } from "express";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { User } from "@/setup/database/collections/users";
import { ObjectId } from "mongodb";
import { notifyBoughtItemRoom } from "@/websocket/websocket_servers/home/messages";

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

  const dbRes = await dbCon
    .collection<Room>("rooms")
    .findOneAndUpdate({ _id: roomId, members: user._id, "items._id": itemId }, [
      {
        $addFields: {
          tempItem: {
            $arrayElemAt: ["$items", { $indexOfArray: ["$items._id", itemId] }],
          },
        },
      },
      { $unset: "tempItem.willBeBoughtBy" },
      {
        $addFields: {
          "tempItem.boughtBy": user._id,
          "tempItem.purchaseDate": "$$NOW",
        },
      },
      {
        $set: {
          history: {
            $concatArrays: ["$history", ["$tempItem"]],
          },
        },
      },
      {
        $unset: "tempItem",
      },
      {
        $set: {
          items: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $ne: ["$$item._id", itemId] },
            },
          },
        },
      },
    ]);

  if (!dbRes) return res.status(404).send("record not found");

  notifyBoughtItemRoom(
    dbRes.members.map((e) => e.toString()),
    itemId.toString(),
    roomId.toString(),
  );

  /* In here, user info of whoever added the item and bought the item and then users in history page should be notified*/

  return res.status(201).send("OK");
};
