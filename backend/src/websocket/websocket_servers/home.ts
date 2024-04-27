import { WebSocketServer } from "ws";

const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});

export default wsServer;
