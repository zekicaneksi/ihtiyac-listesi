"use client";

import { fetchBackendGET } from "@/app/utils/fetch";
import { useRouter } from "next/navigation";
import Footer, { MenuElementProps } from "@/app/(app)/components/layout/footer";
import { useUserContext } from "@/app/context/user_context";
import Button from "@/app/components/Button";
import { useEffect, useState } from "react";

const Profile = () => {
  const { user } = useUserContext();
  const router = useRouter();

  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  const [disabled, setDisabled] = useState<boolean>(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(undefined);
      return;
    }
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) return;
    setDisabled(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const response = await fetch("/api/upload-picture", {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      console.log("okkk");
    } else if (response.status === 413) {
      console.log("file size too big");
    } else {
      console.log("something went wrong");
    }

    setDisabled(false);
  }

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

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
        <div
          className={`flex w-fit flex-col gap-8 ${disabled ? "pointer-events-none opacity-70" : ""}`}
        >
          <div className="flex flex-row justify-center gap-8">
            <div className="size-16 bg-red-300"></div>
            <p className="self-center">{user.fullname}</p>
          </div>
          {preview && (
            <img
              className="h-72 w-72 self-center rounded-full bg-yellow-200"
              src={preview}
            />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
          />
          <Button
            onClick={handleUpload}
            className={`${file ? "" : "pointer-events-none opacity-70"}`}
          >
            Upload Picture
          </Button>
        </div>
      </div>
      <Footer menuElements={menuElements} />
    </>
  );
};

export default Profile;
