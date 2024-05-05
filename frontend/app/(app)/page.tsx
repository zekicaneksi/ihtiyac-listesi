"use client";

import Footer, { MenuElementProps } from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import Room, { IRoom } from "./components/Room/Room";
import CreateRoomPopup from "./components/CreateRoomPopup";
import JoinRoomPopup from "./components/JoinRoomPopup";
import { useUserContext } from "./context/user_context";
import FullPageLoadingScreen from "../components/FullPageLoadingScreen";

type WSMessage =
  | {
      type: "roomCreation";
      roomId: string;
      roomName: string;
    }
  | {
      type: "initialRooms";
      rooms: { _id: string; name: string }[];
    }
  | {
      type: "roomLeave";
      roomId: string;
    }
  | {
      type: "roomJoin";
      roomId: string;
      roomName: string;
    };

export default function Home() {
  const { user, setUser, ws } = useUserContext();

  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(true);

  const [showCreateRoomPopup, setShowCreateRoomPopup] =
    useState<boolean>(false);

  const [showJoinRoomPopup, setShowJoinRoomPopup] = useState<boolean>(false);

  function handleWSMessage(msg: WSMessage) {
    if (msg === null) return;
    if (msg.type === "roomCreation") {
      setRooms((prevState) => [
        ...prevState,
        { roomName: msg.roomName, roomId: msg.roomId },
      ]);
    } else if (msg.type === "initialRooms") {
      setRooms(
        msg.rooms.map((e) => {
          return { roomName: e.name, roomId: e._id };
        }),
      );
      setLoadingRooms(false);
    } else if (msg.type === "roomLeave") {
      setRooms((prevState) => prevState.filter((e) => e.roomId !== msg.roomId));
    } else if (msg.type === "roomJoin") {
      setRooms((prevState) => [
        ...prevState,
        { roomName: msg.roomName, roomId: msg.roomId },
      ]);
    }
  }

  useEffect(() => {
    handleWSMessage(ws.lastJsonMessage);
  }, [ws.lastJsonMessage]);

  useEffect(() => {
    ws.sendMessage("getRooms");
  }, []);

  function handleCreateRoomPopupClose() {
    setShowCreateRoomPopup(false);
  }

  function handleJoinRoomPopupClose() {
    setShowJoinRoomPopup(false);
  }

  const menuElements: MenuElementProps[] = [
    {
      text: "Join Room",
      onClick: () => {
        setShowJoinRoomPopup(true);
      },
    },
    {
      text: "Create Room",
      onClick: () => {
        setShowCreateRoomPopup(true);
      },
    },
  ];

  const NoRoomsSection = () => {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <p>Looks like you are not a part of any room</p>
        <p>You can create or join a room from the menu down below</p>
        <FaArrowDownLong className="size-12" />
      </div>
    );
  };

  return (
    <>
      <FullPageLoadingScreen show={loadingRooms} message="Loading rooms..." />
      <CreateRoomPopup
        isOpen={showCreateRoomPopup}
        handleClose={handleCreateRoomPopupClose}
      />
      <JoinRoomPopup
        isOpen={showJoinRoomPopup}
        handleClose={handleJoinRoomPopupClose}
      />
      {rooms.length === 0 ? (
        <NoRoomsSection />
      ) : (
        <div className="flex-grow">
          {rooms.map((room) => {
            return <Room key={room.roomId} room={room} />;
          })}
        </div>
      )}
      <Footer menuElements={menuElements} />
    </>
  );
}
