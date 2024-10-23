// api/products/[alias].js
import { connectToDatabase } from "../../api/db";

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    // Получаем alias из параметров маршрута
    const { alias } = event.context.params;

    // Ищем продукт по alias
    const product = await productsCollection.findOne(
      { alias: alias },
      {
        projection: {
          image_url: 1,
          alternative_images: { $ifNull: ["$alternative_images", []] },
          alias: 1,
          colors: 1,
          tags: 1,
          name: 1,
          sku: 1,
          description: 1,
          short_description: 1,
          price: 1,
          category: 1,
          flags: 1,
          created_at: 1,
          updated_at: 1,
        },
      }
    );

    // Если продукт не найден
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: "Продукт не найден",
      });
    }

    // Возвращаем продукт
    return product;
  } catch (error) {
    console.error("Error fetching product by alias:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    });
  }
});
