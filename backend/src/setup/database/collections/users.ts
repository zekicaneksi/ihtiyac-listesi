import { ObjectId } from "mongodb";
import dbCon from "../db_setup";
import regexp from "@/utils/regex";

export interface User {
  _id: ObjectId;
  username: string;
  password: string;
  fullname: string;
  memberOfRooms: ObjectId[];
  profilePictureId: string | null;
}

export async function createCollection() {
  await dbCon.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "User Object Validation",
        additionalProperties: false,
        required: [
          "_id",
          "username",
          "fullname",
          "password",
          "memberOfRooms",
          "profilePictureId",
        ],
        properties: {
          _id: {
            bsonType: "objectId",
          },
          username: {
            bsonType: "string",
            minLength: 6,
            maxLength: 15,
          },
          fullname: {
            bsonType: "string",
            minLength: 4,
            maxLength: 25,
          },
          password: {
            bsonType: "string",
            maxLength: 300,
          },
          memberOfRooms: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
            },
          },
          profilePictureId: {
            bsonType: ["string", "null"],
          },
        },
      },
      $and: [
        {
          username: {
            $not: {
              $regex: regexp.containsSpecialCharacter,
            },
          },
        },
        {
          fullname: {
            $not: {
              $regex: regexp.containsSpecialCharacterExceptSpaceOrNumber,
            },
          },
        },
      ],
    },
  });

  await dbCon
    .collection<User>("users")
    .createIndex({ username: "text" }, { unique: true });
}
