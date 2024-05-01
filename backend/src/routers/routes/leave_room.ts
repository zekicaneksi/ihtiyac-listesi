import { Request, Response } from "express";
import { User } from "@/setup/database/collections/users";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { ObjectId } from "mongodb";
import { notifyLeftRoom } from "@/websocket/websocket_servers/home";

interface Body {
  roomId: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  const updatedRoom = await dbCon
    .collection<Room>("rooms")
    .findOneAndUpdate(
      { _id: new ObjectId(bodyData.roomId) },
      { $pull: { members: user._id as ObjectId } },
      { returnDocument: "after" },
    );

  if (updatedRoom) {
    notifyLeftRoom(user._id?.toString() as string, updatedRoom._id.toString());

    // Delete the room if it has no members left
    if (updatedRoom.members.length === 0) {
        await dbCon.collection<Room>("rooms").findOneAndDelete({_id: updatedRoom._id})
    }

    res.statusCode = 200;
    res.send("left room");
  } else {
    res.statusCode = 400;
    res.send("room doesn't exist, or not present in such a room");
  }
};
