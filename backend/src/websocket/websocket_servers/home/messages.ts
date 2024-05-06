import { connectionMap } from "./home";
import { ObjectId } from "mongodb";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";

export function notifyCreatedRoom(
  userId: string,
  roomData: { roomName: string; roomId: string },
) {
  connectionMap.get(userId)?.forEach((ws) => {
    ws.send(JSON.stringify({ type: "roomCreation", ...roomData }));
  });
}

export function notifyLeftRoom(userId: string, roomId: string) {
  connectionMap.get(userId)?.forEach((ws) => {
    ws.send(JSON.stringify({ type: "roomLeave", roomId: roomId }));
  });
}

export function notifyJoinRoom(
  userId: string,
  roomData: { roomName: string; roomId: string },
) {
  connectionMap.get(userId)?.forEach((ws) => {
    ws.send(JSON.stringify({ type: "roomJoin", ...roomData }));
  });
}

export async function getInitialRooms(userId: ObjectId) {
  const response = await dbCon
    .collection<Room>("rooms")
    .find({ members: userId })
    .project({ name: 1 })
    .toArray();

  return response;
}

export async function getInitialItems(roomId: string, userId: ObjectId) {
  if (!ObjectId.isValid(roomId)) return null;

  const response = await dbCon
    .collection<Room>("rooms")
    .findOne({ _id: new ObjectId(roomId), members: { $in: [userId] } });

  if (!response) return null;
  else return response.items;
}
