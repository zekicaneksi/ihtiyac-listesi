import express, { Express } from "express";
import router from "@/routers/router";

const app: Express = express();

app.use(express.json());

app.use("/api", router);

export default app;
