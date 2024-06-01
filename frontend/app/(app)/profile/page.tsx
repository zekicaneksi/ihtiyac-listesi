"use client";

import { fetchBackendGET, fetchBackendPOSTAny } from "@/app/utils/fetch";
import { useRouter } from "next/navigation";
import Footer, { MenuElementProps } from "@/app/components/Footer";
import { User, useUserContext } from "@/app/(app)/context/user_context";
import Button from "@/app/components/Button";
import { useEffect, useState } from "react";
import ProfilePicture from "@/app/components/ProfilePicture";
import { useLanguageContext } from "@/app/context/LanguageContext";

const Profile = () => {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [infoMessage, setInfoMessage] = useState<string>("");

  const [disabled, setDisabled] = useState<boolean>(false);

  const { langMap } = useLanguageContext();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(undefined);
      return;
    }
    setFile(e.target.files[0]);
  }

  async function resizeImage(
    image: ImageBitmap,
    outputWidth: number,
    outputHeight: number,
  ) {
    let canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    let ctx = canvas.getContext("2d");

    ctx?.drawImage(image, 0, 0);

    const { promise, resolve, reject } = Promise.withResolvers<Blob>();

    canvas.toBlob((blob) => {
      if (blob == null)
        return reject(new TypeError("Canvas could not create the image"));
      resolve(blob);
    });

    const blob = await promise;

    return blob;
  }

  async function handleUpload() {
    if (!file) return;

    setDisabled(true);
    setInfoMessage(langMap.values.profile.uploading);

    // Resizing image for upload
    const targetWidth = 250;
    const targetHeight = 250;

    const blob = await resizeImage(
      await createImageBitmap(file, {
        resizeWidth: targetWidth,
        resizeHeight: targetHeight,
        resizeQuality: "high",
      }),
      targetWidth,
      targetHeight,
    );

    // Preparing and sending the data
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("fileName", file.name);

    const response = await fetchBackendPOSTAny("/upload-picture", formData);

    const newImageId = await response.text();

    if (response.status === 200) {
      setInfoMessage(langMap.values.profile.successful);
      setUser((oldState) => {
        let clone: User = JSON.parse(JSON.stringify(oldState));
        clone.profilePictureId = newImageId;
        return clone;
      });
    } else if (response.status === 413) {
      setInfoMessage(langMap.values.profile.file_size_big);
    } else {
      setInfoMessage(langMap.values.profile.something_went_wrong);
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

  useEffect(() => {
    setPreview(
      user.profilePictureId
        ? "/api/public/uploaded_images/" + user.profilePictureId
        : "/static/default_pic.png",
    );
  }, []);

  async function logout() {
    await fetchBackendGET("/logout");
    router.push("/sign");
  }

  const menuElements: MenuElementProps[] = [
    {
      text: langMap.values.profile.logout,
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
          {preview && (
            <img
              className="h-72 w-72 self-center rounded-full bg-yellow-200"
              src={preview}
            />
          )}
          <label className="text-highligt cursor-pointer rounded border-2 border-foreground bg-element p-4 text-center">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/jpeg, image/png"
              className="hidden"
            />
            {langMap.values.profile.choose_file}
          </label>
          {infoMessage && (
            <p className="text-highligt self-center">{infoMessage}</p>
          )}
          <Button onClick={handleUpload} disabled={file ? false : true}>
            {langMap.values.profile.upload}
          </Button>
        </div>
      </div>
      <Footer menuElements={menuElements} />
    </>
  );
};

export default Profile;
