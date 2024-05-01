import { MongoClient } from "mongodb";
import { createCollection as createUsersCollection } from "./collections/users";
import {
  createCollection as createSessionsCollection,
  garbageCollectSessions,
} from "./collections/sessions";
import { createCollection as createRoomsCollection } from "./collections/rooms";

const uri = process.env.MONGODB_URL as string;

const client = new MongoClient(uri);

const dbCon = client.db("ihtiyac_listesi");

// Close the database connection on exit
process.on("SIGINT", async function () {
  await client.close();
  process.exit(0);
});

export async function setupDatabase() {
  await createUsersCollection();
  await createSessionsCollection();
  await createRoomsCollection();
  setInterval(garbageCollectSessions, 600000);
}

export default dbCon;
