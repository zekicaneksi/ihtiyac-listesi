"use client";

import Button from "@/app/components/Button";
import Popup from "@/app/components/Popup";
import { useLanguageContext } from "@/app/context/LanguageContext";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface RoomItemDeletePopupProps {
  itemTitle: string;
  itemId: string;
  isOpen: boolean;
  handleClose: () => void;
}

const RoomItemDeletePopup = (props: RoomItemDeletePopupProps) => {
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [disableForm, setDisableForm] = useState<boolean>(false);

  const { langMap } = useLanguageContext();

  const pathname = usePathname();

  function handlePopupClose() {
    if (!disableForm) props.handleClose();
  }

  async function handleDeleteBtn() {
    setDisableForm(true);
    setInfoMessage(langMap.values.room.deleting);

    interface PostData {
      itemId: string;
      roomId: string;
    }

    const response = await fetchBackendPOST<PostData>("/delete-item", {
      itemId: props.itemId,
      roomId: pathname.substring(pathname.lastIndexOf("/") + 1),
    });

    if (response.status === 201) {
      handlePopupClose();
    } else {
      setInfoMessage(langMap.values.room.something_went_wrong);
    }

    setDisableForm(false);
  }

  async function handleCancelBtn() {
    handlePopupClose();
  }

  useEffect(() => {
    setInfoMessage("");
  }, [props.isOpen]);

  return (
    <Popup open={props.isOpen} handleClose={handlePopupClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} m-auto flex w-80  flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <p className="text-center">
          {langMap.values.room.delete_inform + " "}
          <b>{props.itemTitle}</b>?
        </p>
        {infoMessage && <p className="text-center">{infoMessage}</p>}
        <Button onClick={handleDeleteBtn}>{langMap.values.room.delete}</Button>
        <Button onClick={handleCancelBtn}>{langMap.values.room.cancel}</Button>
      </div>
    </Popup>
  );
};

export default RoomItemDeletePopup;
