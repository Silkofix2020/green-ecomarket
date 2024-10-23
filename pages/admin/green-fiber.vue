<template>
  <div class="page">
    <h1>Файберы</h1>
    <AdminAddForm @productAdded="fetchProducts" />

    <div class="products">
      <div
        class="product"
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <div class="product__item">
          <img
            class="product__image"
            :src="product.image_url"
            alt="product image"
          />
        </div>
        <div>
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <p>Цена: {{ product.price }} руб.</p>
          <button @click="addToCart(product)">Добавить в корзину</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

import { ref, onMounted, computed } from "vue";
import AdminAddForm from "../components/admin/AdminAddForm.vue";

const products = ref([]);

const fetchProducts = async (id) => {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    products.value = data;
    // localStorage.setItem("products", JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const filteredProducts = computed(() => {
  return products.value.filter((product) => product.category_id === 2);
});

onMounted(() => {
  // const storedProducts = localStorage.getItem("products");
  // if (storedProducts) {
  //   products.value = JSON.parse(storedProducts);
  // } else {
  fetchProducts();
  // }
});
</script>

<style lang="scss">
.page {
  margin: 0 auto;
  width: 100%;
  max-width: 1440px;
}
.product {
  display: flex;
  align-items: center;
  gap: 10px;

  &__item {
    position: relative;
    width: 100%;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &__image {
    width: 100%;

    &:hover {
      transform: scale(1.5);
    }
  }
}
</style>
