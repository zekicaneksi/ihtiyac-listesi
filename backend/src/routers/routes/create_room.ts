import regexp from "@/utils/regex";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { User } from "@/setup/database/collections/users";
import { notifyCreatedRoom } from "@/websocket/websocket_servers/home/messages";

interface Body {
  name: string;
  password: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  // Validating Fields
  res.statusCode = 409;
  if (bodyData.name.length > 40 || bodyData.name.length < 2) {
    return res.send("Room name must be between 2-40 characters long");
  } else if (RegExp(regexp.containsWhiteSpace).test(bodyData.password)) {
    return res.send("Password cannot contain whitespaces");
  } else if (bodyData.password.length < 8 || bodyData.password.length > 20) {
    return res.send("Password must be 8-20 characters long");
  }

  // Hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(bodyData.password, salt);

  const insertResult = await dbCon
    .collection<Omit<Room, "_id">>("rooms")
    .insertOne({
      name: bodyData.name,
      password: hashedPassword,
      creatorId: user._id,
      items: [],
      history: [],
      members: [user._id],
    });

  if (!insertResult.insertedId)
    return res.status(500).send("something went wrong");

  await dbCon
    .collection<User>("users")
    .updateOne(
      { _id: user._id },
      { $push: { memberOfRooms: insertResult.insertedId } },
    );

  res.statusCode = 201;
  res.send("room creation is successful");

  notifyCreatedRoom(user._id.toString(), {
    roomName: bodyData.name,
    roomId: insertResult.insertedId.toString(),
  });
};
