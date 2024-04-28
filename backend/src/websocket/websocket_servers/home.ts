import { Session } from "@/setup/database/collections/sessions";
import { User } from "@/setup/database/collections/users";
import { WebSocket, WebSocketServer } from "ws";

const wsServer = new WebSocketServer({ noServer: true });

const connectionMap = new Map<Session, { ws: WebSocket; user: User }>();

wsServer.on(
  "connection",
  function connection(ws: WebSocket, session: Session, user: User) {
    connectionMap.set(session, { ws: ws, user: user });

    ws.on("error", console.error);
    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });
    ws.on("close", function close() {
      connectionMap.delete(session);
    });

    ws.send("something");
  },
);

export default wsServer;
