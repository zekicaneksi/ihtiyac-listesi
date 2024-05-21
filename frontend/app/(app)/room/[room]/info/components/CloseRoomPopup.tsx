"use client";

import Button from "@/app/components/Button";
import Popup from "@/app/components/Popup";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface CloseRoomPopupProps {
  roomName: string;
  isOpen: boolean;
  handleClose: () => void;
}

const CloseRoomPopup = (props: CloseRoomPopupProps) => {
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState("");

  const pathname = usePathname();
  const roomId = pathname.split("/")[2];

  function handleClose() {
    if (!disableForm) props.handleClose();
  }

  useEffect(() => {
    setInfoMessage("");
  }, [props.isOpen]);

  async function handleYes() {
    setDisableForm(true);
    setInfoMessage("closing room...");

    interface PostData {
      roomId: string;
    }

    const response = await fetchBackendPOST<PostData>("/close-room", {
      roomId: roomId,
    });

    if (response.status === 200) {
      handleClose();
    } else {
      setInfoMessage("Something went wrong!");
    }
  }
  async function handleNo() {
    handleClose();
  }

  return (
    <Popup open={props.isOpen} handleClose={handleClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} z-20 flex w-80 flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <p className="text-center">
          Do you want to close room <b>{props.roomName}</b>?
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

export default CloseRoomPopup;
