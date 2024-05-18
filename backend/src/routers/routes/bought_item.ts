import { Request, Response } from "express";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { User } from "@/setup/database/collections/users";
import { ObjectId } from "mongodb";
import { notifyBoughtItem } from "@/websocket/websocket_servers/home/messages";

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
    { _id: roomId, members: user._id, "items._id": itemId },
    [
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
            $concatArrays: [["$tempItem"], "$history"],
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
    ],
    { projection: { members: 1 } },
  );

  if (!dbRes) return res.status(404).send("record not found");

  const newHistoryItem = await dbCon
    .collection<Room>("rooms")
    .aggregate([
      {
        $match: {
          _id: new ObjectId(roomId),
        },
      },
      { $unwind: "$history" },
      {
        $match: {
          "history._id": itemId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "history.addedBy",
          foreignField: "_id",
          as: "history.addedBy",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "history.boughtBy",
          foreignField: "_id",
          as: "history.boughtBy",
        },
      },
      {
        $replaceRoot: { newRoot: "$history" },
      },
      {
        $project: {
          "addedBy.password": 0,
          "addedBy.memberOfRooms": 0,
          "addedBy.username": 0,

          "boughtBy.password": 0,
          "boughtBy.memberOfRooms": 0,
          "boughtBy.username": 0,
        },
      },
      {
        $set: {
          addedBy: { $first: "$addedBy" },
          boughtBy: { $first: "$boughtBy" },
        },
      },
    ])
    .toArray();

  notifyBoughtItem(
    dbRes.members.map((e) => e.toString()),
    itemId.toString(),
    roomId.toString(),
    newHistoryItem[0],
  );

  return res.status(201).send("OK");
};
