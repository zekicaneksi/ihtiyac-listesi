import CustomWebSocket from "@/websocket/utils/CustomWebSocket";
import {
  getInitialHistoryItems,
  getInitialItems,
  getInitialRooms,
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
      );
      if (initialHistoryItems)
        ws.send(
          JSON.stringify({
            type: "initialHistoryItems",
            items: initialHistoryItems,
          }),
        );
    }
  });
}
