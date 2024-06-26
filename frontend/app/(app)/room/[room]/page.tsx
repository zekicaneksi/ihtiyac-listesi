"use client";

import Footer, { MenuElementProps } from "@/app/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { User, useUserContext } from "@/app/(app)/context/user_context";
import AddItemPopup from "./components/AddItemPopup";
import RoomItem, { IRoomItem } from "./components/RoomItem/RoomItem";
import { FaArrowDownLong } from "react-icons/fa6";
import { useLanguageContext } from "@/app/context/LanguageContext";

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
    }
  | {
      type: "closeRoom";
      roomId: string;
    }
  | {
      type: "removeMember";
      roomId: string;
    };

const Room = () => {
  const [roomItems, setRoomItems] = useState<IRoomItem[]>([]);

  const [showAddItemPopup, setShowAddItemPopup] = useState<boolean>(false);

  const { user, setUser, wsSendJsonMessage, wsLastJsonMessage } =
    useUserContext();

  const pathname = usePathname();
  const roomId = pathname.substring(pathname.lastIndexOf("/") + 1);

  const router = useRouter();

  const { langMap } = useLanguageContext();

  useEffect(() => {
    wsSendJsonMessage({
      type: "getItems",
      roomId: roomId,
    });
  }, []);

  function handleWSMessage(msg: WSMessage, location: string) {
    if (msg === null || location !== pathname) return;
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
    } else if (msg.type === "closeRoom") {
      router.push("/");
    } else if (msg.type === "removeMember") {
      router.push("/");
    }
  }

  useEffect(() => {
    if (wsLastJsonMessage)
      handleWSMessage(wsLastJsonMessage.message, wsLastJsonMessage.location);
  }, [wsLastJsonMessage]);

  function handleAddItem() {
    setShowAddItemPopup(true);
  }

  function handleAddItemPopupClose() {
    setShowAddItemPopup(false);
  }

  const menuElements: MenuElementProps[] = [
    {
      text: langMap.values.room.room_info,
      onClick: () => {
        router.push(pathname + "/info");
      },
    },
    {
      text: langMap.values.room.room_history,
      onClick: () => {
        router.push(pathname + "/history");
      },
    },
  ];

  const NoItemsSection = () => {
    return (
      <div className="text-highligt flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <p>{langMap.values.room.no_items_info}</p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <p>{langMap.values.room.create_new_item_info1 + " "}</p>
          <IoAddCircle className="size-6" />
          <p>{" " + langMap.values.room.create_new_item_info2}</p>
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
          className="sticky bottom-0 right-0 ml-auto mt-auto size-16 hover:cursor-pointer"
          onClick={handleAddItem}
        >
          <IoAddCircle className="text-highligt h-full w-full hover:brightness-125" />
        </div>
      </div>
      <Footer menuElements={menuElements} />
    </>
  );
};

export default Room;
