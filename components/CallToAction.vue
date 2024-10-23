<template>
  <div class="call-to-action">
    <div class="call-to-action__content">
      <img src="/img/cta-image.png" alt="cta" class="call-to-action__image" />
      <h1 class="call-to-action__title">Свечи ручной работы</h1>
      <p class="call-to-action__text">
        Изготовленныe вручную из натурального соевого воска, Candleaf-свечи
        станут вашими спутниками во все моменты удовольствия.
      </p>
    </div>
    <Button>Изучить нашу коллекцию</Button>
  </div>
</template>

<script setup>
import Button from "./UI/Button.vue";
</script>

<style lang="scss">
.call-to-action {
  width: 100%;
  max-width: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 45px;
  border-radius: 5px;
  padding: 33px 95px 64px;
  backdrop-filter: blur(24px);
  background-color: rgba($color: $background-color, $alpha: 0.4);
  @include shadow($black-color);

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    & h1,
    p {
      color: $primary-text-color;
    }
  }
  &__title {
    font-weight: $font-weight-regular;
  }
  &__text {
    font-size: $font-size-small;
  }
}
</style>
