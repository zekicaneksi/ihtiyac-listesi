"use cilent";

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

// Replace with the actual profile image later on
const ProfilePicturePlaceHolder = () => {
  const router = useRouter();
  return (
    <div
      className="aspect-square h-[100%] w-auto rounded-full bg-teal-500 hover:cursor-pointer"
      onClick={() => {
        router.push("/profile");
      }}
    ></div>
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
