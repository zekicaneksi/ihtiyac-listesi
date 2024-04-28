import express from "express";
import checkSession from "@/middleware/checkSession";

import hello from "./routes/hello";
import login from "./routes/login";
import logout from "./routes/logout";
import register from "./routes/register";
import createRoom from "./routes/create_room";

const router = express.Router();

router.get("/hello", checkSession, hello);
router.post("/login", login);
router.get("/logout", checkSession, logout);
router.post("/register", register);
router.post("/create-room", checkSession, createRoom);

export default router;