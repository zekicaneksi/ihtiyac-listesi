"use client";

import Footer, { MenuElementProps } from "@/app/(app)/components/layout/footer";
import { useEffect, useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import Room, { IRoom } from "./components/page/Room";
import CreateRoomPopup from "./components/page/CreateRoomPopup";
import FullPageLoadingScreen from "../components/FullPageLoadingScreen";
import useWS from "@/app/(app)/hooks/useWS";

export default function Home() {
  const [fullScreenLoadingMsg, setFullScreenLoadingMsg] = useState<string>("");

  const { lastJsonMessage, readyState } = useWS({ url: "/" });

  // Managing loading screen
  useEffect(() => {
    if (readyState !== 1) setFullScreenLoadingMsg("Connecting real-time...");
    else {
      setFullScreenLoadingMsg("");
    }
  }, [readyState]);

  useEffect(() => {
    console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  const [rooms, setRooms] = useState<IRoom[]>([
    { roomId: "123123123123", roomName: "the josenburgh family" },
    { roomId: "4564564546", roomName: "the interoptics company" },
    { roomId: "f2342r123r12r", roomName: "the cryptors family" },
    { roomId: "23523r2323r", roomName: "the fancyness family" },
  ]);

  const [showCreateRoomPopup, setShowCreateRoomPopup] =
    useState<boolean>(false);

  async function joinRoom() {
    console.log("join room");
  }

  function handleCreateRoomPopupClose() {
    setShowCreateRoomPopup(false);
  }

  const menuElements: MenuElementProps[] = [
    {
      text: "Join Room",
      onClick: joinRoom,
    },
    {
      text: "Create Room",
      onClick: () => {
        setShowCreateRoomPopup(true);
      },
    },
  ];

  return (
    <>
      <FullPageLoadingScreen
        show={fullScreenLoadingMsg === "" ? false : true}
        message={fullScreenLoadingMsg}
      />
      <CreateRoomPopup
        isOpen={showCreateRoomPopup}
        handleClose={handleCreateRoomPopupClose}
      />
      {rooms.length === 0 ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
          <p>Looks like you are not a part of any room</p>
          <p>You can create or join a room from the menu down below</p>
          <FaArrowDownLong className="size-12" />
        </div>
      ) : (
        <div className="flex-grow">
          {rooms.map((room) => {
            return <Room key={room.roomId} room={room} />;
          })}
        </div>
      )}
      <Footer menuElements={menuElements} />
    </>
  );
}
