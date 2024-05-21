"use client";

import { User, useUserContext } from "@/app/(app)/context/user_context";
import Button from "@/app/components/Button";
import Footer from "@/app/components/Footer";
import FullPageLoadingScreen from "@/app/components/FullPageLoadingScreen";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LeaveRoomPopup from "./components/LeaveRoomPopup";
import CloseRoomPopup from "./components/CloseRoomPopup";
import MemberUser from "./components/MemberUser";

type RoomInfo = {
  _id: string;
  creatorId: string;
  name: string;
  members: User[];
};

type WSMessage = {
  type: "roomInfo";
  room: RoomInfo;
};

const Info = () => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo | undefined>();

  const [showLeaveRoomPopup, setShowLeaveRoomPopup] = useState<boolean>(false);
  const [showCloseRoomPopup, setShowCloseRoomPopup] = useState<boolean>(false);

  const { user, setUser, ws } = useUserContext();

  const router = useRouter();
  const pathname = usePathname();
  const roomId = pathname.split("/")[2];

  function handleWSMessage(msg: WSMessage) {
    if (msg === null) return;
    if (msg.type === "roomInfo") {
      setRoomInfo(msg.room);
    }
  }

  useEffect(() => {
    handleWSMessage(ws.lastJsonMessage);
  }, [ws.lastJsonMessage]);

  useEffect(() => {
    ws.sendJsonMessage({
      type: "getRoomInfo",
      roomId: roomId,
    });
  }, []);

  function handleCloseRoom() {
    setShowCloseRoomPopup(true);
  }

  function handleCloseRoomPopupClose() {
    setShowCloseRoomPopup(false);
  }

  function handleLeaveRoom() {
    setShowLeaveRoomPopup(true);
  }

  function handleLeaveRoomPopupClose() {
    setShowLeaveRoomPopup(false);
  }

  if (!roomInfo) {
    return <FullPageLoadingScreen show={true} message="Loading room..." />;
  }

  const amIAdmin: boolean = roomInfo.creatorId === user._id ? true : false;

  return (
    <>
      <LeaveRoomPopup
        roomName={roomInfo.name}
        isOpen={showLeaveRoomPopup}
        handleClose={handleLeaveRoomPopupClose}
      />
      <CloseRoomPopup
        roomName={roomInfo.name}
        isOpen={showCloseRoomPopup}
        handleClose={handleCloseRoomPopupClose}
      />
      <div className="flex flex-grow flex-col overflow-auto">
        <div className="flex items-center justify-center pb-4 pt-4">
          <p className="self-center text-4xl">{roomInfo.name}</p>
        </div>
        <div className="flex items-center justify-center">
          <Button onClick={amIAdmin ? handleCloseRoom : handleLeaveRoom}>
            {amIAdmin ? "Close Room" : "Leave Room"}
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <p className="text-2xl">Members</p>
        </div>
        <div className="mt-4">
          {roomInfo.members.map((e) => (
            <MemberUser
              user={e}
              isAdmin={amIAdmin}
              myId={user._id}
              key={e._id}
            />
          ))}
        </div>
      </div>

      <Footer
        backFunction={() => {
          router.push(pathname.substring(0, pathname.lastIndexOf("/")));
        }}
      />
    </>
  );
};

export default Info;
