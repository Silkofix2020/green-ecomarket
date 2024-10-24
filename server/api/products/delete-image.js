import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { connectToDatabase } from "../db";
import { ObjectId } from "mongodb";

// Настройка S3 клиента
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: "https://s3.timeweb.cloud",
  forcePathStyle: true,
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { productId, imageUrl, imageType } = body; // imageType может быть 'main' или 'alternative'

    if (!productId || !imageUrl || !imageType) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required parameters",
      });
    }

    const db = await connectToDatabase();
    const productsCollection = db.collection("products");

    // Найдем продукт
    const existingProduct = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });
    if (!existingProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    // Удаление файла из S3
    const fileName = imageUrl.split("/").pop(); // Получаем имя файла из URL
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `product-images/${existingProduct.alias}/${fileName}`,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log(`Изображение удалено из S3: ${fileName}`);

    // Обновление продукта в базе данных
    let updateData = {};

    if (imageType === "main") {
      // Удаление основного изображения
      updateData.image_url = "";
    } else if (imageType === "alternative") {
      // Удаление одного из альтернативных изображений
      const updatedAlternativeImages =
        existingProduct.alternative_images.filter((img) => img !== imageUrl);
      updateData.alternative_images = updatedAlternativeImages;
    }

    await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updateData }
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    });
  }
});
