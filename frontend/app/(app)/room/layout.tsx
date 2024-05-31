"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useUserContext } from "@/app/(app)/context/user_context";
import FullPageLoadingScreen from "@/app/components/FullPageLoadingScreen";
import { useLanguageContext } from "@/app/context/LanguageContext";

interface ChildrenProps {
  children: ReactNode;
}

type WSMessage = {
  type: "checkRoomExistence";
  value: boolean;
};

const Layout = ({ children }: ChildrenProps) => {
  const [roomExists, setRoomExists] = useState<boolean | undefined>();

  const { wsSendJsonMessage, wsLastJsonMessage } = useUserContext();

  const router = useRouter();
  const pathname = usePathname();

  const { langMap } = useLanguageContext();

  function handleWSMessage(msg: WSMessage, location: string) {
    if (msg === null || pathname !== location) return;
    if (msg.type === "checkRoomExistence") {
      if (msg.value === true) setRoomExists(true);
      else setRoomExists(false);
    }
  }

  useEffect(() => {
    if (roomExists === false) router.push("/");
  }, [roomExists]);

  useEffect(() => {
    wsSendJsonMessage({
      type: "checkRoomExistence",
      roomId: pathname.split("/")[2],
    });
  }, [pathname]);

  useEffect(() => {
    if (wsLastJsonMessage)
      handleWSMessage(wsLastJsonMessage.message, wsLastJsonMessage.location);
  }, [wsLastJsonMessage]);

  if (roomExists === undefined)
    return (
      <FullPageLoadingScreen
        show={true}
        message={langMap.values.room.check_room_exist}
      />
    );
  else if (roomExists === false) {
    return <p>{"Room does not exist..."}</p>;
  } else return <>{children}</>;
};

export default Layout;
