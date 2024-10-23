<template>
  <Container>
    <div class="products">
      <h1 class="products__title">Наши продукты</h1>
      <h4 class="products__subtitle">Закажите для себя и своих близких</h4>
      <div class="products__cards">
        <ProductCard v-for="item in cards" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script setup>
import Container from "./UI/Container.vue";
import ProductCard from "./UI/ProductCard.vue";

const cards = [
  {
    alias: "Spiced-Mint",
    title: "Spiced Mint",
    image_url: "/img/image1.png",
    price: 999,
    promo: true,
    promoText: "1+1",
  },
  {
    alias: "Sweet-Straweberry",
    title: "Sweet Straweberry",
    image_url: "/img/image2.png",
    price: 1050,
  },
  {
    alias: "Cool-Blueberries",
    title: "Cool Blueberries",
    image: "/img/image1-1.png",
    price: 650,
    promoPrice: 550,
    promo: true,
    promoText: "SALE",
    sale: true,
  },
  {
    alias: "Juicy-Lemon",
    title: "Juicy Lemon",
    image: "/img/image1-2.png",
    price: 3250,
  },
  {
    alias: "Product-name",
    title: "Product name",
    image: "/img/image1-3.png",
    price: 378,
  },
  {
    alias: "Fragrant-Cinnamon",
    title: "Fragrant Cinnamon",
    image: "/img/image1-4.png",
    price: 10368,
  },
  {
    alias: "Summer-Cherries",
    title: "Summer Cherries",
    image: "/img/image1-5.png",
    price: 100000,
    promoPrice: 99999,
    promo: true,
    promoText: "SALE",
    sale: true,
  },
  {
    alias: "Clean-Lavander",
    title: "Clean Lavander",
    image: "/img/image1-6.png",
    price: 796,
  },
];
</script>

<style lang="scss">
.products {
  width: 100%;
  max-width: 1111px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 90px 0 125px;
  &__title {
    margin-bottom: 15px;
    color: $secondary-text-color;
  }
  &__subtitle {
    margin-bottom: 60px;
    color: $accent-color;
    font-weight: $font-weight-regular;
  }
  &__cards {
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 30px;
  }
}
</style>
