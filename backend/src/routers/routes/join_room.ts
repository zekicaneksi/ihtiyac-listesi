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
    res.statusCode = 404;
    res.send("room not found");
  } else {
    if (room.members.some((e) => e.toString() === user._id.toString())) {
      res.statusCode = 406;
      res.send("already in the room");
    } else {
      if (bcrypt.compareSync(bodyData.password, room.password)) {
        await dbCon
          .collection<Room>("rooms")
          .updateOne({ _id: room._id }, { $addToSet: { members: user._id } });

        notifyJoinRoom(user._id.toString(), {
          roomName: room.name,
          roomId: room._id.toString(),
        });

        res.statusCode = 200;
        res.send("successful");
      } else {
        res.statusCode = 401;
        res.send("incorrect password");
      }
    }
  }
};
