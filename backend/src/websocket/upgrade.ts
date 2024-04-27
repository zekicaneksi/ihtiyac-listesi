import internal from "stream";
import wssHome from "./websocket_servers/home";
import { IncomingMessage } from "http";

async function upgrade(
  request: IncomingMessage,
  socket: internal.Duplex,
  head: Buffer,
) {
  const pathname = request.url;

  if (pathname === "/ws/") {
    wssHome.handleUpgrade(request, socket, head, function done(ws) {
      wssHome.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
}

export default upgrade;
