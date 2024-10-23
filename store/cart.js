import { toRaw, ref, computed, watch, onMounted } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cart = ref([]);
  let isInitialized = ref(false); // Флаг для отслеживания инициализации

  // Восстанавливаем данные из localStorage при загрузке
  onMounted(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        cart.value = JSON.parse(storedCart);
        console.log("Корзина восстановлена из localStorage:", cart.value);
      } catch (error) {
        console.error(
          "Ошибка при восстановлении корзины из localStorage:",
          error
        );
        cart.value = [];
      }
    }
    isInitialized.value = true; // Устанавливаем флаг после восстановления данных
  });

  // Отслеживаем изменения в корзине и сохраняем в localStorage
  watch(
    cart,
    (newCart) => {
      if (isInitialized.value) {
        const rawCart = toRaw(newCart); // Преобразуем реактивный объект в "сырой"
        localStorage.setItem("cart", JSON.stringify(rawCart));
      }
    },
    { deep: true }
  );

  // Метод добавления продукта в корзину
  const addToCart = (product, quantity) => {
    const existingProduct = cart.value.find(
      (item) => item.product._id === product._id
    );

    if (existingProduct) {
      // Если продукт уже есть в корзине, увеличиваем количество
      existingProduct.quantity += quantity;
    } else {
      // Если продукта нет в корзине, добавляем новый элемент
      cart.value.push({
        product: {
          _id: product._id,
          name: product.name,
          image_url: product.image_url,
          price: product.price,
          sku: product.sku, // можем добавить sku для уникальности
          alias: product.alias, // можно использовать alias при рендере ссылки на продукт
        },
        quantity: quantity,
      });
    }
    console.log("Корзина после добавления:", cart.value);
  };

  // Метод для обновления количества товара
  const updateItemQuantity = (_id, quantity) => {
    const product = cart.value.find((item) => item.product._id === _id);
    if (product) {
      product.quantity = quantity;
      if (product.quantity < 1) {
        removeFromCart(_id);
      }
    }
  };

  // Метод для удаления товара из корзины
  const removeFromCart = (_id) => {
    cart.value = cart.value.filter((item) => item.product._id !== _id);
  };

  const clearCart = () => {
    cart.value = [];
    localStorage.removeItem("cart"); // Очищаем localStorage при очистке корзины
  };

  const sendOrder = async () => {
    try {
      const orderData = cart.value.map((item) => ({
        product: item.product.name,
        image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
        sku: item.product.sku,
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      clearCart();

      return { success: true, message: "Заказ успешно отправлен!" };
    } catch (error) {
      return { success: false, message: "Ошибка при отправке заказа" };
    }
  };

  const totalQuantity = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return cart.value.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
  });

  return {
    cart,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    sendOrder,
    totalQuantity,
    totalPrice,
  };
});
