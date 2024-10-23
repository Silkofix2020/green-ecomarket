<template>
  <div class="wrapper">
    <Container class="header-container">
      <header class="header">
        <BurgerMenu />
        <div class="header__logo">
          <NuxtLink class="header__logo-link" to="/">
            <img src="/img/logo/logo.png" alt="logo" class="header__logo-img" />
            <span class="header__logo-text">green ecomarket</span>
          </NuxtLink>
        </div>
        <nav class="header__nav">
          <ul class="header__nav-list">
            <li class="header__nav-item">
              <router-link to="/catalog" class="header__nav-link"
                >Каталог</router-link
              >
            </li>
            <li class="header__nav-item">
              <router-link to="/about" class="header__nav-link"
                >О нас</router-link
              >
            </li>
            <li class="header__nav-item">
              <router-link to="/contacts" class="header__nav-link"
                >Контакты</router-link
              >
            </li>
            <li class="header__nav-item">
              <router-link to="/admin" class="header__nav-link"
                >Admin</router-link
              >
            </li>
          </ul>
        </nav>
        <div class="header__cart">
          <NuxtLink to="/cart">
            <img src="/img/ui/cart.svg" alt="cart" class="header__cart-img" />
            <span
              v-if="cartStore.totalQuantity !== 0"
              class="header__cart-badge"
              >{{ cartStore.totalQuantity }}</span
            >
          </NuxtLink>
        </div>
      </header>
    </Container>
  </div>
</template>

<script setup>
import { useCartStore } from "../store/cart";
import Container from "./UI/Container.vue";
import BurgerMenu from "./BurgerMenu.vue";

const cartStore = useCartStore();
</script>

<style lang="scss">
.wrapper {
  width: 100%;
  @include shadow-light;
}
.header {
  width: 100%;
  padding: 20px 0px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  justify-content: space-between;

  @media (max-width: 1100px) {
    padding: 20px 50px;
  }
  @media (max-width: 765px) {
    padding: 20px 26px;
  }

  &-container {
    padding: 0;
  }

  // логотип

  &__logo {
    &-link {
      display: flex;
      align-items: center;
      text-transform: uppercase;
      gap: 10px;
      text-decoration: none;
      color: $primary-color;
    }
    &-img {
      width: 35px;
    }
    &-text {
      font-size: $font-size-large;
      font-weight: $font-weight-bold;
    }
  }

  // навигация

  &__nav-list {
    display: flex;
    gap: 75px;

    @media (max-width: 1100px) {
      gap: 50px;
    }
    @media (max-width: 765px) {
      display: none;
    }
  }
  &__nav-link {
    text-decoration: none;
    color: $black-color;
  }

  // корзина

  &__cart {
    position: relative;
    &-badge {
      position: absolute;
      background-color: $primary-color;
      width: 19px;
      height: 19px;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: $font-size-small;
      color: $white-color;
      top: -12px;
      left: 20px;
    }
  }
}
</style>
