"use client";

import Button from "@/app/components/Button";
import Popup from "@/app/components/Popup";
import Snackbar from "@/app/components/Snackbar/Snackbar";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImExit } from "react-icons/im";

interface LeaveRoomPopupProps {
  room: IRoom;
  isOpen: boolean;
  handleClose: () => void;
}

const LeaveRoomPopup = (props: LeaveRoomPopupProps) => {
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    setInfoMessage("");
  }, [props.isOpen]);

  async function handleYes() {
    setDisableForm(true);
    setInfoMessage("leaving room...");

    interface PostData {
      roomId: string;
    }

    const response = await fetchBackendPOST<PostData>("/leave-room", {
      roomId: props.room.roomId,
    });

    if (response.status === 200) {
      props.handleClose();
    } else {
      setInfoMessage("Something went wrong!");
    }
  }
  async function handleNo() {
    props.handleClose();
  }

  return (
    <Popup
      open={props.isOpen}
      handleClose={() => {
        props.handleClose();
      }}
    >
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} z-20 flex w-80 flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <p className="text-center">
          Do you want to leave room <b>{props.room.roomName}</b>?
        </p>
        {infoMessage !== "" && (
          <p className="self-center text-center text-base text-gray-100">
            {infoMessage}
          </p>
        )}
        <div className="flex flex-row gap-4 [&>button]:flex-grow">
          <Button onClick={handleYes}>Yes</Button>
          <Button onClick={handleNo}>No</Button>
        </div>
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
