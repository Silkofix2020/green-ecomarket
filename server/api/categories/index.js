import { connectToDatabase } from "../db";

export default defineEventHandler(async (event) => {
  const method = event.req.method;
  const db = await connectToDatabase();
  const categoriesCollection = db.collection("categories");

  if (method === "GET") {
    const categories = await categoriesCollection
      .find({}, { projection: { name: 1, alias: 1 } })
      .toArray();
    return categories;
  }

  if (method === "POST") {
    // Используем readBody для получения тела запроса
    const body = await readBody(event);
    const { name, alias } = body;

    if (!name && !alias) {
      throw createError({
        statusCode: 400,
        message: "Название категории обязательно",
      });
    }

    await categoriesCollection.insertOne({
      name,
      alias,
      created_at: new Date(),
    });
    return { message: "Категория успешно добавлена" };
  }
});
