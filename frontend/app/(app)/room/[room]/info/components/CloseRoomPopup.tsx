"use client";

import Button from "@/app/components/Button";
import Popup from "@/app/components/Popup";
import { useLanguageContext } from "@/app/context/LanguageContext";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CloseRoomPopupProps {
  roomName: string;
  isOpen: boolean;
  handleClose: () => void;
}

const CloseRoomPopup = (props: CloseRoomPopupProps) => {
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState("");

  const { langMap } = useLanguageContext();

  const router = useRouter();
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
    setInfoMessage(langMap.values.room.closing_room);

    interface PostData {
      roomId: string;
    }

    const response = await fetchBackendPOST<PostData>("/close-room", {
      roomId: roomId,
    });

    if (response.status === 200) {
      router.push("/");
      handleClose();
    } else {
      setInfoMessage(langMap.values.room.something_went_wrong);
    }
  }
  async function handleNo() {
    handleClose();
  }

  return (
    <Popup open={props.isOpen} handleClose={handleClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} z-20 flex w-80 flex-col gap-4 rounded bg-foreground px-4 py-4`}
      >
        <p className="text-center text-gray-100">
          {langMap.values.room.close_room_info + " "}
          <b>{props.roomName}</b>?
        </p>
        {infoMessage !== "" && (
          <p className="self-center text-center text-base text-gray-100">
            {infoMessage}
          </p>
        )}
        <div className="flex flex-row gap-4 [&>button]:flex-grow">
          <Button onClick={handleYes}>{langMap.values.room.yes}</Button>
          <Button onClick={handleNo}>{langMap.values.room.no}</Button>
        </div>
      </div>
    </Popup>
  );
};

export default CloseRoomPopup;
