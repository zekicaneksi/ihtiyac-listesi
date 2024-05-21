import { Request, Response } from "express";
import { User } from "@/setup/database/collections/users";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { ObjectId } from "mongodb";

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

  const deletedRoom = await dbCon
    .collection<Room>("rooms")
    .findOneAndDelete({ _id: roomId, creatorId: user._id });

  if (!deletedRoom) return res.status(404).send("room not found");

  await dbCon
    .collection<User>("users")
    .updateMany(
      { _id: { $in: deletedRoom.members } },
      { $pull: { memberOfRooms: deletedRoom._id } },
    );

  res.statusCode = 200;
  res.send("closed room");
};
