"use client";

import Footer, { MenuElementProps } from "@/app/components/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useUserContext } from "@/app/(app)/context/user_context";
import AddRoomPopup from "./components/AddRoomPopup";
import RoomItem, { IRoomItem } from "./components/RoomItem";
import { FaArrowDownLong } from "react-icons/fa6";

type WSMessage =
  | { type: "initialItems"; items: IRoomItem[] }
  | { type: "itemAdd"; item: IRoomItem };

const Room = () => {
  const [roomItems, setRoomItems] = useState<IRoomItem[]>([]);

  const [showAddRoomPopup, setShowAddRoomPopup] = useState<boolean>(false);

  const { user, setUser, ws } = useUserContext();

  const pathname = usePathname();

  useEffect(() => {
    ws.sendJsonMessage({
      type: "getItems",
      roomId: pathname.substring(pathname.lastIndexOf("/") + 1),
    });
  }, []);

  function handleWSMessage(msg: WSMessage) {
    if (msg === null) return;
    if (msg.type === "initialItems") {
      setRoomItems(msg.items);
    } else if (msg.type === "itemAdd") {
      setRoomItems((prevState) => [...prevState, msg.item]);
    }
  }

  useEffect(() => {
    handleWSMessage(ws.lastJsonMessage);
  }, [ws.lastJsonMessage]);

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

  const NoItemsSection = () => {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <p>Looks like your room has no items yet</p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <p>You can create a new item with the </p>
          <IoAddCircle className="size-6" />
          <p> button at the right-bottom corner</p>
        </div>
        <FaArrowDownLong className="size-12 -rotate-45" />
      </div>
    );
  };

  return (
    <>
      <AddRoomPopup
        isOpen={showAddRoomPopup}
        handleClose={handleAddRoomPopupClose}
      />
      <div className="flex flex-grow flex-col overflow-auto">
        {roomItems.length === 0 ? (
          <NoItemsSection />
        ) : (
          roomItems.map((e) => <RoomItem {...e} key={e._id} />)
        )}
        <div
          className="sticky bottom-0 right-0 ml-auto mt-auto size-12 hover:cursor-pointer md:size-16"
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
