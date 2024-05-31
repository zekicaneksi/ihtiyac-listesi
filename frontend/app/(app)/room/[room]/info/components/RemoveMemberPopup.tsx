"use client";

import Button from "@/app/components/Button";
import Popup from "@/app/components/Popup";
import { useLanguageContext } from "@/app/context/LanguageContext";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface RemoveMemberPopupProps {
  memberId: string;
  memberName: string;
  isOpen: boolean;
  handleClose: (result: boolean) => void;
}

function RemoveMemberPopup(props: RemoveMemberPopupProps) {
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [disableForm, setDisableForm] = useState<boolean>(false);

  const { langMap } = useLanguageContext();

  const pathname = usePathname();

  function handlePopupClose(result: boolean) {
    if (!disableForm) props.handleClose(result);
  }

  useEffect(() => {
    setInfoMessage("");
  }, [props.isOpen]);

  async function handleRemoveBtn() {
    setDisableForm(true);
    setInfoMessage(langMap.values.room.removing);

    interface PostData {
      roomId: string;
      memberId: string;
    }

    const response = await fetchBackendPOST<PostData>("/remove-member", {
      roomId: pathname.split("/")[2],
      memberId: props.memberId,
    });

    if (response.status === 200) {
      handlePopupClose(true);
    } else {
      setInfoMessage(langMap.values.room.something_went_wrong);
    }

    setDisableForm(false);
  }

  function handleCancelBtn() {
    handlePopupClose(false);
  }

  return (
    <Popup open={props.isOpen} handleClose={handlePopupClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} m-auto flex w-80  flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <p className="text-center">
          {langMap.values.room.remove_member_info + " "}
          <b>{props.memberName}</b>?
        </p>
        {infoMessage && <p className="text-center">{infoMessage}</p>}
        <Button onClick={handleRemoveBtn}>{langMap.values.room.remove}</Button>
        <Button onClick={handleCancelBtn}>{langMap.values.room.cancel}</Button>
      </div>
    </Popup>
  );
}

export default RemoveMemberPopup;
