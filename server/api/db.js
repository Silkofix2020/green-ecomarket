import { MongoClient } from "mongodb";
import { useRuntimeConfig } from "#imports";

let db;

export async function connectToDatabase() {
  const config = useRuntimeConfig();

  const uri = `mongodb://${config.MONGODB_USERNAME}:${encodeURIComponent(
    config.MONGODB_PASSWORD
  )}@${config.MONGODB_HOST}:${config.MONGODB_PORT}/${
    config.MONGODB_DBNAME
  }?authSource=admin&directConnection=true`;

  if (!db) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      db = client.db(config.MONGODB_DBNAME);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }
  return db;
}
