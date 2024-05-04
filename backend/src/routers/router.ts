import express from "express";
import checkSession from "@/middleware/checkSession";

import hello from "./routes/hello";
import login from "./routes/login";
import logout from "./routes/logout";
import register from "./routes/register";
import createRoom from "./routes/create_room";
import leaveRoom from "./routes/leave_room";
import joinRoom from "./routes/join_room";
import uploadPicture from "./routes/upload_picture";
import { appRootPath } from "..";

const router = express.Router();

router.use("/public", express.static(appRootPath + "/../public"));

router.get("/hello", checkSession, hello);
router.post("/login", login);
router.get("/logout", checkSession, logout);
router.post("/register", register);
router.post("/create-room", checkSession, createRoom);
router.post("/leave-room", checkSession, leaveRoom);
router.post("/join-room", checkSession, joinRoom);
router.post("/upload-picture", checkSession, uploadPicture);

export default router;
