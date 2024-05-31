import { User } from "@/app/(app)/context/user_context";
import ProfilePicture from "@/app/components/ProfilePicture";
import { useLanguageContext } from "@/app/context/LanguageContext";
import { useState } from "react";

export interface IHistoryRoomItem {
  _id: string;
  title: string;
  description: string;
  addedBy: User;
  boughtBy: User;
  purchaseDate: Date;
}

const HistoryRoomItem = (props: IHistoryRoomItem) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { langMap } = useLanguageContext();

  function handleDivOnClick() {
    setIsExpanded((prevState) => !prevState);
  }

  return (
    <div
      className={`relative flex flex-col border-b-2 border-black bg-element p-4 hover:cursor-pointer hover:brightness-105`}
      onClick={handleDivOnClick}
    >
      <p className="text-xl">{props.title}</p>
      <p
        className={`${isExpanded ? "w-5/6" : "line-clamp-3 w-1/3"} whitespace-pre-wrap`}
      >
        {props.description}
      </p>

      <div className="mt-5">
        <div className="flex flex-row items-center gap-2">
          <p>{langMap.values.room.added_by + ": "}</p>
          <ProfilePicture address={props.addedBy.profilePictureId} />
          <p>{props.addedBy.fullname}</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p>{langMap.values.room.bought_by + ": "}</p>
          <ProfilePicture address={props.boughtBy.profilePictureId} />
          <p>{props.boughtBy.fullname}</p>
        </div>
        <div className="mt-4">
          <p>
            {langMap.values.room.purchase_date +
              ": " +
              props.purchaseDate.toLocaleString()}
          </p>
        </div>
        <div className="mt-4 flex flex-row justify-center gap-4 sm:justify-normal"></div>
      </div>
    </div>
  );
};

export default HistoryRoomItem;
