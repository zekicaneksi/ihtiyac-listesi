"use client";

import { useEffect, useState } from "react";

import Popup from "@/app/components/Popup";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { fetchBackendPOST } from "@/app/utils/fetch";
import regexp from "@/app/utils/regexp";

interface CreateRoomPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

function CreateRoomPopup(props: CreateRoomPopupProps) {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [disableForm, setDisableForm] = useState<boolean>(false);

  function handleClose() {
    if (!disableForm) props.handleClose();
  }

  useEffect(() => {
    setInfoMessage("");
    setRoomName("");
    setPassword("");
    setPasswordAgain("");
  }, [props.isOpen]);

  async function handleCreate() {
    // Validating Inputs
    if (roomName.length > 40 || roomName.length < 2) {
      setInfoMessage("Room name must be between 2-40 characters long");
    } else if (RegExp(regexp.containsWhiteSpace).test(password)) {
      setInfoMessage("Password cannot contain whitespaces");
    } else if (password.length < 8 || password.length > 20) {
      setInfoMessage("Password must be 8-20 characters long");
    } else if (password !== passwordAgain) {
      setInfoMessage("Passwords do not match");
    } else {
      // Validation successful
      // Making the backend request
      setDisableForm(true);
      setInfoMessage("creating room...");

      interface PostData {
        name: string;
        password: string;
      }

      const response = await fetchBackendPOST<PostData>("/create-room", {
        name: roomName,
        password: password,
      });

      if (response.status === 201) {
        // Creation successful
        handleClose();
      } else {
        setInfoMessage("Something went wrong!");
      }
    }
    setDisableForm(false);
  }

  return (
    <Popup open={props.isOpen} handleClose={handleClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} z-20 flex w-80 flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <Input
          value={roomName}
          setValue={setRoomName}
          placeholder="room name"
          type="text"
        />
        <Input
          value={password}
          setValue={setPassword}
          placeholder="room password"
          type="password"
        />
        <Input
          value={passwordAgain}
          setValue={setPasswordAgain}
          placeholder="room password again"
          type="password"
        />
        {infoMessage !== "" && (
          <p className="self-center text-center text-base text-gray-100">
            {infoMessage}
          </p>
        )}
        <Button onClick={handleCreate}>Create</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Popup>
  );
}

export default CreateRoomPopup;
