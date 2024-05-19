"use client";

import { User, useUserContext } from "@/app/(app)/context/user_context";
import Button from "@/app/components/Button";
import Footer from "@/app/components/Footer";
import FullPageLoadingScreen from "@/app/components/FullPageLoadingScreen";
import Popup from "@/app/components/Popup";
import ProfilePicture from "@/app/components/ProfilePicture";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";

interface RemoveMemberPopupProps {
  memberId: string;
  memberName: string;
  isOpen: boolean;
  handleClose: () => void;
}

function RemoveMemberPopup(props: RemoveMemberPopupProps) {
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [disableForm, setDisableForm] = useState<boolean>(false);

  const pathname = usePathname();

  function handlePopupClose() {
    if (!disableForm) props.handleClose();
  }

  useEffect(() => {
    setInfoMessage("");
  }, [props.isOpen]);

  async function handleRemoveBtn() {
    setDisableForm(true);
    setInfoMessage("removing...");

    interface PostData {
      roomId: string;
      memberId: string;
    }

    const response = await fetchBackendPOST<PostData>("/remove-member", {
      roomId: pathname.split("/")[2],
      memberId: props.memberId,
    });

    if (response.status === 200) {
      handlePopupClose();
    } else {
      setInfoMessage("Something went wrong!");
    }

    setDisableForm(false);
  }

  function handleCancelBtn() {
    handlePopupClose();
  }

  return (
    <Popup open={props.isOpen} handleClose={handlePopupClose}>
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} m-auto flex w-80  flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <p className="text-center">
          Are you sure you want to remove member <b>{props.memberName}</b>?
        </p>
        {infoMessage && <p className="text-center">{infoMessage}</p>}
        <Button onClick={handleRemoveBtn}>Remove</Button>
        <Button onClick={handleCancelBtn}>Cancel</Button>
      </div>
    </Popup>
  );
}

export interface MemberUserProps {
  user: User;
  isAdmin: boolean;
  myId: string;
}

const MemberUser = (props: MemberUserProps) => {
  const [showRemoveMemberPopup, setShowRemoveMemberPopup] =
    useState<boolean>(false);

  function handleRemoveMemberPopupClose() {
    setShowRemoveMemberPopup(false);
  }

  return (
    <>
      <RemoveMemberPopup
        memberId={props.user._id}
        memberName={props.user.fullname}
        isOpen={showRemoveMemberPopup}
        handleClose={handleRemoveMemberPopupClose}
      />
      <div
        className={`relative flex flex-col border-b-2 border-black bg-element p-4`}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <ProfilePicture address={props.user.profilePictureId} />
            <p>{props.user.fullname}</p>
          </div>
          {props.isAdmin && props.user._id !== props.myId && (
            <div className="self-center">
              <TiDeleteOutline
                className="size-8 text-foreground hover:cursor-pointer hover:brightness-150"
                onClick={() => {
                  setShowRemoveMemberPopup(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
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

  function handleLeaveRoom() {
    console.log("leaving room");
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
