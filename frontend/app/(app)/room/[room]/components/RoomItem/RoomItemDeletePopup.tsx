"use client";

import Button from "@/app/components/Button";
import Popup from "@/app/components/Popup";
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

  const pathname = usePathname();

  function handlePopupClose() {
    if (!disableForm) props.handleClose();
  }

  async function handleDeleteBtn() {
    setDisableForm(true);
    setInfoMessage("deleting...");

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
      setInfoMessage("Something went wrong!");
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
          Are you sure you want to delete <b>{props.itemTitle}</b>?
        </p>
        {infoMessage && <p className="text-center">{infoMessage}</p>}
        <Button onClick={handleDeleteBtn}>Delete</Button>
        <Button onClick={handleCancelBtn}>Cancel</Button>
      </div>
    </Popup>
  );
};

export default RoomItemDeletePopup;
