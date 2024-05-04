import { Request, Response } from "express";
import busboy from "busboy";
import fs from "fs";
import { appRootPath } from "@/index";
import { v4 as uuidv4 } from "uuid";
import dbCon from "@/setup/database/db_setup";
import { User } from "@/setup/database/collections/users";

export default async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  let generatedFileName: string;

  const bb = busboy({
    headers: req.headers,
    limits: { fileSize: 1 * 1024 * 1024 },
  });

  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    if (filename.length > 0) {
      if (mimeType !== "image/jpeg" && mimeType !== "image/png") file.resume();
      else {
        const imagePath = "/../public/uploaded_images/";
        generatedFileName = uuidv4();
        const saveAddress = appRootPath + imagePath + generatedFileName;

        file.on("limit", () => {
          // Delete the file that is large in size
          fs.unlink(saveAddress, (err) => {
            if (err) console.log(err);
          });
        });

        // Store the uploaded image
        file.pipe(fs.createWriteStream(saveAddress));

        // Set the new picture and delete the old one
        dbCon
          .collection<User>("users")
          .findOneAndUpdate(
            { _id: user._id },
            { $set: { profilePictureId: generatedFileName } },
          )
          .then((oldDoc) => {
            if (oldDoc?.profilePictureId !== null)
              fs.unlink(
                appRootPath + imagePath + oldDoc?.profilePictureId,
                (err) => {
                  if (err) console.log(err);
                },
              );
          });
      }
    } else {
      file.resume();
    }
  });
  bb.on("close", () => {
    res.writeHead(200, { Connection: "close" });
    res.end(generatedFileName);
  });

  req.pipe(bb);
};
