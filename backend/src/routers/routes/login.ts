import { Request, Response } from "express";
import { User } from "@/setup/database/collections/users";
import dbCon from "@/setup/database/db_setup";
import bcrypt from "bcrypt";
import setCookie from "@/middleware/setCookie";

interface LoginBody {
  username: string;
  password: string;
}

export default async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const user: User | null = await dbCon
    .collection<User>("users")
    .findOne({ username: req.body.username });

  function setResponseForFailure() {
    res.statusCode = 401;
    res.send("invalid credentials");
  }

  async function setResponseForSuccess() {
    if (user?._id) await setCookie(res, user._id);
    res.statusCode = 200;
    res.send("login successful");
  }

  if (user) {
    // Username is found, check the password
    if (bcrypt.compareSync(req.body.password, user.password)) {
      // Password is correct
      // Login the user
      await setResponseForSuccess();
    } else {
      // Password is incorrect
      setResponseForFailure();
    }
  } else {
    // Username is not found
    setResponseForFailure();
  }
};
