import { MongoClient } from "mongodb";
import { createCollection as createUsersCollection } from "./collections/users";
import {
  createCollection as createSessionsCollection,
  garbageCollectSessions,
} from "./collections/sessions";

const uri = process.env.MONGODB_URL;

const client = new MongoClient(uri as string);

const dbCon = client.db("ihtiyac_listesi");

// Close the database connection on exit
process.on("SIGINT", async function () {
  await client.close();
  process.exit(0);
});

export async function setupDatabase() {
  await createUsersCollection();
  await createSessionsCollection();
  setInterval(garbageCollectSessions, 600000);
}

export default dbCon;
