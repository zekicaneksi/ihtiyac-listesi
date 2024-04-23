"use client";

import { useUserContext } from "@/app/context/user_context";
import { fetchBackendGET } from "@/app/utils/fetch";
import { useRouter } from "next/navigation";
import Footer, { MenuElementProps } from "@/app/(app)/components/layout/footer";

export default function Home() {
  const { user } = useUserContext();

  const router = useRouter();

  async function logout() {
    await fetchBackendGET("/logout");
    router.push("/sign");
  }

  const menuElements: MenuElementProps[] = [
    {
      text: "hello",
      onClick() {
        console.log("clicked hello");
      },
    },
    {
      text: "hello 2",
      onClick() {
        console.log("clicked hello 2");
      },
    },
    {
      text: "hello 3",
      onClick() {
        console.log("clicked hello 3");
      },
    },
  ];

  return (
    <>
      <div className="container mx-auto flex flex-grow flex-col items-center bg-sky-400">
        <button className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">
          {"hello" + user.fullname}
        </button>
        <button
          className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
          onClick={logout}
        >
          logout
        </button>
      </div>
      <Footer menuElements={menuElements} />
    </>
  );
}
