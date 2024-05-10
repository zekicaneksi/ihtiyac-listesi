import { connectionMap } from "./home";
import { ObjectId } from "mongodb";
import dbCon from "@/setup/database/db_setup";
import { Room, RoomItem } from "@/setup/database/collections/rooms";

interface UserFrontend {
  _id: string;
  fullname: string;
  profilePictureId: string | null;
}

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
    .aggregate([
      {
        $match: {
          $and: [{ _id: new ObjectId(roomId) }, { members: { $in: [userId] } }],
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "users",
          localField: "items.addedBy",
          foreignField: "_id",
          as: "items.addedBy",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "items.willBeBoughtBy",
          foreignField: "_id",
          as: "items.willBeBoughtBy",
        },
      },
      {
        $replaceRoot: { newRoot: "$items" },
      },
      {
        $project: {
          "addedBy.password": 0,
          "addedBy.memberOfRooms": 0,
          "addedBy.username": 0,

          "willBeBoughtBy.password": 0,
          "willBeBoughtBy.memberOfRooms": 0,
          "willBeBoughtBy.username": 0,
        },
      },
      {
        $set: {
          addedBy: { $first: "$addedBy" },
          willBeBoughtBy: {
            $cond: [
              { $eq: [{ $size: "$willBeBoughtBy" }, 0] },
              null,
              { $first: "$willBeBoughtBy" },
            ],
          },
        },
      },
    ])
    .toArray();

  if (!response) return null;
  else return response;
}

export async function notifyAddItem(
  userIds: string[],
  addedItem: RoomItem,
  addedBy: UserFrontend,
) {
  for (let i = 0; i < userIds.length; i++) {
    connectionMap.get(userIds[i])?.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "itemAdd",
          item: { ...addedItem, addedBy: addedBy },
        }),
      );
    });
  }
}

export function notifyWillBuy(
  userIds: string[],
  itemId: string,
  willBuyUser: UserFrontend,
  roomId: string,
) {
  for (let i = 0; i < userIds.length; i++) {
    connectionMap.get(userIds[i])?.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "willBuy",
          roomId: roomId,
          itemId: itemId,
          willBuyUser: willBuyUser,
        }),
      );
    });
  }
}

export function notifyCancelWillBuy(
  userIds: string[],
  itemId: string,
  roomId: string,
) {
  for (let i = 0; i < userIds.length; i++) {
    connectionMap.get(userIds[i])?.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "cancelWillBuy",
          roomId: roomId,
          itemId: itemId,
        }),
      );
    });
  }
}
