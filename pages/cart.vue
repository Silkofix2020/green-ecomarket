<template>
    <Container>
        <div class="cart">
            <div class="cart-hero">
                <h2 v-if="cartStore.cart.length > 0" class="cart__title">
                    Ваши товары в корзине
                </h2>
                <h2 v-else class="cart__title">Корзина пуста!</h2>
                <NuxtLink class="cart__link" to="/catalog"
                    >Назад к покупкам</NuxtLink
                >
            </div>

            <CartTable
                @handleSendOrder="sendSuccsess"
                v-if="cartStore.cart.length > 0"
            />
        </div>
    </Container>
</template>

<script setup>
import Container from "../Components/UI/Container.vue";
import { useCartStore } from "../store/cart";

const cartStore = useCartStore();

function sendSuccsess() {
    console.log("hello");
}
</script>
<style lang="scss">
.cart {
    width: 100%;

    &-hero {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: 40px 0;
    }
    &__title {
        color: $primary-text-color;
    }
    &__link {
        color: $primary-color;
        text-decoration: underline;
    }
}
</style>
