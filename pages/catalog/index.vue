<template>
  <Container>
    <div class="catalog">
      <SideBar class="catalog__sidebar" />
      <div class="catalog__cards">
        <ProductCard v-for="item in data" :key="item._id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script setup>
import Container from "~/components/UI/Container.vue";
import ProductCard from "~/components/UI/ProductCard.vue";
import SideBar from "~/components/SideBar.vue";

const { data, error, refresh } = await useFetch("/api/products");
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
  &__cards {
    max-width: 75%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
