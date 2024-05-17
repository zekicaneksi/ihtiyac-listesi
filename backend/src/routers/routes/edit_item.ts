import { Request, Response } from "express";
import dbCon from "@/setup/database/db_setup";
import { Room, RoomItem } from "@/setup/database/collections/rooms";
import { User } from "@/setup/database/collections/users";
import { ObjectId } from "mongodb";
import { notifyEditItem } from "@/websocket/websocket_servers/home/messages";

interface Body {
  title: string;
  description: string;
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
    res.statusCode = 409;
    res.send("invalid room id or item id");
  }
  const roomId = new ObjectId(bodyData.roomId);
  const itemId = new ObjectId(bodyData.itemId);

  // Validating fields
  if (bodyData.title.length < 1 || bodyData.title.length > 60) {
    res.statusCode = 409;
    res.send("title must be between 1-60 characters");
  } else if (bodyData.description.length > 400) {
    res.statusCode = 409;
    res.send("description cannot be longer than 400 characters");
  }

  const updateResult = await dbCon.collection<Room>("rooms").findOneAndUpdate(
    {
      _id: roomId,
      members: { $in: [user._id] },
      "items._id": itemId,
      "items.addedBy": user._id,
    },
    {
      $set: {
        "items.$[elem].title": bodyData.title,
        "items.$[elem].description": bodyData.description,
      },
    },
    {
      arrayFilters: [{ "elem._id": itemId, "elem.addedBy": user._id }],
      projection: { members: 1 },
    },
  );

  if (!updateResult) {
    return res.status(500).send("internal error");
  }

  notifyEditItem(
    updateResult.members.map((e) => e.toString()),
    itemId.toString(),
    roomId.toString(),
    bodyData.title,
    bodyData.description,
  );

  res.status(201).send("successful");
};
