import { WebSocket } from "ws";

interface CustomWebSocket extends WebSocket {
  isAlive: boolean;
}

export default CustomWebSocket;
