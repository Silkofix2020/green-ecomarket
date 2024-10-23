<template>
  <Header />
  <main class="main">
    <NuxtPage />
  </main>
  <Footer />
</template>

<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<style lang="scss">
.main {
  min-height: 100dvh;
}
</style>
