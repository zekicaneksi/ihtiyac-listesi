"use client";

import Footer, { MenuElementProps } from "@/app/(app)/components/layout/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import Popup from "@/app/components/Popup";

interface LeaveRoomPopupProps {
  room: IRoom;
  isOpen: boolean;
  handleClose: () => void;
}

const LeaveRoomPopup = (props: LeaveRoomPopupProps) => {
  async function handleYes() {
    console.log("clicked yes");
    props.handleClose();
  }
  async function handleNo() {
    console.log("clicked no");
    props.handleClose();
  }

  return (
    <Popup
      open={props.isOpen}
      handleClose={() => {
        props.handleClose();
      }}
    >
      <div className="h-[500px] w-[500px] bg-red-400">
        <p>
          Do you really want to leave <b>{props.room.roomName}</b>?
        </p>
        <button className={"bg-foreground"} onClick={handleYes}>
          yes
        </button>
        <button className={"bg-foreground"} onClick={handleNo}>
          no
        </button>
      </div>
    </Popup>
  );
};

interface IRoom {
  roomName: string;
  roomId: string;
}

interface RoomProps {
  room: IRoom;
}

const Room = (props: RoomProps) => {
  const [showLeaveRoomPopup, setShowLeaveRoomPopup] = useState<boolean>(false);

  const router = useRouter();

  async function leaveRoom(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setShowLeaveRoomPopup(true);
  }

  async function copyRoomId(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    console.log("copy room id:" + props.room.roomId);
    // Also show a little snackbar
  }

  return (
    <>
      <LeaveRoomPopup
        room={props.room}
        isOpen={showLeaveRoomPopup}
        handleClose={() => {
          setShowLeaveRoomPopup(false);
        }}
      />
      <div
        className="relative flex h-24 items-center justify-center border-b-2 border-foreground bg-element hover:cursor-pointer hover:brightness-110"
        onClick={() => {
          router.push(`/room/${props.room.roomId}`);
        }}
      >
        <p className="flex-grow text-center sm:flex-grow-0">
          {props.room.roomName}
        </p>
        <div className="right-0 flex h-full flex-col justify-between p-3 sm:absolute">
          <div
            className="group flex flex-grow flex-col items-center justify-center"
            onClick={leaveRoom}
          >
            <ImExit className="size-8 fill-foreground group-hover:fill-background" />
          </div>
          <div
            className="group flex flex-grow flex-col justify-end"
            onClick={copyRoomId}
          >
            <p className="text-foreground group-hover:text-background">
              {props.room.roomId}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Home() {
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
