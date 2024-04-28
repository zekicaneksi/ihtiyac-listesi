import { Session } from "@/setup/database/collections/sessions";
import { User } from "@/setup/database/collections/users";
import { WebSocket, WebSocketServer } from "ws";

const wsServer = new WebSocketServer({ noServer: true });

wsServer.on(
  "connection",
  function connection(ws: WebSocket, session: Session, user: User) {
    ws.on("error", console.error);

    console.log(session);
    console.log(user);

    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });

    ws.send("something");
  },
);

export default wsServer;
