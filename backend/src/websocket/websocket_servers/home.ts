import { Session } from "@/setup/database/collections/sessions";
import { User } from "@/setup/database/collections/users";
import { WebSocket, WebSocketServer } from "ws";
import CustomWebSocket from "../utils/CustomWebSocket";
import {
  setWebSocketHeartbeatListeners,
  getHeartbeatInterval,
} from "../utils/heartbeat";

const wsServer = new WebSocketServer({ noServer: true });

const connectionMap = new Map<Session, { ws: WebSocket; user: User }>();

wsServer.on(
  "connection",
  function connection(ws: CustomWebSocket, session: Session, user: User) {
    ws.on("error", console.error);

    setWebSocketHeartbeatListeners(ws);

    ws.on("close", function close() {
      connectionMap.delete(session);
    });
    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });

    connectionMap.set(session, { ws: ws, user: user });

    ws.send("something");
  },
);

const interval = getHeartbeatInterval(wsServer);

wsServer.on("close", function close() {
  clearInterval(interval);
});

export default wsServer;
