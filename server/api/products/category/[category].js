import { connectToDatabase } from "../../db";

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    // Получаем категорию из параметров маршрута
    const { category } = event.context.params;
    console.log("Category received:", category);

    // Ищем продукты по категории
    const productsCursor = await productsCollection.find(
      { category: category },
      {
        projection: {
          image_url: 1,
          alternative_images: { $ifNull: ["$alternative_images", []] },
          alias: 1,
          category: 1,
          colors: 1,
          tags: 1,
          name: 1,
          sku: 1,
          description: 1,
          short_description: 1,
          price: 1,
          flags: 1,
          created_at: 1,
          updated_at: 1,
        },
      }
    );

    // Преобразуем курсор в массив
    const products = await productsCursor.toArray();
    console.log("Products found:", products);

    // Если продукты не найдены
    if (products.length === 0) {
      throw createError({
        statusCode: 404, // Возвращаем 404, если категория не найдена
        message: "Категория не найдена или в ней нет товаров",
      });
    }

    // Возвращаем список продуктов
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error); // Логируем ошибку на сервере
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Внутренняя ошибка сервера",
    });
  }
});
