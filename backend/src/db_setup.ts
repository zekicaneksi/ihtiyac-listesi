import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017/ihtiyac_listesi";

const client = new MongoClient(uri);

const dbCon = client.db("ihtiyac_listesi");

process.on("SIGINT", async function () {
  await client.close();
  process.exit(0);
});

export interface User {
  username: string;
  password: string;
  fullname: string;
  memberOfRooms: ObjectId[];
  profilePictureId: null | ObjectId;
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
}

export default dbCon;
