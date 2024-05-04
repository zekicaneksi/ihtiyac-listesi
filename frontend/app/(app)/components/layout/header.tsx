"use cilent";

import ProfilePicture from "@/app/components/ProfilePicture";
import { useUserContext } from "@/app/context/user_context";
import { useRouter } from "next/navigation";

const LogoWithName = () => {
  const router = useRouter();

  return (
    <img
      src={"/logo-with-name.png"}
      alt={"clickable logo that takes to home"}
      height={"100%"}
      width={"auto"}
      className="h-[100%] w-auto hover:cursor-pointer"
      onClick={() => {
        router.push("/");
      }}
    />
  );
};

const ProfilePicturePlaceHolder = () => {
  const { user } = useUserContext();
  const router = useRouter();
  return (
    <ProfilePicture
      onClick={() => {
        router.push("/profile");
      }}
      fillHeight={true}
      address={user.profilePictureId}
      cursor="pointer"
    />
  );
};

export const Header = () => {
  return (
    <div className="flex h-[10vh] justify-between bg-foreground p-2 md:h-[6vh]">
      <LogoWithName />
      <ProfilePicturePlaceHolder />
    </div>
  );
};
