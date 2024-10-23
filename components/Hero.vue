<template>
  <Container>
    <div class="hero">
      <slot></slot>
    </div>
  </Container>
</template>

<script setup>
import Container from "./UI/Container.vue";
</script>

<style lang="scss">
.hero {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 175px 0;
  position: relative;
  z-index: 0;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/img/hero-bg-image.png");
    background-position: center;
    background-size: cover;
    z-index: -1;
  }
  @media (max-width: 765px) {
    padding: 152px 15px 181px;
    &::before {
      background-image: url("/img/mobile-bg-image.png");
    }
  }
}
</style>
