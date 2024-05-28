"use client";

import { User } from "@/app/(app)/context/user_context";
import ProfilePicture from "@/app/components/ProfilePicture";
import { useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import RemoveMemberPopup from "./RemoveMemberPopup";
import { RoomInfo } from "../page";

export interface MemberUserProps {
  user: User;
  isAdmin: boolean;
  myId: string;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo | undefined>>;
}

const MemberUser = (props: MemberUserProps) => {
  const [showRemoveMemberPopup, setShowRemoveMemberPopup] =
    useState<boolean>(false);

  function handleRemoveMemberPopupClose(result: boolean) {
    if (result) {
      props.setRoomInfo((prevState) => {
        if (!prevState) return undefined;
        const toReturn = { ...prevState };
        toReturn.members = toReturn.members.filter(
          (e) => e._id !== props.user._id,
        );
        return toReturn;
      });
    }
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

export default MemberUser;
