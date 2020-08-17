import { MongoClient } from "mongodb";
import { DataBase } from "../lib/types";

const { DB_USER, DB_USER_PASSWORD, DB_CLUSTER, DB_DATABASE } = process.env;

const DBURL = `mongodb+srv://${DB_USER}:${DB_USER_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority`;

export const connectDB = async (): Promise<DataBase> => {
  const client = await MongoClient.connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("main");

  return {
    listings: db.collection("test_listings"),
  };
};
