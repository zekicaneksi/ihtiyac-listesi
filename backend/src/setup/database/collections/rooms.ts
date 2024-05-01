import { ObjectId } from "mongodb";
import dbCon from "../db_setup";

export interface RoomItem {
  _id: ObjectId;
  title: string;
  description: string;
  addedBy: ObjectId;
  willBeBoughtBy: ObjectId | null;
}

export interface RoomHistoryItem {
  _id: ObjectId;
  title: string;
  description: string;
  addedBy: ObjectId;
  boughtBy: ObjectId;
  purchaseDate: Date;
}

export interface Room {
  _id: ObjectId;
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
        additionalProperties: false,
        required: [
          "_id",
          "name",
          "password",
          "members",
          "creatorId",
          "items",
          "history",
        ],
        properties: {
          _id: {
            bsonType: "objectId",
          },
          name: {
            bsonType: "string",
            maxLength: 40,
            minLength: 2,
          },
          password: {
            bsonType: "string",
            maxLength: 300,
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
              required: [
                "_id",
                "title",
                "description",
                "addedBy",
                "willBeBoughtBy",
              ],
              additionalProperties: false,
              properties: {
                _id: {
                  bsonType: "objectId",
                },
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
                "_id",
                "title",
                "description",
                "addedBy",
                "boughtBy",
                "purchaseDate",
              ],
              additionalProperties: false,
              properties: {
                _id: {
                  bsonType: "objectId",
                },
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
