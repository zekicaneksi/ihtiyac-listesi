import { ObjectId } from "mongodb";
import dbCon from "../db_setup";
import cookie_options from "../../cookie_options";

export interface Session {
  _id?: ObjectId; // Is set when retrieved from the database
  user_id: ObjectId;
  last_touch_date: Date;
}

export async function createCollection() {
  await dbCon.createCollection("sessions", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "Session Object Validation",
        required: ["_id", "user_id", "last_touch_date"],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
          },
          user_id: {
            bsonType: "objectId",
          },
          last_touch_date: {
            bsonType: "date",
          },
        },
      },
    },
  });
}

// Delete old sessions from the database
export async function garbageCollectSessions() {
  let expirationDate = new Date();
  expirationDate.setSeconds(
    expirationDate.getSeconds() - cookie_options.maxAge,
  );
  await dbCon
    .collection<Session>("sessions")
    .deleteMany({ last_touch_date: { $lte: expirationDate } });
}
