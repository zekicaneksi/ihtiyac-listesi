"use client";

import Footer, { MenuElementProps } from "@/app/components/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { User, useUserContext } from "@/app/(app)/context/user_context";
import AddItemPopup from "./components/AddItemPopup";
import RoomItem, { IRoomItem } from "./components/RoomItem/RoomItem";
import { FaArrowDownLong } from "react-icons/fa6";

type WSMessage =
  | { type: "initialItems"; items: IRoomItem[] }
  | { type: "itemAdd"; roomId: string; item: IRoomItem }
  | {
      type: "willBuy";
      roomId: string;
      itemId: string;
      willBuyUser: User;
    }
  | {
      type: "cancelWillBuy";
      roomId: string;
      itemId: string;
    }
  | {
      type: "boughtItem";
      roomId: string;
      itemId: string;
    }
  | {
      type: "deleteItem";
      roomId: string;
      itemId: string;
    }
  | {
      type: "editItem";
      roomId: string;
      itemId: string;
      newTitle: string;
      newDescription: string;
    };

const Room = () => {
  const [roomItems, setRoomItems] = useState<IRoomItem[]>([]);

  const [showAddItemPopup, setShowAddItemPopup] = useState<boolean>(false);

  const { user, setUser, ws } = useUserContext();

  const pathname = usePathname();
  const roomId = pathname.substring(pathname.lastIndexOf("/") + 1);

  useEffect(() => {
    ws.sendJsonMessage({
      type: "getItems",
      roomId: roomId,
    });
  }, []);

  function handleWSMessage(msg: WSMessage) {
    if (msg === null) return;
    if (msg.type !== "initialItems" && msg.roomId !== roomId) return;
    if (msg.type === "initialItems") {
      setRoomItems(msg.items);
    } else if (msg.type === "itemAdd") {
      setRoomItems((prevState) => [...prevState, msg.item]);
    } else if (msg.type === "willBuy") {
      setRoomItems((prevState) => {
        const newState = [...prevState];
        const targetItemIndex = newState.findIndex((e) => e._id === msg.itemId);
        newState[targetItemIndex].willBeBoughtBy = msg.willBuyUser;
        return newState;
      });
    } else if (msg.type === "cancelWillBuy") {
      setRoomItems((prevState) => {
        const newState = [...prevState];
        const targetItemIndex = newState.findIndex((e) => e._id === msg.itemId);
        newState[targetItemIndex].willBeBoughtBy = null;
        return newState;
      });
    } else if (msg.type === "boughtItem" || msg.type === "deleteItem") {
      setRoomItems((prevState) =>
        prevState.filter((e) => e._id !== msg.itemId),
      );
    } else if (msg.type === "editItem") {
      setRoomItems((prevState) =>
        prevState.map((e) => {
          if (e._id !== msg.itemId) return e;
          let toReturn = { ...e };
          toReturn.title = msg.newTitle;
          toReturn.description = msg.newDescription;
          return toReturn;
        }),
      );
    }
  }

  useEffect(() => {
    handleWSMessage(ws.lastJsonMessage);
  }, [ws.lastJsonMessage]);

  function handleAddItem() {
    setShowAddItemPopup(true);
  }

  function handleAddItemPopupClose() {
    setShowAddItemPopup(false);
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
      <AddItemPopup
        isOpen={showAddItemPopup}
        handleClose={handleAddItemPopupClose}
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
