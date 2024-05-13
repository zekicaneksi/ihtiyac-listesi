"use client";

import { User, useUserContext } from "@/app/(app)/context/user_context";
import Button from "@/app/components/Button";
import ProfilePicture from "@/app/components/ProfilePicture";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GrEdit } from "react-icons/gr";
import { TiDeleteOutline } from "react-icons/ti";
import RoomItemDeletePopup from "./RoomItemDeletePopup";

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

  const [showDeleteItemPopup, setShowDeleteItemPopup] =
    useState<boolean>(false);

  const { user, setUser, ws } = useUserContext();

  const pathname = usePathname();
  const roomId = pathname.substring(pathname.lastIndexOf("/") + 1);

  const willBeBoughtByMe =
    props.willBeBoughtBy?._id === user._id ? true : false;

  function handleDivOnClick() {
    if (isDisabled) return;
    setIsExpanded((prevState) => !prevState);
  }

  async function handleDeleteItemPopupClose() {
    setShowDeleteItemPopup(false);
  }

  async function handleWillBuyOnClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();

    setIsDisabled(true);

    interface PostData {
      roomId: string;
      itemId: string;
    }
    const response = await fetchBackendPOST<PostData>("/will-buy", {
      roomId: roomId,
      itemId: props._id,
    });

    if (response.status === 201) setIsDisabled(false);
  }

  async function handleWillNotBuyOnClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();

    setIsDisabled(true);

    interface PostData {
      roomId: string;
      itemId: string;
    }
    const response = await fetchBackendPOST<PostData>("/cancel-will-buy", {
      roomId: roomId,
      itemId: props._id,
    });

    if (response.status === 201) setIsDisabled(false);
  }

  async function handleBoughtOnClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();

    setIsDisabled(true);

    interface PostData {
      roomId: string;
      itemId: string;
    }
    const response = await fetchBackendPOST<PostData>("/bought-item", {
      roomId: roomId,
      itemId: props._id,
    });

    if (response.status === 201) setIsDisabled(false);
  }

  async function handleEditOnClick(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();

    console.log("clicked edit");
  }

  async function handleDeleteOnClick(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();

    setShowDeleteItemPopup(true);
  }

  return (
    <>
      <RoomItemDeletePopup
        isOpen={showDeleteItemPopup}
        handleClose={handleDeleteItemPopupClose}
        itemTitle={props.title}
        itemId={props._id}
      />
      <div
        className={`relative flex flex-col border-b-2 border-black bg-element p-4 ${isDisabled ? "cursor-default opacity-70" : "hover:cursor-pointer hover:brightness-105"}`}
        onClick={handleDivOnClick}
      >
        <p className="text-xl">{props.title}</p>
        <p
          className={`${isExpanded ? "w-5/6" : "w-1/3 overflow-hidden text-ellipsis whitespace-nowrap"}`}
        >
          {props.description}
        </p>
        {isExpanded && (
          <>
            {props.addedBy._id === user._id && (
              <div className="absolute right-0 top-0 mr-4 mt-4 flex flex-col gap-2">
                <TiDeleteOutline
                  className="size-8 text-foreground hover:brightness-150"
                  onClick={handleDeleteOnClick}
                />
                <GrEdit
                  className="size-8 text-foreground hover:brightness-150"
                  onClick={handleEditOnClick}
                />
              </div>
            )}
            <div className="mt-5">
              <div className="flex flex-row items-center gap-2">
                <p>{"Added by: "}</p>
                <ProfilePicture address={props.addedBy.profilePictureId} />
                <p>{props.addedBy.fullname}</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p>{"Will buy: "}</p>
                {props.willBeBoughtBy && (
                  <ProfilePicture
                    address={props.willBeBoughtBy.profilePictureId}
                  />
                )}
                <p>
                  {props.willBeBoughtBy ? props.willBeBoughtBy.fullname : "-"}
                </p>
              </div>
              <div className="mt-4 flex flex-row justify-center gap-4 sm:justify-normal">
                <Button
                  bgColor="bg-background"
                  onClick={
                    willBeBoughtByMe
                      ? handleWillNotBuyOnClick
                      : handleWillBuyOnClick
                  }
                  disabled={isDisabled}
                >
                  {willBeBoughtByMe ? "Will Not Buy" : "Will Buy"}
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
          </>
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
    </>
  );
};

export default RoomItem;
