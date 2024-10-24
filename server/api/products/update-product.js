import formidable from "formidable";
import { uploadFileToS3 } from "~/server/services/s3Service";
import { connectToDatabase } from "../db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
    try {
        const form = formidable({ multiples: true });

        // Парсинг формы
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(event.node.req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        console.log("Fields received:", fields);
        console.log("Files received:", files);

        // Преобразование массивов в одиночные значения
        const { _id, ...updateData } = fields;
        const productId = Array.isArray(_id) ? _id[0] : _id;
        Object.keys(updateData).forEach((key) => {
            if (Array.isArray(updateData[key])) {
                updateData[key] = updateData[key][0];
            }
        });

        if (!productId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Product ID is missing"
            });
        }

        const db = await connectToDatabase();
        const productsCollection = db.collection("products");

        // Найдем продукт в базе данных для получения текущих alternative_images
        const existingProduct = await productsCollection.findOne({
            _id: new ObjectId(productId)
        });
        if (!existingProduct) {
            throw createError({
                statusCode: 404,
                statusMessage: "Product not found"
            });
        }

        let s3ImageUrl = "";

        // Если alternative_images не массив, преобразуем его в массив или инициализируем пустым
        let alternativeImagesUrls = Array.isArray(
            existingProduct.alternative_images
        )
            ? existingProduct.alternative_images
            : [];

        // Загрузка основного изображения в S3
        if (files.image && files.image[0].filepath) {
            const alias = updateData.alias || "default";
            const mainImagePath = `product-images/${alias}/main.jpg`;

            // Загружаем основное изображение и сохраняем ссылку
            s3ImageUrl = await uploadFileToS3(
                files.image[0].filepath,
                mainImagePath,
                files.image[0].mimetype
            );
            updateData.image_url = `https://s3.timeweb.cloud/${process.env.AWS_S3_BUCKET}/${mainImagePath}`;
        }

        // Проверка на наличие новых альтернативных изображений
        if (
            Object.keys(files).some((key) =>
                key.startsWith("alternative_images")
            )
        ) {
            const alternativeImagesUploadPromises = Object.keys(files)
                .filter((fileKey) => fileKey.startsWith("alternative_images"))
                .map(async (fileKey, index) => {
                    const alias = updateData.alias || "default";
                    // Генерируем уникальный путь для каждого нового изображения
                    const altImagePath = `product-images/${alias}/sub-image-${
                        alternativeImagesUrls.length + index + 1
                    }.jpg`;

                    const file = files[fileKey][0];
                    await uploadFileToS3(
                        file.filepath,
                        altImagePath,
                        file.mimetype
                    );
                    return `https://s3.timeweb.cloud/${process.env.AWS_S3_BUCKET}/${altImagePath}`;
                });

            // Ждем завершения загрузки всех альтернативных изображений и объединяем их с уже существующими
            alternativeImagesUrls = [
                ...alternativeImagesUrls,
                ...(await Promise.all(alternativeImagesUploadPromises))
            ];
        }

        // Если альтернативные изображения есть, сохраняем их в базе
        if (alternativeImagesUrls.length > 0) {
            updateData.alternative_images = alternativeImagesUrls;
        } else {
            // Если альтернативные изображения не обновляются, сохраняем старые
            updateData.alternative_images =
                existingProduct.alternative_images || [];
        }

        // Преобразование _id в ObjectId
        const objectId = new ObjectId(productId);

        // Обновление продукта в базе данных
        const result = await productsCollection.updateOne(
            { _id: objectId },
            { $set: updateData }
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
