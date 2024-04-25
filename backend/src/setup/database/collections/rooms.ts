import { ObjectId } from "mongodb";
import dbCon from "../db_setup";

export interface RoomItem {
  _id?: ObjectId; // Is set when retrieved from the database
  title: string;
  description: string;
  addedBy: ObjectId;
  willBeBoughtBy: ObjectId | null;
}

export interface RoomHistoryItem {
  _id?: ObjectId; // Is set when retrieved from the database
  title: string;
  description: string;
  addedBy: ObjectId;
  boughtBy: ObjectId;
  purchaseDate: Date;
}

export interface Room {
  _id?: ObjectId; // Is set when retrieved from the database
  name: string;
  password: string;
  members: ObjectId[];
  creatorId: ObjectId;
  items: RoomItem[];
  history: RoomHistoryItem[];
}

export async function createCollection() {
  await dbCon.createCollection("rooms", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "Room Object Validation",
        required: [
          "name",
          "password",
          "members",
          "creatorId",
          "items",
          "history",
        ],
        properties: {
          name: {
            bsonType: "string",
          },
          password: {
            bsonType: "string",
          },
          members: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
            },
          },
          creatorId: {
            bsonType: "objectId",
          },
          items: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["title", "description", "addedBy", "willBeBoughtBy"],
              properties: {
                title: {
                  bsonType: "string",
                },
                description: {
                  bsonType: "string",
                },
                addedBy: {
                  bsonType: "objectId",
                },
                willBeBoughtBy: {
                  bsonType: ["objectId", "null"],
                },
              },
            },
          },
          history: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: [
                "title",
                "description",
                "addedBy",
                "boughtBy",
                "purchaseDate",
              ],
              properties: {
                title: {
                  bsonType: "string",
                },
                description: {
                  bsonType: "string",
                },
                addedBy: {
                  bsonType: "objectId",
                },
                boughtBy: {
                  bsonType: "objectId",
                },
                purchaseDate: {
                  bsonType: "date",
                },
              },
            },
          },
        },
      },
    },
  });
}
