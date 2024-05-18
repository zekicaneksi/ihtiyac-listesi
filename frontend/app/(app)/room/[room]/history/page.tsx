"use client";

import { useUserContext } from "@/app/(app)/context/user_context";
import Footer from "@/app/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HistoryRoomItem, {
  IHistoryRoomItem,
} from "./components/RoomHistoryItem";

type WSMessage =
  | { type: "initialHistoryItems"; items: IHistoryRoomItem[] }
  | { type: "historyItemAdd"; roomId: string; item: IHistoryRoomItem };

const History = () => {
  const [historyItems, setHistoryItems] = useState<IHistoryRoomItem[]>([]);

  const { user, setUser, ws } = useUserContext();

  const router = useRouter();

  const pathname = usePathname();

  const roomId = pathname.split("/")[2];

  useEffect(() => {
    ws.sendJsonMessage({
      type: "getHistoryItems",
      roomId: roomId,
    });
  }, []);

  function handleWSMessage(msg: WSMessage) {
    if (msg === null) return;
    if (msg.type !== "initialHistoryItems" && msg.roomId !== roomId) return;
    if (msg.type === "initialHistoryItems") {
      setHistoryItems(
        msg.items.reverse().map((e) => {
          let toReturn = { ...e };
          toReturn.purchaseDate = new Date(e.purchaseDate);
          return toReturn;
        }),
      );
    } else if (msg.type === "historyItemAdd") {
      let newItem = { ...msg.item };
      newItem.purchaseDate = new Date(msg.item.purchaseDate);
      setHistoryItems((prevState) => [newItem, ...prevState]);
    }
  }

  useEffect(() => {
    handleWSMessage(ws.lastJsonMessage);
  }, [ws.lastJsonMessage]);

  return (
    <>
      <div className="flex flex-grow flex-col overflow-auto">
        {historyItems.map((e) => (
          <HistoryRoomItem {...e} key={e._id} />
        ))}
      </div>
      <Footer
        backFunction={() => {
          router.push(pathname.substring(0, pathname.lastIndexOf("/")));
        }}
      />
    </>
  );
};

export default History;
