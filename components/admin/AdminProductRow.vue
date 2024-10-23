<template>
  <div class="product-row">
    <div class="product-row__wrapper">
      <img
        src="https://media.greenwaystart.com/thumb/1000/green-fiber/06006/IMG_0032d.jpg"
        alt="img"
        class="product-row__item"
      />
    </div>
    <div class="product-row__title">
      Файбер для мытья посуды Green Fiber HOME S1
    </div>
    <div class="product-row__description">
      Средства для мытья посуды легко смывают грязь, но оставляют на поверхности
      след, который может нанести вред организму. Подарить посуде чистоту, блеск
      и сияние без использования химии поможет двусторонний файбер: мягкая
      сторона бережно справится с жиром и остатками пищи, жесткая – эффективно
      удалит сильные загрязнения. Подходит для всех видов покрытий – металла,
      эмали и пластика, не оставляет царапин и разводов, а для использования
      нужна только вода. Файбер для мытья посуды – новый взгляд на привычную
      чистоту дома!
    </div>
    <div class="product-row__small-description">
      Самое лучшее для самых главных!
    </div>
    <div class="product-row__price">360.00 руб.</div>
    <div class="product-row__category">Файберы</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.product-row {
  margin: 0 auto;
  width: 100%;
  max-width: 1440px;
  display: flex;
  gap: 10px;
  height: 50px;
  overflow: hidden;

  &__wrapper {
    width: 100%;
    max-width: 100px;
    border: 1px solid #030303;
  }
  &__item {
    width: 100%;

    &:hover {
      transform: scale(3);
    }
  }
  &__title {
    width: 100%;
    max-width: 100px;
    word-wrap: break-word;
  }
  &__description {
    width: 100%;
    max-width: 300px;
  }
}
</style>
