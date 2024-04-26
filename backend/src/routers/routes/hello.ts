import { User } from "@/setup/database/collections/users";
import { Request, Response } from "express";

// Used for checking if the client has a session
// Also, for providing the user with their basic information
export default async (req: Request, res: Response) => {
  const user: User = res.locals.user;

  res.statusCode = 200;
  res.send(
    JSON.stringify({
      username: user.username,
      fullname: user.fullname,
      id: user._id,
      profilePictureId: user.profilePictureId,
    }),
  );
};
