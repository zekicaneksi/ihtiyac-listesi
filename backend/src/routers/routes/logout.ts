import { Request, Response } from "express";
import { Session } from "../../setup/database/collections/sessions";
import dbCon from "../../setup/database/db_setup";

export default async (req: Request, res: Response) => {
  res.clearCookie("sessionid");
  const session: Session = res.locals.session;
  await dbCon
    .collection<Session>("sessions")
    .findOneAndDelete({ _id: session._id });
  res.statusCode = 200;
  res.send("logged out");
};
