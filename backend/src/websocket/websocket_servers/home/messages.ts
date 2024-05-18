import { connectionMap } from "./home";
import { ObjectId, Document } from "mongodb";
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

export async function getInitialHistoryItems(
  roomId: string,
  userId: ObjectId,
  page: number,
) {
  if (!ObjectId.isValid(roomId)) return null;
  if (!Number.isInteger(page) && page > 0) return null;

  const response = await dbCon
    .collection<Room>("rooms")
    .aggregate([
      {
        $match: {
          $and: [{ _id: new ObjectId(roomId) }, { members: { $in: [userId] } }],
        },
      },
      {
        $project: {
          history: {
            $slice: [
              "$history",
              {
                $cond: [
                  { $gte: [{ $size: "$history" }, (page - 1) * 10] },
                  (page - 1) * 10,
                  { $size: "$history" },
                ],
              },
              10,
            ],
          },
        },
      },
      { $unwind: "$history" },
      {
        $lookup: {
          from: "users",
          localField: "history.addedBy",
          foreignField: "_id",
          as: "history.addedBy",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "history.boughtBy",
          foreignField: "_id",
          as: "history.boughtBy",
        },
      },
      {
        $replaceRoot: { newRoot: "$history" },
      },
      {
        $project: {
          "addedBy.password": 0,
          "addedBy.memberOfRooms": 0,
          "addedBy.username": 0,

          "boughtBy.password": 0,
          "boughtBy.memberOfRooms": 0,
          "boughtBy.username": 0,
        },
      },
      {
        $set: {
          addedBy: { $first: "$addedBy" },
          boughtBy: { $first: "$boughtBy" },
        },
      },
    ])
    .toArray();

  if (!response) return null;
  else return response;
}

export async function notifyAddItem(
  userIds: string[],
  roomId: string,
  addedItem: RoomItem,
  addedBy: UserFrontend,
) {
  for (let i = 0; i < userIds.length; i++) {
    connectionMap.get(userIds[i])?.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "itemAdd",
          item: { ...addedItem, addedBy: addedBy },
          roomId: roomId,
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

export function notifyBoughtItem(
  userIds: string[],
  itemId: string,
  roomId: string,
  historyItem: Document,
) {
  for (let i = 0; i < userIds.length; i++) {
    connectionMap.get(userIds[i])?.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "boughtItem",
          roomId: roomId,
          itemId: itemId,
        }),
      );
      ws.send(
        JSON.stringify({
          type: "historyItemAdd",
          roomId: roomId,
          item: historyItem,
        }),
      );
    });
  }
}

export function notifyDeleteItem(
  userIds: string[],
  itemId: string,
  roomId: string,
) {
  for (let i = 0; i < userIds.length; i++) {
    connectionMap.get(userIds[i])?.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "deleteItem",
          roomId: roomId,
          itemId: itemId,
        }),
      );
    });
  }
}

export function notifyEditItem(
  userIds: string[],
  itemId: string,
  roomId: string,
  newTitle: string,
  newDescription: string,
) {
  for (let i = 0; i < userIds.length; i++) {
    connectionMap.get(userIds[i])?.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "editItem",
          roomId: roomId,
          itemId: itemId,
          newTitle: newTitle,
          newDescription: newDescription,
        }),
      );
    });
  }
}
