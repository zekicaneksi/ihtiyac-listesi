"use client";

import { User } from "@/app/(app)/context/user_context";
import Button from "@/app/components/Button";
import ProfilePicture from "@/app/components/ProfilePicture";
import { useState } from "react";

export interface IRoomItem {
  _id: string;
  title: string;
  description: string;
  addedBy: User;
  willBeBoughtBy: User | null;
}

const RoomItem = (props: IRoomItem) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  function handleDivOnClick() {
    setIsExpanded((prevState) => !prevState);
  }

  return (
    <div
      className="relative flex flex-col border-b-2 border-black bg-element p-4 hover:cursor-pointer hover:brightness-105"
      onClick={handleDivOnClick}
    >
      <p className="text-xl">{props.title}</p>
      <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
        {props.description}
      </p>
      {isExpanded && (
        <div className="mt-5">
          <div className="flex flex-row items-center gap-2">
            <p>{"Added by: "}</p>
            <ProfilePicture address={props.addedBy.profilePictureId} />
            <p>{props.addedBy.fullname}</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p>{"Will buy: "}</p>
            {props.willBeBoughtBy && (
              <ProfilePicture address={props.addedBy.profilePictureId} />
            )}
            <p>{props.willBeBoughtBy ? props.willBeBoughtBy.fullname : "-"}</p>
          </div>
          <div className="mt-4 flex flex-row justify-center gap-4 sm:justify-normal">
            <Button bgColor="bg-background">Will Buy</Button>
            <Button bgColor="bg-background">Bought</Button>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-row justify-between">
        {props.willBeBoughtBy && (
          <div className="flex flex-row items-center justify-center gap-2">
            <ProfilePicture address={props.willBeBoughtBy.profilePictureId} />
            <p>{props.willBeBoughtBy.fullname}</p>
          </div>
        )}
        <div
          className={`${props.willBeBoughtBy ? "" : "ml-auto"} flex flex-row items-center justify-center gap-2`}
        >
          <ProfilePicture address={props.addedBy.profilePictureId} />
          <p>{props.addedBy.fullname}</p>
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
