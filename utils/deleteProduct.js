// utils/deleteProduct.js

export const deleteProduct = async (productId) => {
  try {
    const { data, error } = await useFetch(
      `/api/products/delete-product?id=${productId}`,
      {
        method: "DELETE",
      }
    );

    // Логи для проверки значений
    console.log("Данные запроса:", data.value); // Выводим значение data
    console.log("Ошибка запроса:", error.value); // Выводим значение error

    // Проверка на наличие ошибки
    if (error.value) {
      console.error("Ошибка при запросе:", error.value);
      return { success: false, error: error.value.message };
    }

    // Явная проверка на успешный ответ
    if (data.value && data.value.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: data.value?.error || "Неизвестная ошибка",
      };
    }
  } catch (err) {
    console.error("Произошла ошибка при удалении продукта:", err);
    return { success: false, error: err.message };
  }
};
