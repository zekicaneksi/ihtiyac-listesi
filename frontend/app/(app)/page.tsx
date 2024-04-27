"use client";

import Footer, { MenuElementProps } from "@/app/(app)/components/layout/footer";
import { useEffect, useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import Room, { IRoom } from "./components/page/Room";
import { useWs } from "@/app/(app)/hooks/useWebsocket";

export default function Home() {
  const [ready, val, send] = useWs({ url: "/" });

  useEffect(() => {
    if (ready) {
      if (send) {
        send("test message");
      }
    }
  }, [ready, send]); // make sure to include send in dependency array

  console.log(val);

  const [rooms, setRooms] = useState<IRoom[]>([
    { roomId: "123123123123", roomName: "the josenburgh family" },
    { roomId: "4564564546", roomName: "the interoptics company" },
    { roomId: "f2342r123r12r", roomName: "the cryptors family" },
    { roomId: "23523r2323r", roomName: "the fancyness family" },
  ]);

  async function joinRoom() {
    console.log("join room");
  }

  async function createRoom() {
    console.log("create room");
  }

  const menuElements: MenuElementProps[] = [
    {
      text: "Join Room",
      onClick: joinRoom,
    },
    {
      text: "Create Room",
      onClick: createRoom,
    },
  ];

  return (
    <>
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
