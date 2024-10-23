<template>
  <div>
    <CategoryManager />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
useHead({
  title: "GM Admin: Main Products",
});
import CategoryManager from "../../components/admin/CategoryManager.vue";
</script>

<style></style>
