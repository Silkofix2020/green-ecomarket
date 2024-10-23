// server/api/deleteproduct.js
import { connectToDatabase } from "../db";
import { ObjectId } from "mongodb";
import "dotenv/config";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  const db = await connectToDatabase();
  const productsCollection = db.collection("products");

  try {
    await productsCollection.deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
