import internal from "stream";
import wssHome from "./websocket_servers/home";
import { IncomingMessage } from "http";
import cookie from "cookie";
import dbCon from "@/setup/database/db_setup";
import { Session } from "@/setup/database/collections/sessions";
import { ObjectId } from "mongodb";
import { User } from "@/setup/database/collections/users";

async function authenticateUser(request: IncomingMessage): Promise<{
  user: User | null;
  session: Session | null;
  status: "unauthenticated" | "internalerr" | "authenticated";
}> {
  let cookies = cookie.parse(request.headers.cookie || "");
  let sessionId: string = cookies.sessionid;

  if (!sessionId) {
    return { user: null, session: null, status: "unauthenticated" };
  }

  let session = await dbCon
    .collection<Session>("sessions")
    .findOne({ _id: new ObjectId(sessionId) });

  if (!session) {
    return { user: null, session: null, status: "unauthenticated" };
  }

  let user = await dbCon
    .collection<User>("users")
    .findOne({ _id: session.user_id });

  if (!user) {
    return { user: null, session: session, status: "internalerr" };
  }

  return { user: user, session: session, status: "authenticated" };
}

function onSocketError(err: Error) {
  console.error(err);
}

async function upgrade(
  request: IncomingMessage,
  socket: internal.Duplex,
  head: Buffer,
) {
  socket.on("error", onSocketError);

  function rejectConnection(msg: string) {
    socket.write(msg);
    socket.destroy();
  }

  // Authenticating user
  const { user, session, status } = await authenticateUser(request);

  if (status === "unauthenticated") {
    rejectConnection("HTTP/1.1 401 Unauthorized\r\n\r\n");
  } else if (status === "internalerr") {
    rejectConnection("HTTP/1.1 500 Internal Server Error\r\n\r\n");
  } else {
    // Upgrade Request
    socket.removeListener("error", onSocketError);
    const pathname = request.url;

    if (pathname === "/ws/") {
      wssHome.handleUpgrade(request, socket, head, function done(ws) {
        wssHome.emit("connection", ws, session, user);
      });
    } else {
      socket.destroy();
    }
  }
}

export default upgrade;
