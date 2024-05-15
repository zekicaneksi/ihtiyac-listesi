"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Popup from "@/app/components/Popup";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AddItemPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AddItemPopup = (props: AddItemPopupProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [infoMessage, setInfoMessage] = useState<string>("");
  const [disableForm, setDisableForm] = useState<boolean>(false);

  const pathname = usePathname();

  function handlePopupClose() {
    if (!disableForm) props.handleClose();
  }

  async function handleAddBtn() {
    if (title.length < 1 || title.length > 60) {
      setInfoMessage("Title must be between 1-60 characters long");
    } else if (description.length > 400) {
      setInfoMessage("Description cannot be longer than 400 characters");
    } else {
      // Validation successful
      // Making the backend request
      setDisableForm(true);
      setInfoMessage("adding...");

      interface PostData {
        title: string;
        description: string;
        roomId: string;
      }

      const response = await fetchBackendPOST<PostData>("/add-item", {
        title: title,
        description: description,
        roomId: pathname.substring(pathname.lastIndexOf("/") + 1),
      });

      if (response.status === 201) {
        handlePopupClose();
      } else {
        setInfoMessage("Something went wrong!");
      }
    }
    setDisableForm(false);
  }

  useEffect(() => {
    setTitle("");
    setDescription("");
    setInfoMessage("");
  }, [props.isOpen]);

  return (
    <Popup open={props.isOpen} handleClose={handlePopupClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} m-auto flex w-80  flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <Input
          type="text"
          placeholder="title..."
          value={title}
          setValue={setTitle}
        />
        <textarea
          className="h-32 resize-none overflow-auto p-2"
          placeholder="description..."
          wrap="off"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {infoMessage && <p className="text-center">{infoMessage}</p>}
        <Button onClick={handleAddBtn}>Add</Button>
      </div>
    </Popup>
  );
};

export default AddItemPopup;
