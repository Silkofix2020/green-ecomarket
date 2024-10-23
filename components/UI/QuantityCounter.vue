<template>
  <button @click="decreaseQuantity(item.product._id)">-</button>
  <span :class="class">{{ item.quantity }}</span>
  <button @click="increaseQuantity(item.product._id)">+</button>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  increaseQuantity: {
    type: Function,
    required: true,
  },
  decreaseQuantity: {
    type: Function,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
});
</script>

<style></style>
