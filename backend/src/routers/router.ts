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
import boughtItem from "./routes/bought_item";
import deleteItem from "./routes/delete_item";
import editItem from "./routes/edit_item";
import removeMember from "./routes/remove_member";
import closeRoom from "./routes/close_room";

const router = express.Router();

router.use("/public", express.static(appRootPath + "/../public"));

router.post("/login", login);
router.post("/register", register);

router.get("/hello", checkSession, hello);
router.get("/logout", checkSession, logout);
router.post("/create-room", checkSession, createRoom);
router.post("/leave-room", checkSession, leaveRoom);
router.post("/join-room", checkSession, joinRoom);
router.post("/upload-picture", checkSession, uploadPicture);
router.post("/add-item", checkSession, addItem);
router.post("/will-buy", checkSession, willBuy);
router.post("/cancel-will-buy", checkSession, cancelWillBuy);
router.post("/bought-item", checkSession, boughtItem);
router.post("/delete-item", checkSession, deleteItem);
router.post("/edit-item", checkSession, editItem);
router.post("/remove-member", checkSession, removeMember);
router.post("/close-room", checkSession, closeRoom);

export default router;
