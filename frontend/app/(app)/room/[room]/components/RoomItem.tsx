"use client";

import { User } from "@/app/(app)/context/user_context";
import Button from "@/app/components/Button";
import ProfilePicture from "@/app/components/ProfilePicture";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname } from "next/navigation";
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
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const pathname = usePathname();

  function handleDivOnClick() {
    if (isDisabled) return;
    setIsExpanded((prevState) => !prevState);
  }

  async function handleWillBuyOnClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();

    setIsDisabled(true);

    interface PostData {
      roomId: string;
      itemId: string;
    }
    const response = await fetchBackendPOST<PostData>("/will-buy", {
      roomId: pathname.substring(pathname.lastIndexOf("/") + 1),
      itemId: props._id,
    });

    if (response.status === 201) setIsDisabled(false);
  }

  function handleBoughtOnClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    console.log("bought");
  }

  return (
    <div
      className={`relative flex flex-col border-b-2 border-black bg-element p-4 ${isDisabled ? "cursor-default opacity-70" : "hover:cursor-pointer hover:brightness-105"}`}
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
              <ProfilePicture address={props.willBeBoughtBy.profilePictureId} />
            )}
            <p>{props.willBeBoughtBy ? props.willBeBoughtBy.fullname : "-"}</p>
          </div>
          <div className="mt-4 flex flex-row justify-center gap-4 sm:justify-normal">
            <Button
              bgColor="bg-background"
              onClick={handleWillBuyOnClick}
              disabled={isDisabled}
            >
              Will Buy
            </Button>
            <Button
              bgColor="bg-background"
              onClick={handleBoughtOnClick}
              disabled={isDisabled}
            >
              Bought
            </Button>
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
