import { connectToDatabase } from "../db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
    try {
        // Используем readBody для получения тела запроса
        const body = await readBody(event);
        const { productId, flags } = body;

        if (!productId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Product ID is missing"
            });
        }

        const db = await connectToDatabase();
        const productsCollection = db.collection("products");

        // Найдем продукт в базе данных
        const existingProduct = await productsCollection.findOne({
            _id: new ObjectId(productId)
        });

        if (!existingProduct) {
            throw createError({
                statusCode: 404,
                statusMessage: "Product not found"
            });
        }

        // Обновляем только поле флагов
        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: { flags: flags, updated_at: new Date() } }
        );

        if (result.matchedCount === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: "Product not found"
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating product:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error.message
        });
    }
});
