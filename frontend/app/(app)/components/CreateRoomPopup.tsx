"use client";

import { useEffect, useState } from "react";

import Popup from "@/app/components/Popup";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { fetchBackendPOST } from "@/app/utils/fetch";
import regexp from "@/app/utils/regexp";
import { useLanguageContext } from "@/app/context/LanguageContext";

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

  const { langMap } = useLanguageContext();

  async function handleCreate() {
    // Validating Inputs
    if (roomName.length > 40 || roomName.length < 2) {
      setInfoMessage(langMap.values.root_page.room_name_length);
    } else if (RegExp(regexp.containsWhiteSpace).test(password)) {
      setInfoMessage(langMap.values.root_page.room_password_space);
    } else if (password.length < 8 || password.length > 20) {
      setInfoMessage(langMap.values.root_page.room_password_length);
    } else if (password !== passwordAgain) {
      setInfoMessage(langMap.values.root_page.room_password_match);
    } else {
      // Validation successful
      // Making the backend request
      setDisableForm(true);
      setInfoMessage(langMap.values.root_page.creating_room);

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
        setInfoMessage(langMap.values.root_page.something_went_wrong);
      }
    }
    setDisableForm(false);
  }

  return (
    <Popup open={props.isOpen} handleClose={handleClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} z-20 flex w-80 flex-col gap-4 rounded bg-foreground px-4 py-4`}
      >
        <Input
          value={roomName}
          setValue={setRoomName}
          placeholder={langMap.values.root_page.room_name}
          type="text"
        />
        <Input
          value={password}
          setValue={setPassword}
          placeholder={langMap.values.root_page.room_password}
          type="password"
        />
        <Input
          value={passwordAgain}
          setValue={setPasswordAgain}
          placeholder={langMap.values.root_page.room_password_again}
          type="password"
        />
        {infoMessage !== "" && (
          <p className="self-center text-center text-base text-gray-100">
            {infoMessage}
          </p>
        )}
        <Button onClick={handleCreate}>
          {langMap.values.root_page.create}
        </Button>
        <Button onClick={handleClose}>{langMap.values.root_page.cancel}</Button>
      </div>
    </Popup>
  );
}

export default CreateRoomPopup;
