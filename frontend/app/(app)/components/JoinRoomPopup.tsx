"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Popup from "@/app/components/Popup";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { useEffect, useState } from "react";

interface JoinRoomPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

function JoinRoomPopup(props: JoinRoomPopupProps) {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");

  const [infoMessage, setInfoMessage] = useState("");

  const [disableForm, setDisableForm] = useState<boolean>(false);

  function handleClose() {
    if (!disableForm) props.handleClose();
  }

  useEffect(() => {
    setInfoMessage("");
    setRoomId("");
    setPassword("");
  }, [props.isOpen]);

  async function handleJoin() {
    setDisableForm(true);
    setInfoMessage("joining room...");

    interface PostData {
      roomId: string;
      password: string;
    }

    const response = await fetchBackendPOST<PostData>("/join-room", {
      roomId: roomId,
      password: password,
    });

    if (response.status === 200) {
      handleClose();
    } else if (response.status === 404) {
      setInfoMessage("room not found");
    } else if (response.status === 401) {
      setInfoMessage("incorrect password");
    } else if (response.status === 406) {
      setInfoMessage("already a member of room");
    } else {
      setInfoMessage("something went wrong");
    }

    setDisableForm(false);
  }
  return (
    <Popup open={props.isOpen} handleClose={handleClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} z-20 flex w-80 flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <Input
          value={roomId}
          setValue={setRoomId}
          placeholder="room id"
          type="text"
        />
        <Input
          value={password}
          setValue={setPassword}
          placeholder="room password"
          type="password"
        />
        {infoMessage !== "" && (
          <p className="self-center text-center text-base text-gray-100">
            {infoMessage}
          </p>
        )}
        <Button onClick={handleJoin}>Join</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Popup>
  );
}

export default JoinRoomPopup;
