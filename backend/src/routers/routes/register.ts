import { Request, Response } from "express";
import regexp from "@/utils/regex";
import dbCon from "@/setup/database/db_setup";
import { User } from "@/setup/database/collections/users";
import bcrypt from "bcrypt";
import setCookie from "@/middleware/setCookie";

interface RegisterBody {
  username: string;
  fullname: string;
  password: string;
}

export default async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const bodyUser: RegisterBody = req.body;

  // Validating fields
  res.statusCode = 409;
  if (RegExp(regexp.containsSpecialCharacter).test(bodyUser.username)) {
    return res.send("Username cannot contain special characters");
  } else if (bodyUser.username.length < 6 || bodyUser.username.length > 15) {
    return res.send("Username must be 6-15 characters long");
  } else if (
    RegExp(regexp.containsSpecialCharacterExceptSpaceOrNumber).test(
      bodyUser.fullname,
    )
  ) {
    return res.send("Full name must consist of characters and spaces only");
  } else if (bodyUser.fullname.length < 4 || bodyUser.fullname.length > 25) {
    return res.send("Fullname must be 4-25 characters long");
  } else if (RegExp(regexp.containsWhiteSpace).test(bodyUser.password)) {
    return res.send("Password cannot contain whitespaces");
  } else if (bodyUser.password.length < 8 || bodyUser.password.length > 20) {
    return res.send("Password must be 8-20 characters long");
  }

  // Validation successful
  // Checking if username exists
  const checkUsernameResult = await dbCon
    .collection<User>("users")
    .findOne({ username: bodyUser.username });
  if (checkUsernameResult) {
    return res.status(406).send("Username exists");
  }

  // Username doesn't exist, creating user

  // Hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(bodyUser.password, salt);

  const insertResult = await dbCon
    .collection<Omit<User, "_id">>("users")
    .insertOne({
      username: bodyUser.username,
      password: hashedPassword,
      fullname: bodyUser.fullname,
      memberOfRooms: [],
      profilePictureId: null,
    });
  if (insertResult.insertedId) {
    res.statusCode = 201;
    await setCookie(res, insertResult.insertedId);
    res.send("creation successful");
  } else {
    res.statusCode = 500;
    res.send("something went wrong");
  }
};
