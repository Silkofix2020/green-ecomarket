import { connectToDatabase } from "../db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
    // Получаем ID продукта из query параметров
    const { id } = getQuery(event);

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Product ID is missing"
        });
    }

    // Подключаемся к базе данных
    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    // Находим продукт по ID
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: "Product not found"
        });
    }

    // Возвращаем найденный продукт
    return product;
});
