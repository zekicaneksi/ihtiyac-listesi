import { NextFunction, Request, Response } from "express";
import cookie from "cookie";
import dbCon from "@/setup/database/db_setup";
import { Session } from "@/setup/database/collections/sessions";
import { User } from "@/setup/database/collections/users";
import { ObjectId } from "mongodb";
import setCookie from "./setCookie";

// Middleware that checks the session
// sets res.locals.session with session data
// sets res.locals.user with user data
// returns 401 if session does not exist
async function checkSession(req: Request, res: Response, next: NextFunction) {
  let cookies = cookie.parse(req.headers.cookie || "");

  let sessionId: string = cookies.sessionid;

  function responseUnauthorized() {
    res.statusCode = 401;
    res.send("redirect");
  }

  if (sessionId && ObjectId.isValid(sessionId)) {
    const last_touch_date: Date = new Date();
    let session = await dbCon
      .collection<Session>("sessions")
      .findOneAndUpdate(
        { _id: new ObjectId(sessionId) },
        { $set: { last_touch_date: last_touch_date } },
      );
    if (session) {
      await setCookie(res, null, session._id.toString());
      session.last_touch_date = last_touch_date;
      res.locals.session = session;
      let user = await dbCon
        .collection<User>("users")
        .findOne({ _id: session.user_id });
      res.locals.user = user;
      next();
    } else {
      res.clearCookie("sessionid");
      responseUnauthorized();
    }
  } else {
    responseUnauthorized();
  }
}

export default checkSession;
