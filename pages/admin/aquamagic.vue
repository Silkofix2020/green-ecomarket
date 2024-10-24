<template>
    <Container>
        <div class="product-view">
            <div
                class="product-view__container"
                v-for="product in products"
                :key="product._id"
            >
                <DropDown :title="product.name">
                    <AProductCard
                        :product="product"
                        :categories="categories"
                        @update="updateProductField"
                        @delete="removeProduct"
                    />
                </DropDown>
                <div class="product-view__management">
                    <ToggleButton
                        :isActive="product.flags?.is_enabled ?? false"
                        @update:isActive="
                            (newValue) => handleToggle(newValue, product._id)
                        "
                    />
                </div>
            </div>
        </div>
        <Notification
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
        />
    </Container>
</template>

<script setup>
definePageMeta({
    layout: "admin",
    middleware: "auth"
});

useHead({
    title: "GM Admin: Fibers"
});

import { ref, watch } from "vue";
import AProductCard from "../components/admin/AProductCard.vue";
import DropDown from "../components/admin/DropDown.vue";
import Container from "../components/UI/Container.vue";
import ToggleButton from "../components/UI/ToggleButton.vue";
import Notification from "../components/UI/Notification.vue";
import { updateProduct } from "../utils/productUtils.js";
import { useFetch } from "#app";
import { toRaw } from "vue";

const products = ref([]);
const notificationMessage = ref("");
const notificationType = ref("success");
const categories = ref([]);

// Загружаем категории продуктов
const { data: fetchedCategories } = await useFetch("/api/categories");
if (fetchedCategories.value) {
    categories.value = fetchedCategories.value;
}

// Загружаем продукты
const { data: fetchedProducts } = await useFetch("/api/products");
if (fetchedProducts.value) {
    products.value = fetchedProducts.value;
}

watch(fetchedProducts, (newProducts) => {
    console.log("Полученные продукты:", newProducts); // Проверка, что данные загружаются
    if (newProducts) {
        products.value = newProducts;
    }
});

// Функция для обновления полей продукта
const updateProductField = ({ field, value, id }) => {
    const product = products.value.find((p) => p._id === id);
    if (product) {
        product[field] = value;
    }
};

// Обработчик для удаления продукта
const removeProduct = (productId) => {
    // Обновляем массив products, удаляя из него продукт с указанным productId
    products.value = products.value.filter(
        (product) => product._id !== productId
    );
};

const handleToggle = async (newValue, productId) => {
    try {
        const product = products.value.find((p) => p._id === productId);

        if (!product) {
            console.error("Продукт не найден.");
            return;
        }

        // Убедимся, что поле flags является объектом и обновим is_enabled
        if (typeof product.flags === "object" && product.flags !== null) {
            product.flags.is_enabled = newValue;
        } else {
            console.error("Поле flags отсутствует или не является объектом.");
            return;
        }

        // Отправляем обновленные флаги на сервер
        const response = await fetch("/api/products/update-flags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: product._id,
                flags: product.flags // Отправляем только обновленные флаги
            })
        });

        const result = await response.json();

        if (result.success) {
            if (product.flags.is_enabled) {
                notificationMessage.value = "Продукт включен!";
            } else {
                notificationMessage.value = "Продукт выключен!";
            }
            notificationType.value = "success";
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error("Ошибка при обновлении флагов продукта:", error);
        notificationMessage.value = "Ошибка включения продукта!";
        notificationType.value = "error";
    }
};

// Сбрасываем сообщение после исчезновения уведомления
watch(notificationMessage, (newMessage) => {
    if (newMessage) {
        setTimeout(() => {
            notificationMessage.value = "";
        }, 3000);
    }
});
</script>

<style lang="scss">
.product-view {
    width: 100%;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    &__container {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 20px;
    }
}
</style>
