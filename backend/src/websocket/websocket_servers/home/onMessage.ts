import CustomWebSocket from "@/websocket/utils/CustomWebSocket";
import { getInitialRooms } from "./messages";
import { User } from "@/setup/database/collections/users";

export function setOnMessage(ws: CustomWebSocket, user: User) {
  ws.on("message", async function message(data) {
    const strData = data.toString();
    if (strData === "getRooms") {
      const initialRooms = await getInitialRooms(user._id);
      ws.send(JSON.stringify({ type: "initialRooms", rooms: initialRooms }));
    }
  });
}
