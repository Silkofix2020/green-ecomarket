import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import "dotenv/config";

// Инициализация клиента S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: "https://s3.timeweb.cloud", // Используем https
  forcePathStyle: true, // Принудительное использование path-style URL
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 300000, // 5 минут таймаут на подключение
    socketTimeout: 300000, // 5 минут таймаут на сокеты
  }),
  maxAttempts: 5, // Увеличенное количество попыток
});

// Функция для загрузки файла в S3
export const uploadFileToS3 = async (filePath, bucketKey, mimeType) => {
  try {
    const fileData = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: bucketKey, // Путь внутри бакета
      Body: fileData,
      ContentType: mimeType,
    });

    // Загрузка в S3
    const uploadResult = await s3Client.send(command);
    console.log(`Файл ${bucketKey} успешно загружен в S3.`);
    return uploadResult;
  } catch (error) {
    console.error(`Ошибка при загрузке файла ${bucketKey} в S3:`, error);
    throw new Error(`Не удалось загрузить файл в S3: ${error.message}`);
  } finally {
    // Удаление временного файла
    fs.unlink(filePath, (err) => {
      if (err)
        console.error(`Ошибка при удалении временного файла ${filePath}:`, err);
      else console.log(`Временный файл ${filePath} успешно удален`);
    });
  }
};
