import { Session } from "@/setup/database/collections/sessions";
import { User } from "@/setup/database/collections/users";
import { WebSocket, WebSocketServer } from "ws";
import CustomWebSocket from "../utils/CustomWebSocket";
import {
  setWebSocketHeartbeatListeners,
  getHeartbeatInterval,
} from "../utils/heartbeat";
import dbCon from "@/setup/database/db_setup";
import { Room } from "@/setup/database/collections/rooms";
import { ObjectId } from "mongodb";

const wsServer = new WebSocketServer({ noServer: true });

const connectionMap = new Map<string, Map<Session, WebSocket>>();

function addToMap(userId: string, session: Session, ws: WebSocket) {
  if (connectionMap.has(userId)) {
    connectionMap.get(userId)?.set(session, ws);
  } else {
    const newMap = new Map<Session, WebSocket>();
    newMap.set(session, ws);
    connectionMap.set(userId, newMap);
  }
}

function removeFromMap(userId: string, session: Session) {
  connectionMap.get(userId)?.delete(session);
  if (connectionMap.get(userId)?.size === 0) connectionMap.delete(userId);
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

async function getInitialRooms(userId: ObjectId) {
  const response = await dbCon
    .collection<Room>("rooms")
    .find({ members: userId })
    .project({ name: 1 })
    .toArray();

  return response;
}

wsServer.on(
  "connection",
  async function connection(ws: CustomWebSocket, session: Session, user: User) {
    ws.on("error", console.error);

    setWebSocketHeartbeatListeners(ws);

    ws.on("close", function close() {
      removeFromMap(user._id.toString(), session);
    });

    addToMap(user._id.toString(), session, ws);

    const initialRooms = await getInitialRooms(user._id);
    ws.send(JSON.stringify({ type: "initialRooms", rooms: initialRooms }));
  },
);

const interval = getHeartbeatInterval(wsServer);

wsServer.on("close", function close() {
  clearInterval(interval);
});

export default wsServer;
