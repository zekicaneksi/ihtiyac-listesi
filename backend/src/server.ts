import { createServer } from "http";
import app from "./app";
import upgrade from "./websocket/upgrade";

const server = createServer(app);

server.on("upgrade", upgrade);

export default server;
