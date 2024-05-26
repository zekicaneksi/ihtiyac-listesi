import CustomWebSocket from "@/websocket/utils/CustomWebSocket";
import {
  checkRoomExistence,
  getInitialHistoryItems,
  getInitialItems,
  getInitialRooms,
  getRoomInfo,
} from "./messages";
import { User } from "@/setup/database/collections/users";

type Message =
  | {
      type: "getRooms";
    }
  | {
      type: "getItems";
      roomId: string;
    }
  | {
      type: "getHistoryItems";
      roomId: string;
      page: number;
    }
  | {
      type: "getRoomInfo";
      roomId: string;
    }
  | {
      type: "checkRoomExistence";
      roomId: string;
    };

export function setOnMessage(ws: CustomWebSocket, user: User) {
  ws.on("message", async function message(data) {
    // Checking if data is json
    try {
      JSON.parse(data.toString());
    } catch (err) {
      return;
    }
    const jsonData: Message = JSON.parse(data.toString());
    if (jsonData.type === "getRooms") {
      const initialRooms = await getInitialRooms(user._id);
      ws.send(JSON.stringify({ type: "initialRooms", rooms: initialRooms }));
    } else if (jsonData.type === "getItems") {
      const initialItems = await getInitialItems(jsonData.roomId, user._id);
      if (initialItems)
        ws.send(JSON.stringify({ type: "initialItems", items: initialItems }));
    } else if (jsonData.type === "getHistoryItems") {
      const initialHistoryItems = await getInitialHistoryItems(
        jsonData.roomId,
        user._id,
        jsonData.page,
      );
      if (initialHistoryItems)
        ws.send(
          JSON.stringify({
            type: "initialHistoryItems",
            items: initialHistoryItems,
          }),
        );
    } else if (jsonData.type === "getRoomInfo") {
      const roomInfo = await getRoomInfo(jsonData.roomId, user._id);
      ws.send(JSON.stringify({ type: "roomInfo", room: roomInfo }));
    } else if (jsonData.type === "checkRoomExistence") {
      ws.send(
        JSON.stringify({
          type: "checkRoomExistence",
          value: await checkRoomExistence(user._id, jsonData.roomId),
        }),
      );
    }
  });
}
