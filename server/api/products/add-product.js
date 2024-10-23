// server/api/add-product.js
import formidable from "formidable";
import { uploadFileToS3 } from "~/server/services/s3Service"; // путь изменен под Nuxt
import { saveProductToDB } from "~/server/services/dbService"; // путь изменен под Nuxt

export default defineEventHandler(async (event) => {
  try {
    // Парсинг формы
    const form = formidable({ multiples: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    console.log("Получены поля формы:", fields);
    console.log("Получены файлы:", files);

    // Извлечение полей формы и преобразование массивов в строки
    const alias = Array.isArray(fields.alias) ? fields.alias[0] : fields.alias;
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const sku = Array.isArray(fields.sku) ? fields.sku[0] : fields.sku;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;
    const short_description = Array.isArray(fields.short_description)
      ? fields.short_description[0]
      : fields.short_description;
    const price = Array.isArray(fields.price)
      ? parseFloat(fields.price[0])
      : parseFloat(fields.price);
    const category = Array.isArray(fields.category)
      ? parseInt(fields.category[0])
      : parseInt(fields.category);
    const flags = fields.flags || {};

    // Ссылки для основного и альтернативных изображений
    let s3ImageUrl = "";
    const alternativeImagesUrls = [];

    // Загрузка основного изображения
    if (files.image) {
      const mainImageName = `main.jpg`; // Имя файла для основного изображения
      const mainImagePath = `product-images/${alias}/${mainImageName}`;
      const mainImageFile = Array.isArray(files.image)
        ? files.image[0]
        : files.image;

      if (mainImageFile && mainImageFile.filepath) {
        await uploadFileToS3(
          mainImageFile.filepath,
          mainImagePath,
          mainImageFile.mimetype
        );
        s3ImageUrl = `https://s3.timeweb.cloud/${process.env.AWS_S3_BUCKET}/${mainImagePath}`;
      }
    }

    // Загрузка альтернативных изображений
    if (files.alternative_images) {
      const altImages = Array.isArray(files.alternative_images)
        ? files.alternative_images
        : [files.alternative_images];

      for (let index = 0; index < altImages.length; index++) {
        const altImage = altImages[index];
        const altImageName = `sub-image-${index + 1}.jpg`;
        const altImagePath = `product-images/${alias}/${altImageName}`;

        if (altImage && altImage.filepath) {
          await uploadFileToS3(
            altImage.filepath,
            altImagePath,
            altImage.mimetype
          );
          alternativeImagesUrls.push(
            `https://s3.timeweb.cloud/${process.env.AWS_S3_BUCKET}/${altImagePath}`
          );
        }
      }
    }

    // Подготовка данных для сохранения в базу
    const productData = {
      image_url: s3ImageUrl,
      alternative_images: alternativeImagesUrls,
      alias,
      name,
      sku,
      description,
      short_description,
      price,
      category,
      flags: {
        disable: flags?.disable || "false",
      },
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Логируем данные перед сохранением
    console.log("Данные для сохранения в БД:", productData);

    // Сохранение продукта в базу данных
    try {
      const productId = await saveProductToDB(productData);
      console.log("Продукт успешно добавлен в базу данных с ID:", productId);
      return { success: true, productId };
    } catch (dbError) {
      console.error("Ошибка при сохранении продукта в базу данных:", dbError);
      return {
        success: false,
        error: "Ошибка сохранения продукта в базу данных.",
      };
    }
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return { success: false, error: error.message };
  }
});
