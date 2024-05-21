"use client";

import Snackbar from "@/app/components/Snackbar/Snackbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";

export interface IRoom {
  roomName: string;
  roomId: string;
}

interface RoomProps {
  room: IRoom;
}

const Room = (props: RoomProps) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const router = useRouter();

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
      <div
        className="relative flex h-24 items-center justify-center border-b-2 border-foreground bg-element hover:cursor-pointer hover:brightness-110"
        onClick={() => {
          router.push(`/room/${props.room.roomId}`);
        }}
      >
        <p className="flex-grow text-center sm:flex-grow-0">
          {props.room.roomName}
        </p>
        <div
          className="group right-0 flex h-full flex-col justify-between p-3 sm:absolute"
          onClick={copyRoomId}
        >
          <div className="flex flex-grow flex-col items-center justify-center">
            <FaCopy className="size-8 fill-foreground group-hover:fill-background" />
          </div>
          <div className="flex flex-grow flex-col justify-end">
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