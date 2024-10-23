<template>
  <Container>
    <div class="order">
      <div class="order-head">
        <div class="order-head__item">Название</div>
        <div class="order-head__item">Цена</div>
        <div class="order-head__item">Кол-во</div>
        <div class="order-head__item">Итого</div>
      </div>
      <div class="order-body">
        <div
          v-for="item in cartStore.cart"
          :key="item.product._id"
          class="order-item"
        >
          <div class="order-item__td">
            <div class="order-item__group">
              <div class="order-item__image">
                <NuxtImg
                  format="webp"
                  quality="10"
                  :src="item.product.image_url"
                />
              </div>
              <div class="order-item__info">
                <NuxtLink :to="`/product/${item.product.alias}`">
                  <h2 class="order-item__title">{{ item.product.name }}</h2>
                </NuxtLink>
                <button
                  class="order-item__btn"
                  @click="removeFromCart(item.product._id)"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
          <div class="order-item__td">
            <div class="order-item__price">
              {{ formatNumber(item.product.price) }} ₽
            </div>
          </div>

          <div class="order-item__td">
            <div class="order-item__quantity">
              <div class="order-item__quantity-group">
                <QuantityCounter
                  :item="item"
                  :increaseQuantity="increaseQuantity"
                  :decreaseQuantity="decreaseQuantity"
                  :class="'order-item__number'"
                />
              </div>
            </div>
          </div>

          <div class="order-item__td">
            <div class="order-item__total">
              {{ formatNumber(item.quantity * item.product.price) }} ₽
            </div>
          </div>
        </div>
        <div class="order-footer">
          <div class="order-footer__group">
            <div class="order-footer__title">Итого:</div>
            <div class="order-footer__price">
              {{ formatNumber(cartStore.totalPrice) }} ₽
            </div>
          </div>
          <Button @click="triggerAction"> Перейти к оформлению </Button>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup>
import Container from "./UI/Container.vue";
import QuantityCounter from "./UI/QuantityCounter.vue";
import Button from "./UI/Button.vue";
import { useCartStore } from "../store/cart";
import { formatNumber } from "../utils/formatNumber";

const emit = defineEmits(["handleSendOrder"]);

function triggerAction() {
  emit("handleSendOrder");
  handleSendOrder();
}

const cartStore = useCartStore();
const orderMessage = ref("");

// Метод отправки заказа
const handleSendOrder = async () => {
  const response = await cartStore.sendOrder();
  orderMessage.value = response.message;
};

// Увеличиваем количество товара
const increaseQuantity = (_id) => {
  const item = cartStore.cart.find((item) => item.product._id === _id);
  if (item) {
    cartStore.updateItemQuantity(_id, item.quantity + 1);
  }
};

// Уменьшаем количество товара
const decreaseQuantity = (_id) => {
  const item = cartStore.cart.find((item) => item.product._id === _id);
  if (item && item.quantity > 1) {
    cartStore.updateItemQuantity(_id, item.quantity - 1);
  }
};

// Удаляем товар из корзины
const removeFromCart = (_id) => {
  cartStore.removeFromCart(_id);
};

// Очищаем корзину
const clearCart = () => {
  cartStore.clearCart();
};
</script>

<style lang="scss">
.order {
  width: 100%;
  font-weight: $font-weight-medium;

  // шапка
  &-head {
    display: flex;
    align-items: center;
    padding-bottom: 25px;
    border-bottom: 1px solid $border-color;
    &__item {
      width: 60%;

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        width: 20%;
      }
      &:nth-child(2),
      &:nth-child(3) {
        text-align: center;
      }
      &:nth-child(4) {
        text-align: end;
      }
    }
  }

  // тело

  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 42px 0 28px;
    border-bottom: 1px solid $border-color;

    &__td {
      width: 60%;

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        width: 20%;
      }
      &:nth-child(2),
      &:nth-child(3) {
        text-align: center;
      }
      &:nth-child(4) {
        text-align: end;
      }
    }
    &__group {
      display: flex;
      gap: 30px;
      align-items: flex-start;
    }
    &__image {
      width: 160px;
      height: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      & img {
        max-width: 100%;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 20px;
    }
    &__title {
      font-size: $font-size-medium;
      color: $primary-text-color;
    }
    &__btn {
      color: $primary-color;
      text-decoration: underline;
      &:hover {
        color: $primary-color-hover;
      }
    }
    &__quantity {
      display: flex;
      flex-direction: column;
      align-items: center;

      &-group {
        width: 75px;
        display: flex;
        justify-content: space-around;
        padding: 5px 0;
        border: 1px solid $primary-color;

        & button {
          color: $primary-color;
        }
      }
    }
  }
  &-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 60px;
    padding-top: 40px;

    &__group {
      display: flex;
      align-items: center;
      gap: 60px;
      font-size: $font-size-medium;
    }
  }
}
</style>
