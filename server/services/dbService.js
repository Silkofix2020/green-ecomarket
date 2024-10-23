import { connectToDatabase } from "../api/db";

// Функция для сохранения продукта в базу данных
export const saveProductToDB = async (productData) => {
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    // Сохраняем продукт в коллекцию
    const productResult = await productsCollection.insertOne(productData);
    console.log(
      "Продукт успешно сохранен в БД с ID:",
      productResult.insertedId
    );
    return productResult.insertedId;
  } catch (error) {
    console.error("Ошибка при сохранении продукта в базу данных:", error);
    throw new Error(
      `Не удалось сохранить продукт в базу данных: ${error.message}`
    );
  }
};
