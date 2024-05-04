"use client";

import {
  fetchBackendGET,
  fetchBackendPOST,
  fetchBackendPOSTAny,
} from "@/app/utils/fetch";
import { useRouter } from "next/navigation";
import Footer, { MenuElementProps } from "@/app/(app)/components/layout/footer";
import { User, useUserContext } from "@/app/context/user_context";
import Button from "@/app/components/Button";
import { useEffect, useState } from "react";
import ProfilePicture from "@/app/components/ProfilePicture";

const Profile = () => {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [infoMessage, setInfoMessage] = useState<string>("");

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
    setInfoMessage("uploading...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const response = await fetchBackendPOSTAny("/upload-picture", formData);

    const newImageId = await response.text();

    if (response.status === 200) {
      setInfoMessage("successful");
      setUser((oldState) => {
        let clone: User = JSON.parse(JSON.stringify(oldState));
        clone.profilePictureId = newImageId;
        return clone;
      });
    } else if (response.status === 413) {
      setInfoMessage("file size is too big");
    } else {
      setInfoMessage("something went wrong");
    }

    setDisabled(false);
  }

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    setInfoMessage("");

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
            <ProfilePicture address={user.profilePictureId} />
            <p className="self-center">{user.fullname}</p>
          </div>
          {preview && (
            <img
              className="h-72 w-72 self-center rounded-full bg-yellow-200"
              src={preview}
            />
          )}
          <label className="cursor-pointer border-2 border-black p-2 text-center">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/jpeg, image/png"
              className="hidden"
            />
            Choose File
          </label>
          {infoMessage && <p className="self-center">{infoMessage}</p>}
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
