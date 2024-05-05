"use client";

import Snackbar from "@/app/components/Snackbar/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImExit } from "react-icons/im";
import LeaveRoomPopup from "./LeaveRoomPopup";

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