<template>
  <Container>
    <div class="catalog">
      <SideBar class="catalog__sidebar" />
      <div class="catalog__content">
        <!-- Проверяем, есть ли товары -->
        <div v-if="products.length > 0" class="catalog__cards">
          <ProductCard v-for="item in products" :key="item._id" :item="item" />
        </div>
        <!-- Сообщение и кнопка, если товаров нет -->
        <div v-else class="catalog__empty">
          <p>Товары для выбранной категории не найдены.</p>
          <NuxtLink to="/catalog" class="catalog__back-button">Назад</NuxtLink>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";
import Container from "~/components/UI/Container.vue";
import ProductCard from "~/components/UI/ProductCard.vue";
import SideBar from "~/components/SideBar.vue";

const route = useRoute();
const products = ref([]);
const errorMessage = ref(""); // Для обработки ошибок

watchEffect(async () => {
  const category = route.params.category;
  const data = await $fetch(`/api/products/category/${category}`);
  if (data.length > 0) {
    products.value = data;
    errorMessage.value = ""; // Очищаем ошибку
  } else {
    products.value = [];
    errorMessage.value = "Товары не найдены для выбранной категории"; // Если товаров нет
  }
});
</script>

<style lang="scss" scoped>
.catalog {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  &__sidebar {
    max-width: 20%;
  }
  &__content {
    width: 75%;
  }
  &__cards {
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
