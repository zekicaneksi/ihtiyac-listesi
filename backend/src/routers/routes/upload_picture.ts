import { Request, Response } from "express";
import busboy from "busboy";
import fs from "fs";
import { appRootPath } from "@/index";
import { v4 as uuidv4 } from "uuid";

export default async (req: Request, res: Response) => {
  const bb = busboy({
    headers: req.headers,
    limits: { fileSize: 1 * 1024 * 1024 },
  });

  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    if (filename.length > 0) {
      if (mimeType !== "image/jpeg" && mimeType !== "image/png") file.resume();
      else {
        const generatedFileName = uuidv4();
        const saveAddress =
          appRootPath + "/../public/uploaded_images/" + generatedFileName;

        file.on("limit", () => {
          // Delete the file that is large in size
          fs.unlink(saveAddress, (err) => {
            if (err) console.log(err);
          });
        });

        // Store the uploaded image
        file.pipe(fs.createWriteStream(saveAddress));
      }
    } else {
      file.resume();
    }
  });
  bb.on("close", () => {
    res.writeHead(200, { Connection: "close" });
    res.end();
  });

  req.pipe(bb);
};
