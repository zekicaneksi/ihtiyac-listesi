import { Session } from "@/setup/database/collections/sessions";
import { User } from "@/setup/database/collections/users";
import { WebSocket, WebSocketServer } from "ws";

const wsServer = new WebSocketServer({ noServer: true });

const connectionMap = new Map<Session, { ws: WebSocket; user: User }>();

interface CustomWebSocket extends WebSocket {
  isAlive: boolean;
}

wsServer.on(
  "connection",
  function connection(ws: CustomWebSocket, session: Session, user: User) {
    ws.isAlive = true;
    ws.on("error", console.error);
    ws.on("pong", () => {
      ws.isAlive = true;
    });
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

const interval = setInterval(function ping() {
  (wsServer.clients as Set<CustomWebSocket>).forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wsServer.on("close", function close() {
  clearInterval(interval);
});

export default wsServer;
