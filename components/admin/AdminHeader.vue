<template>
  <nav class="admin-header">
    <NuxtLink class="admin-header__link" to="/admin">Главная</NuxtLink>
    <NuxtLink class="admin-header__link" to="/admin/green-fiber"
      >Файберы</NuxtLink
    >
    <NuxtLink class="admin-header__link" to="/admin/aquamagic"
      >Aquamagic</NuxtLink
    >
    <NuxtLink class="admin-header__link" to="/admin/fibers">Куда-то</NuxtLink>
    <NuxtLink class="admin-header__link" to="/admin/main-products"
      >Main products</NuxtLink
    >
    <NuxtLink class="admin-header__link" to="/">На главную сайта</NuxtLink>
  </nav>
</template>

<script setup></script>

<style lang="scss">
.admin-header {
  margin: 0 auto;
  width: 100%;
  max-width: 1440px;
  display: flex;
  justify-content: space-around;
  gap: 5px;

  &__link {
    width: 100%;
    background-color: rgb(24, 11, 23);
    padding: 20px 0;
    text-decoration: none;
    color: azure;
    text-align: center;

    &.router-link-active {
      background-color: rgb(212, 43, 43);
    }
  }
}
</style>
