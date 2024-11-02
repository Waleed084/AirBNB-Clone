import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export default async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);


  cachedClient = client;
  cachedDb = client.db(process.env.DB_NAME); // Make sure DB_NAME is correctly set in your .env file

  return cachedDb;
}
