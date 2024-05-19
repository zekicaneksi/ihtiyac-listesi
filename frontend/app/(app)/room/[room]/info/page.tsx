"use client";

import { User, useUserContext } from "@/app/(app)/context/user_context";
import Button from "@/app/components/Button";
import Footer from "@/app/components/Footer";
import FullPageLoadingScreen from "@/app/components/FullPageLoadingScreen";
import ProfilePicture from "@/app/components/ProfilePicture";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";

export interface MemberUserProps {
  user: User;
  isAdmin: boolean;
}

const MemberUser = (props: MemberUserProps) => {
  function removeMember() {
    console.log("removing member");
  }

  return (
    <div
      className={`relative flex flex-col border-b-2 border-black bg-element p-4`}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <ProfilePicture address={props.user.profilePictureId} />
          <p>{props.user.fullname}</p>
        </div>
        {props.isAdmin && (
          <div className="self-center">
            <TiDeleteOutline
              className="size-8 text-foreground hover:cursor-pointer hover:brightness-150"
              onClick={removeMember}
            />
          </div>
        )}
      </div>
    </div>
  );
};

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
    console.log("closing room");
  }

  if (!roomInfo) {
    return <FullPageLoadingScreen show={true} message="Loading room..." />;
  }

  const amIAdmin: boolean = roomInfo.creatorId === user._id ? true : false;

  return (
    <>
      <div className="flex flex-grow flex-col overflow-auto">
        <div className="flex items-center justify-center pb-4 pt-4">
          <p className="self-center text-4xl">{roomInfo.name}</p>
        </div>
        {amIAdmin && (
          <div className="flex items-center justify-center">
            <Button onClick={handleCloseRoom}>Close Room</Button>
          </div>
        )}
        <div className="mt-4 flex items-center justify-center">
          <p className="text-2xl">Members</p>
        </div>
        <div className="mt-4">
          {roomInfo.members.map((e) => (
            <MemberUser user={e} isAdmin={amIAdmin} key={e._id} />
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
