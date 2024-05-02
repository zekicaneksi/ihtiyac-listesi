"use client";

import { fetchBackendGET } from "@/app/utils/fetch";
import { useRouter } from "next/navigation";
import Footer, { MenuElementProps } from "@/app/(app)/components/layout/footer";
import { useUserContext } from "@/app/context/user_context";
import Button from "@/app/components/Button";

const Profile = () => {
  const { user } = useUserContext();
  const router = useRouter();

  async function logout() {
    await fetchBackendGET("/logout");
    router.push("/sign");
  }

  const menuElements: MenuElementProps[] = [
    {
      text: "Logout",
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <>
      <div className="flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <div className="flex w-fit flex-col gap-8">
          <div className="flex flex-row justify-center gap-8">
            <div className="size-16 bg-red-300"></div>
            <p className="self-center">{user.fullname}</p>
          </div>
          <Button>Upload Picture</Button>
        </div>
      </div>
      <Footer menuElements={menuElements} />
    </>
  );
};

export default Profile;
