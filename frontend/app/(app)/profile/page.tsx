"use client";

import { fetchBackendGET } from "@/app/utils/fetch";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();

  async function logout() {
    await fetchBackendGET("/logout");
    router.push("/sign");
  }

  return (
    <button
      className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
      onClick={logout}
    >
      logout
    </button>
  );
};

export default Profile;
