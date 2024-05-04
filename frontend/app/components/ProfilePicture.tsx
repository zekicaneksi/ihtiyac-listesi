"use client";

import { backendUrlPrefix } from "@/app/utils/fetch";
import { useEffect, useState } from "react";

interface ProfilePictureProps {
  onClick?: () => void;
  fillHeight?: boolean;
  address: string | null;
  cursor?: "pointer" | "none";
}

const ProfilePicture = (props: ProfilePictureProps) => {
  const defaultImgAdr = "/static/default_pic.png";
  const imageSrcAdr = props.address
    ? backendUrlPrefix + "/public/uploaded_images/" + props.address
    : defaultImgAdr;

  const [imageSrc, setImageSrc] = useState<string>(imageSrcAdr);

  useEffect(() => {
    setImageSrc(imageSrcAdr);
  }, [props.address]);

  return (
    <div
      className={`aspect-square ${props.fillHeight ? "h-[100%]" : "h-12"} w-auto hover:cursor-${props.cursor}`}
      onClick={props.onClick}
    >
      <img
        src={imageSrc}
        onError={() => {
          setImageSrc(defaultImgAdr);
        }}
        className="size-full rounded-full"
      />
    </div>
  );
};

export default ProfilePicture;
