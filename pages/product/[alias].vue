<template>
    <Container>
        <div class="product-page">
            <div class="product-page__images-wrapper">
                <div class="product-page__image">
                    <NuxtImg
                        :src="data.image_url"
                        :alt="data.image"
                        format="webp"
                        class="product-page__img"
                    />
                </div>
                <div class="product-page__alt-images">
                    <div
                        class="testing"
                        v-for="(item, index) in data.alternative_images"
                        :key="index"
                    >
                        <NuxtImg :src="item" :alt="item.image" format="webp" />
                    </div>
                </div>
                <!-- здесь должна быть пагинация -->
            </div>
            <div class="product-page__description-wrapper">
                <h2 class="product-page__title">{{ data.title }}</h2>
                <p class="product-page__description">
                    {{ data.description }}
                </p>
                <div class="product-page__count">
                    <Button class="product-page__count-btn" @click="decrement"
                        >-</Button
                    >
                    <span>{{ count }}</span>
                    <Button class="product-page__count-btn" @click="increment"
                        >+</Button
                    >
                </div>
                <p class="product-page__price">
                    Цена:
                    <span class="product-page__price-item">{{
                        data.price
                    }}</span>
                    ₽
                </p>
                <Button class="button" @click="addToCart"
                    >Добавить в корзину</Button
                >
            </div>
        </div>
    </Container>
    <Notification
        v-if="notificationMessage"
        :message="notificationMessage"
        :type="notificationType"
        @click="notificationMessage = ''"
    />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useCartStore } from "../store/cart";
import Container from "../components/UI/Container.vue";
import Button from "../components/UI/Button.vue";
import Notification from "../components/UI/Notification.vue";

// Получаем alias из маршрута
const route = useRoute();
const alias = route.params.alias;

// Состояние данных продукта и ошибок
const { data, error } = await useFetch(`/api/products/${alias}`);

// Храним количество продукта
const count = ref(1);

// Для уведомлений
const notificationMessage = ref("");
const notificationType = ref("");

// Используем хранилище корзины
const cartStore = useCartStore();

const addToCart = () => {
    const product = {
        _id: data.value._id, // Уникальный ID продукта
        alias: data.value.alias, // Alias для ссылок
        name: data.value.name, // Название продукта
        image_url: data.value.image_url, // Изображение продукта
        price: data.value.price, // Цена продукта
        sku: data.value.sku // SKU продукта
    };

    // Добавляем продукт в корзину с указанным количеством
    cartStore.addToCart(product, count.value);
    showNotification();
};

// Увеличение количества товара
const increment = () => {
    count.value++;
};

// Уменьшение количества товара
const decrement = () => {
    if (count.value > 1) count.value--;
};

// Показ уведомления
const showNotification = () => {
    notificationMessage.value = "Товар добавлен в корзину!";
    notificationType.value = "success";

    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notificationMessage.value = "";
    }, 3000);
};

// Устанавливаем значения по умолчанию для цветов и изображений после загрузки данных
onMounted(() => {
    if (data.value && data.value.product) {
        const product = data.value.product;
        currentColors.value[product.alias] = product.color
            ? Object.keys(product.color)[0]
            : "default";
    }
});
</script>

<style lang="scss">
.product-page {
    width: 100%;
    max-width: 1110px;
    display: flex;
    justify-content: space-between;
    padding: 26px 0 114px;

    @media (max-width: 764px) {
        flex-direction: column;
    }
    &__img-wrapper {
        width: 100%;
        max-width: 540px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    &__img {
        width: 100%;
        border: 1px solid $border-color;
        border-radius: 5px;
    }
    &__pagination {
        display: flex;
        gap: 10px;
        &-item {
            width: 50px;
            height: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid $border-color;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                @include shadow-light;
            }
        }
        &-circle {
            width: 26px;
            height: 26px;
            border-radius: 50%;
        }
    }
    &__description-wrapper {
        width: 100%;
        max-width: 540px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    &__count {
        display: flex;
        align-items: center;
        gap: 10px;

        &-btn {
            padding: 4px 16px;
        }
    }
    &__price {
        font-size: $font-size-medium;
        &-item {
            font-weight: $font-weight-bold;
        }
    }
}
.selected {
    border: 2px solid $primary-color;
}
</style>
