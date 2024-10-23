<template>
  <footer class="footer">
    <Container>
      <div class="footer__hl"></div>
      <div class="footer__logo">
        <div class="footer__logo-link">
          <img src="/img/logo/logo.png" alt="logo" class="footer__logo-img" />
          <span class="footer__logo-text">green market</span>
        </div>
      </div>
      <NuxtLink
        to="https://www.figma.com/design/1WEW3KE3IbWzdac5GLQJXH/E-Commerce-UI-KIT-(Community)?node-id=116-92&node-type=canvas&t=T87jWvCNrVUGERKC-0"
        target="_blank"
        >Дизайн</NuxtLink
      >
      <p class="footer__article">
        Сайт бизнес партнера Greenway Фамилия И.О. ID 1234567
      </p>
      <p class="footer__article">© {{ currentYear }} GREEN MARKET</p>
      <p class="footer__article">Created by Gleb Khodulev</p>
    </Container>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import Container from "../components/UI/Container.vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style lang="scss">
.footer {
  background-color: $secondary-color;

  &__hl {
    width: 100%;
    height: 2px;
    background-color: #fff;
    margin-top: 40px;
  }

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
  &__article {
    color: $white-color;
  }
}
</style>
