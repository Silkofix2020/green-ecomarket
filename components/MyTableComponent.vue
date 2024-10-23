<template>
  <Container>
    <div v-if="cartStore.cart.length > 0" class="cart">
      <table class="cart__details">
        <thead>
          <tr>
            <th></th>
            <th>Наименование</th>
            <th>Кол-во</th>
            <th>Цена за ед.</th>
            <th>Итого:</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in cartStore.cart"
            :key="item.product.alias + item.color"
            class="cart__position"
          >
            <td class="product-image">
              <NuxtPicture :src="item.image" alt="Изображение товара" />
            </td>
            <td>
              <NuxtLink :to="`/product/${item.product.alias}`">{{
                item.product.title
              }}</NuxtLink>
            </td>
            <td>
              <div class="quantity-controls">
                <button
                  @click="decreaseQuantity(item.product.alias, item.color)"
                >
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item.product.alias, item.color)"
                >
                  +
                </button>
              </div>
            </td>
            <td>{{ formatNumber(item.product.price) }} ₽</td>
            <td>{{ formatNumber(item.quantity * item.product.price) }} ₽</td>
            <td class="cart__remove">
              <button @click="removeFromCart(item.product.alias, item.color)">
                Удалить
              </button>
            </td>
          </tr>
          <tr class="cart__total">
            <td colspan="4" class="total-label">Общая стоимость заказа:</td>
            <td colspan="2" class="total-amount">
              {{ formatNumber(cartStore.totalPrice) }} ₽
            </td>
          </tr>
        </tbody>
      </table>
      <div class="actions">
        <NuxtLink to="/catalog"
          ><Button src="/catalog">Продолжить покупки</Button></NuxtLink
        >
        <div class="actions__group">
          <Button @click="handleSendOrder"> Отправить заказ</Button>
          <Button class="cart__clear" @click="clearCart">
            Очистить корзину</Button
          >
        </div>
      </div>
    </div>
    <div v-else>
      <p>Корзина пуста</p>
    </div>
    <div v-if="orderMessage">
      <p>{{ orderMessage }}</p>
    </div>
  </Container>
</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "../store/cart";
import Container from "./components/UI/Container.vue";
import Button from "./components/UI/Button.vue";
import CartTable from "./components/CartTable.vue";
import { formatNumber } from "../utils/formatNumber";

const cartStore = useCartStore();
const orderMessage = ref("");

// Метод отправки заказа
const handleSendOrder = async () => {
  const response = await cartStore.sendOrder();
  orderMessage.value = response.message;
};

// Увеличиваем количество товара
const increaseQuantity = (alias, color) => {
  cartStore.updateItemQuantity(
    alias,
    color,
    cartStore.cart.find(
      (item) => item.product.alias === alias && item.color === color
    ).quantity + 1
  );
};

// Уменьшаем количество товара
const decreaseQuantity = (alias, color) => {
  const item = cartStore.cart.find(
    (item) => item.product.alias === alias && item.color === color
  );
  if (item.quantity > 1) {
    cartStore.updateItemQuantity(alias, color, item.quantity - 1);
  }
};

// Удаляем товар из корзины
const removeFromCart = (alias, color) => {
  cartStore.removeFromCart(alias, color);
};

// Очищаем корзину
const clearCart = () => {
  cartStore.clearCart();
};
</script>
<style lang="scss">
.cart {
  width: 100%;
  max-width: 1111px;
  &__details {
    width: 100%;
    border-collapse: collapse;
    margin-top: $base-padding;
    font-family: $font-family;
    font-size: $font-size-base;
    color: $primary-text-color;

    th,
    td {
      border: 1px solid $border-color;
      padding: 12px;
      vertical-align: middle;
    }

    th {
      background-color: $background-color;
      text-align: left;
      font-weight: $font-weight-bold;
    }

    tr:nth-child(even) {
      background-color: lighten($background-color, 2%);
    }

    tr:hover {
      background-color: lighten($background-color, 4%);
    }
  }

  &__position {
    td {
      text-align: left;

      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5) {
        text-align: center;
      }
      &.cart__remove {
        text-align: center;
        & button {
          color: $error-color;
          font-weight: $font-weight-regular;
          font-size: $font-size-small;
        }
      }
    }
  }

  // Новые стили для строки общей стоимости
  &__total {
    td {
      font-weight: $font-weight-bold;
      vertical-align: middle;

      &.total-label {
        text-align: right;
        padding-right: 20px;
      }

      &.total-amount {
        text-align: center;
      }
    }
  }
  &__clear {
    opacity: 1;
    background: #f7f8fa;
    color: $primary-text-color;
    box-shadow: none;
    border: 1px solid;
    font-size: $font-size-small;
    &:hover {
      opacity: 1;
      background: $error-color;
      color: $white-color;
    }
  }
}

.product-image {
  width: 80px;
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: $base-padding;
  text-align: right;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    background-color: $background-color;
    border: 1px solid $border-color;
    padding: 0 10px;
    font-size: $font-size-base;
    cursor: pointer;
  }

  span {
    padding: 0 10px;
    font-size: $font-size-base;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
