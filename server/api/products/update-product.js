// server/api/update-product.js
import { connectToDatabase } from "../db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { _id, colors, ...updateData } = body;

  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    // Если массив цветов передан в запросе, обновляем его отдельно
    if (colors) {
      updateData.colors = colors;
    }

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    console.log(
      `Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents`
    );

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    });
  }
});
