import { connectToDatabase } from "../../api/db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const db = await connectToDatabase();
  const categoriesCollection = db.collection("categories");

  try {
    await categoriesCollection.deleteOne({ _id: new ObjectId(id) });
    return { message: "Категория удалена успешно" };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка при удалении категории",
    });
  }
});
