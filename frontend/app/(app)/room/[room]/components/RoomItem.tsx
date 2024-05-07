"use client";

import { User } from "@/app/(app)/context/user_context";
import ProfilePicture from "@/app/components/ProfilePicture";

export interface IRoomItem {
  _id: string;
  title: string;
  description: string;
  addedBy: User;
  willBeBoughtBy: User | null;
}

const RoomItem = (props: IRoomItem) => {
  return (
    <div className="relative flex flex-col border-b-2 border-black p-4">
      <p className="text-xl">{props.title}</p>
      <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
        {props.description}
      </p>
      <div className="ml-auto flex flex-row items-center justify-center gap-4">
        <ProfilePicture address={props.addedBy.profilePictureId} />
        <p>{props.addedBy.fullname}</p>
      </div>
    </div>
  );
};

export default RoomItem;
