import { ObjectId } from "mongodb";
import dbCon from "../db_setup";

export interface User {
  _id?: ObjectId; // Is set when retrieved from the database
  username: string;
  password: string;
  fullname: string;
  memberOfRooms: ObjectId[];
  profilePictureId: null | ObjectId;
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
          },
          fullname: {
            bsonType: "string",
          },
          password: {
            bsonType: "string",
          },
          memberOfRooms: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
            },
          },
          profilePictureId: {
            bsonType: ["objectId", "null"],
          },
        },
      },
    },
  });
}
