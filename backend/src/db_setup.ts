import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017/ihtiyac_listesi";

const client = new MongoClient(uri);

const dbCon = client.db("ihtiyac_listesi");

process.on("SIGINT", async function () {
  await client.close();
  process.exit(0);
});

// --- Types
// Should be consistent with the validators in the setupDatabase function.

export interface User {
  _id?: ObjectId; // Is set when retrieved from the database
  username: string;
  password: string;
  fullname: string;
  memberOfRooms: ObjectId[];
  profilePictureId: null | ObjectId;
}

export interface Session {
  _id?: ObjectId; // Is set when retrieved from the database
  user_id: ObjectId;
  creation_date: Date;
}

export async function setupDatabase() {
  await dbCon.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "User Object Validation",
        required: [
          "username",
          "fullname",
          "password",
          "memberOfRooms",
          "profilePictureId",
        ],
        properties: {
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

  await dbCon.createCollection("sessions", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "Session Object Validation",
        required: ["user_id", "creation_date"],
        properties: {
          user_id: {
            bsonType: "objectId",
          },
          creation_date: {
            bsonType: "date",
          },
        },
      },
    },
  });
}

export default dbCon;
