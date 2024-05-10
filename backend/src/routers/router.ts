import express from "express";
import checkSession from "@/middleware/checkSession";

import { appRootPath } from "..";

import hello from "./routes/hello";
import login from "./routes/login";
import logout from "./routes/logout";
import register from "./routes/register";
import createRoom from "./routes/create_room";
import leaveRoom from "./routes/leave_room";
import joinRoom from "./routes/join_room";
import uploadPicture from "./routes/upload_picture";
import addItem from "./routes/add_item";
import willBuy from "./routes/will_buy";
import cancelWillBuy from "./routes/cancel_will_buy";

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
router.post("/add-item", checkSession, addItem);
router.post("/will-buy", checkSession, willBuy);
router.post("/cancel-will-buy", checkSession, cancelWillBuy);

export default router;
