import { Request, Response } from "express";
import { User } from "@/setup/database/collections/users";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { notifyJoinRoom } from "@/websocket/websocket_servers/home/messages";

interface Body {
  roomId: string;
  password: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  let room;

  if (ObjectId.isValid(bodyData.roomId)) {
    room = await dbCon
      .collection<Room>("rooms")
      .findOne({ _id: new ObjectId(bodyData.roomId) });
  }

  if (!room) {
    return res.status(404).send("room not found");
  }

  if (room.members.some((e) => e.toString() === user._id.toString())) {
    return res.status(406).send("already in the room");
  }

  if (!bcrypt.compareSync(bodyData.password, room.password)) {
    return res.status(401).send("incorrect password");
  }

  await dbCon
    .collection<Room>("rooms")
    .updateOne({ _id: room._id }, { $addToSet: { members: user._id } });

  await dbCon
    .collection<User>("users")
    .updateOne({ _id: user._id }, { $push: { memberOfRooms: room._id } });

  notifyJoinRoom(user._id.toString(), {
    roomName: room.name,
    roomId: room._id.toString(),
  });

  res.statusCode = 200;
  res.send("successful");
};
