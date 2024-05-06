import { Request, Response } from "express";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { User } from "@/setup/database/collections/users";
import { ObjectId } from "mongodb";

interface Body {
  title: string;
  description: string;
  roomId: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  if (!ObjectId.isValid(bodyData.roomId)) {
    res.statusCode = 409;
    res.send("invalid room id");
  }
  const roomId = new ObjectId(bodyData.roomId);

  // Validating fields
  if (bodyData.title.length < 1 || bodyData.title.length > 60) {
    res.statusCode = 409;
    res.send("title must be between 1-60 characters");
  } else if (bodyData.description.length > 400) {
    res.statusCode = 409;
    res.send("description cannot be longer than 400 characters");
  }

  const itemId = new ObjectId();

  const insertResult = await dbCon.collection<Room>("rooms").findOneAndUpdate(
    { _id: roomId, members: { $in: [user._id] } },
    {
      $addToSet: {
        items: {
          _id: itemId,
          title: bodyData.title,
          description: bodyData.description,
          addedBy: user._id,
          willBeBoughtBy: null,
        },
      },
    },
  );

  if (!insertResult) {
    res.status(500).send("internal error");
  }

  res.status(201).send("successful");
};
