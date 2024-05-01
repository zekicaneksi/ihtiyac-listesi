import { Response } from "express";
import { ObjectId } from "mongodb";
import dbCon from "@/setup/database/db_setup";
import { Session } from "@/setup/database/collections/sessions";
import cookie from "cookie";
import cookie_options from "@/setup/cookie_options";

// When provided an user_id, it will create a new session and set the "sessionid" cookie.
// When user_id is null and given a session_id, it will instead set(refresh) the "sessionid" cookie with the given session_id.
async function setCookie(
  res: Response,
  user_id: ObjectId | null,
  session_id?: string,
) {
  let sessionidToSet = "";
  if (session_id) {
    sessionidToSet = session_id;
  } else {
    if (!user_id) return;
    const insertResult = await dbCon
      .collection<Omit<Session, "_id">>("sessions")
      .insertOne({
        user_id: user_id,
        last_touch_date: new Date(),
      });
    sessionidToSet = insertResult.insertedId.toString();
  }

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("sessionid", sessionidToSet, cookie_options),
  );
}

export default setCookie;
