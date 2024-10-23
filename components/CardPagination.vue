<template>
  <div class="product-page__pagination">
    <div
      v-for="(color, name) in data.colors"
      :key="name"
      class="product-page__pagination-item"
      @click="changeColor(data.alias, name)"
    >
      <div
        class="product-page__pagination-circle"
        :style="{ backgroundColor: color }"
      ></div>
    </div>
  </div>
</template>

<script setup>
// Храним текущие выбранные цвета для каждого продукта
const currentColors = ref({});

// Вычисляем текущие изображения в зависимости от цвета
const currentImages = computed(() => {
  return data.value && data.value.product && data.value.product.image
    ? data.value.product.image
    : "";
});

// Смена цвета товара
const changeColor = (alias, color) => {
  currentColors.value[alias] = color;
  count.value = 1;
};
</script>

<style></style>
