import { connectToDatabase } from "../db";

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    // Фильтруем продукты, у которых флаг main_product установлен в true
    const products = await productsCollection
      .aggregate([
        {
          $match: {
            "flags.main_product": true, // Условие на флаг main_product
          },
        },
        {
          $project: {
            image_url: 1,
            alternative_images: { $ifNull: ["$alternative_images", []] }, // Установим значение по умолчанию
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
        },
      ])
      .toArray();

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    });
  }
});
