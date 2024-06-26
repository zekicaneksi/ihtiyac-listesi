"use cilent";

import ProfilePicture from "@/app/components/ProfilePicture";
import { useUserContext } from "@/app/(app)/context/user_context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageContext } from "@/app/context/LanguageContext";

const LogoWithName = () => {
  const { langMap } = useLanguageContext();

  return (
    <div>
      <Link href="/" className="contents">
        <img
          src={"/logo-with-name.png"}
          alt={langMap.values.root_page.logo_alt}
          height={"100%"}
          width={"auto"}
          className="h-[100%] w-auto hover:cursor-pointer"
        />
      </Link>
    </div>
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
    <div
      className={`mr-4 aspect-square h-[100%] w-auto hover:cursor-pointer`}
      onClick={() => {
        if (langMap.code === "tr") setLanguage("en");
        else setLanguage("tr");
      }}
    >
      <img
        src={"/language/" + langMap.code + ".png"}
        className="size-full rounded-full"
      />
    </div>
  );
};

export const Header = () => {
  return (
    <div className="flex h-[7vh] justify-between bg-foreground p-2 md:h-[6vh]">
      <LogoWithName />
      <LanguageIconBtn />
      <ProfilePicturePlaceHolder />
    </div>
  );
};
