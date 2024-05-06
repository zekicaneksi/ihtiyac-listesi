"use client";

import Button from "@/app/components/Button";
import Footer, { MenuElementProps } from "@/app/components/Footer";
import Input from "@/app/components/Input";
import Popup from "@/app/components/Popup";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";

interface AddRoomPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AddRoomPopup = (props: AddRoomPopupProps) => {
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
        <Input
          type="text"
          placeholder="description..."
          value={description}
          setValue={setDescription}
        />
        {infoMessage && <p className="text-center">{infoMessage}</p>}
        <Button onClick={handleAddBtn}>Add</Button>
      </div>
    </Popup>
  );
};

const Room = () => {
  const [showAddRoomPopup, setShowAddRoomPopup] = useState<boolean>(false);

  function handleAddItem() {
    setShowAddRoomPopup(true);
  }

  function handleAddRoomPopupClose() {
    setShowAddRoomPopup(false);
  }

  const menuElements: MenuElementProps[] = [
    {
      text: "Room Info",
      onClick: () => {
        console.log("room info");
      },
    },
    {
      text: "History",
      onClick: () => {
        console.log("history");
      },
    },
  ];

  return (
    <>
      <AddRoomPopup
        isOpen={showAddRoomPopup}
        handleClose={handleAddRoomPopupClose}
      />
      <div className="relative flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <p>Hello from room</p>
        <div
          className="absolute bottom-0 right-0 m-5 size-12 hover:cursor-pointer md:size-16"
          onClick={handleAddItem}
        >
          <IoAddCircle className="h-full w-full" />
        </div>
      </div>
      <Footer menuElements={menuElements} />
    </>
  );
};

export default Room;
