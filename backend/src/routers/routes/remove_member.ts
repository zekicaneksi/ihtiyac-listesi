import { Request, Response } from "express";
import { User } from "@/setup/database/collections/users";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { ObjectId } from "mongodb";
import { notifyRemoveMember } from "@/websocket/websocket_servers/home/messages";

interface Body {
  roomId: string;
  memberId: string;
}

export default async (req: Request, res: Response) => {
  const bodyData: Body = req.body;
  const user: User = res.locals.user;

  if (
    !ObjectId.isValid(bodyData.roomId) ||
    !ObjectId.isValid(bodyData.memberId)
  ) {
    return res.status(400).send("invalid room id or member id");
  }

  const memberId = new ObjectId(bodyData.memberId);
  const roomId = new ObjectId(bodyData.roomId);

  if (memberId.equals(user._id))
    return res.status(400).send("creator cannot remove itself");

  const removeMemberResult = await dbCon
    .collection<Room>("rooms")
    .findOneAndUpdate(
      {
        _id: roomId,
        creatorId: user._id,
      },
      { $pull: { members: memberId } },
      { projection: { members: 1 } },
    );

  if (!removeMemberResult) {
    return res.status(500).send("internal error");
  }

  await dbCon
    .collection<User>("users")
    .findOneAndUpdate(
      { _id: memberId },
      { $pull: { memberOfRooms: roomId } },
      { projection: { _id: 1 } },
    );

  notifyRemoveMember(memberId.toString(), roomId.toString());

  return res.status(200).send("removed member");
};
