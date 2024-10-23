import { MongoClient } from "mongodb";

const uri =
  "mongodb://gen_user:xE%7CJoPIO_Ziiv3@147.45.249.225:27017/default_db?authSource=admin&directConnection=true";

async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    await client.close();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

run();
