import { Request, Response } from "express";
import { User } from "@/setup/database/collections/users";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { ObjectId } from "mongodb";
import { notifyLeftRoom } from "@/websocket/websocket_servers/home/messages";

interface Body {
  roomId: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  if (!ObjectId.isValid(bodyData.roomId)) {
    return res.status(400).send("invalid room id");
  }

  const roomId = new ObjectId(bodyData.roomId);

  const updatedRoom = await dbCon
    .collection<Room>("rooms")
    .findOneAndUpdate(
      { _id: roomId, creatorId: { $ne: user._id } },
      { $pull: { members: user._id } },
      { projection: { _id: 1 } },
    );

  if (!updatedRoom)
    return res
      .status(400)
      .send("room doesn't exist, or not present in such a room");

  await dbCon
    .collection<User>("users")
    .updateOne({ _id: user._id }, { $pull: { memberOfRooms: roomId } });

  notifyLeftRoom(user._id.toString(), updatedRoom._id.toString());

  res.statusCode = 200;
  res.send("left room");
};
