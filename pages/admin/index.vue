<template>
  <div class="page"><h1>Hello</h1></div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style></style>
