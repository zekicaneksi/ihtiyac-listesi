import { WebSocketServer } from "ws";
import CustomWebSocket from "./CustomWebSocket";

export function getHeartbeatInterval(wsServer: WebSocketServer) {
  return setInterval(function ping() {
    (wsServer.clients as Set<CustomWebSocket>).forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
}

export function setWebSocketHeartbeatListeners(ws: CustomWebSocket) {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });
}
