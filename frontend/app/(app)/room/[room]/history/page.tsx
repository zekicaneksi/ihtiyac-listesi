"use client";

import { useUserContext } from "@/app/(app)/context/user_context";
import Footer from "@/app/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import HistoryRoomItem, {
  IHistoryRoomItem,
} from "./components/RoomHistoryItem";
import FullPageLoadingScreen from "@/app/components/FullPageLoadingScreen";

type WSMessage =
  | { type: "initialHistoryItems"; items: IHistoryRoomItem[] }
  | { type: "historyItemAdd"; roomId: string; item: IHistoryRoomItem };

const History = () => {
  const [historyItems, setHistoryItems] = useState<IHistoryRoomItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [endOfData, setEndOfData] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<number>(0);

  const { user, setUser, ws } = useUserContext();

  const router = useRouter();

  const pathname = usePathname();
  const roomId = pathname.split("/")[2];

  const bodyRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(() => {
    if (endOfData || isLoading) return;
    setIsLoading(true);
    ws.sendJsonMessage({
      type: "getHistoryItems",
      roomId: roomId,
      page: page,
    });
    setPage(page + 1);
  }, [page, isLoading]);

  function handleScroll() {
    if (!bodyRef.current) return;
    setScrollTop(bodyRef.current.scrollTop);
  }

  useEffect(() => {
    if (!bodyRef.current) return;

    if (
      bodyRef.current.scrollTop +
        bodyRef.current.clientHeight +
        bodyRef.current.clientHeight / 2 <=
        bodyRef.current.scrollHeight ||
      isLoading
    ) {
      return;
    }

    fetchData();
  }, [scrollTop]);

  useEffect(() => {
    if (
      bodyRef.current &&
      bodyRef.current.clientHeight >= bodyRef.current.scrollHeight
    ) {
      fetchData();
    }
  }, [historyItems]);

  function handleWSMessage(msg: WSMessage) {
    if (msg === null) return;
    if (msg.type !== "initialHistoryItems" && msg.roomId !== roomId) return;
    if (msg.type === "initialHistoryItems") {
      setIsLoading(false);
      if (msg.items.length === 0) {
        setEndOfData(true);
        return;
      }
      // Check for same page
      if (historyItems.length !== 0 && historyItems[0]._id === msg.items[0]._id)
        return;
      setHistoryItems((prevState) => {
        return [
          ...prevState,
          ...msg.items.map<IHistoryRoomItem>((e) => {
            let toReturn = { ...e };
            toReturn.purchaseDate = new Date(e.purchaseDate);
            return toReturn;
          }),
        ];
      });
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
      <FullPageLoadingScreen show={isLoading} message={"loading items..."} />
      <div
        className="flex flex-grow flex-col overflow-auto"
        ref={bodyRef}
        onScroll={handleScroll}
      >
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
