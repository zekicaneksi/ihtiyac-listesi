"use client";

import Popup from "@/app/components/Popup";
import Snackbar from "@/app/components/Snackbar/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImExit } from "react-icons/im";

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

export interface IRoom {
  roomName: string;
  roomId: string;
}

interface RoomProps {
  room: IRoom;
}

const Room = (props: RoomProps) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [showLeaveRoomPopup, setShowLeaveRoomPopup] = useState<boolean>(false);

  const router = useRouter();

  async function leaveRoom(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setShowLeaveRoomPopup(true);
  }

  async function copyRoomId(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    navigator.clipboard.writeText(props.room.roomId);
    setIsSnackbarOpen(true);
  }

  return (
    <>
      <Snackbar
        message={"Copied to clipboard"}
        onClose={() => {
          setIsSnackbarOpen(false);
        }}
        open={isSnackbarOpen}
      />
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

export default Room;
