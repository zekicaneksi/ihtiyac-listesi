"use cilent";

import ProfilePicture from "@/app/components/ProfilePicture";
import { useUserContext } from "@/app/(app)/context/user_context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageContext } from "@/app/context/LanguageContext";

const LogoWithName = () => {
  return (
    <Link href="/">
      <img
        src={"/logo-with-name.png"}
        alt={"clickable logo that takes to home"}
        height={"100%"}
        width={"auto"}
        className="h-[100%] w-auto hover:cursor-pointer"
      />
    </Link>
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

const LanguageIconBtn = () => {
  const { langMap, setLanguage } = useLanguageContext();

  return (
    <div className={`mr-4 aspect-square h-[100%] w-auto hover:cursor-pointer`}>
      <img
        src={"/language/" + langMap.code + ".png"}
        className="size-full rounded-full"
        onClick={() => {
          if (langMap.code === "tr") setLanguage("en");
          else setLanguage("tr");
        }}
      />
    </div>
  );
};

export const Header = () => {
  return (
    <div className="flex h-[10vh] justify-between bg-foreground p-2 md:h-[6vh]">
      <LogoWithName />
      <LanguageIconBtn />
      <ProfilePicturePlaceHolder />
    </div>
  );
};
