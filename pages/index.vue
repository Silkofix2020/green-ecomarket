<template>
  <Hero>
    <CallToAction />
  </Hero>

  <ProductsSection />
</template>

<script setup>
import Hero from "../components/Hero.vue";
import CallToAction from "../components/CallToAction.vue";
import ProductCard from "../components/UI/ProductCard.vue";
</script>

<style lang="scss">
.test {
  padding: 100px 0;
}
</style>
