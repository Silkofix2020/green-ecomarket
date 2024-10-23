<template>
  <NuxtLink
    v-if="item.flags && item.flags.is_enabled"
    class="card__link"
    :to="`/product/${item.alias}`"
  >
    <div class="card">
      <div class="card-img__wrapper">
        <NuxtImg
          format="webp"
          loading="lazy"
          :src="item.image_url"
          alt="goods"
          class="card-img__item"
        />
      </div>
      <div class="card__description">
        <h5 class="card__title">{{ trimmedText }}</h5>

        <p class="card__price">{{ formatNumber(item.price) }} ₽</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from "vue";
import { formatNumber } from "#imports";

const props = defineProps({
  item: {
    type: Object,
    require: true,
  },
});

const maxLength = 20;

const trimmedText = computed(() => {
  const text = props.item.name;
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
});
</script>

<style lang="scss">
.card {
  position: relative;
  width: 255px;
  @include shadow-light;
  transition: 0.3s;

  &__badge {
    position: absolute;
    background-color: $primary-color;
    color: #fff;
    padding: 0 5px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 10px;
    top: -10px;
    left: -5px;
  }

  &:hover {
    box-shadow: 0px 16px 20px -9px rgba(0, 0, 0, 0.1);

    & .card-img__item {
      transform: scale(0.9);
    }
  }

  &__link {
    text-decoration: none;
  }

  &-img {
    &__wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &__item {
      width: 100%;
      transition: 0.3s;
    }
  }

  &__description {
    background-color: $white-color;
    padding: 11px 26px 16px;
    display: flex;
    flex-direction: column;
  }
  &__title {
    line-height: 28px;
    color: $accent-text-color;
  }
  &__price {
    display: flex;
    gap: 10px;
    align-items: center;
    align-self: flex-end;
    color: $primary-color;
    font-size: $font-size-medium;
    font-weight: $font-weight-bold;

    &-old {
      color: $accent-color;
      font-size: $font-size-base;
      font-weight: $font-weight-regular;
      text-decoration: line-through;
      text-decoration-thickness: 2px;
    }
  }
}
</style>
