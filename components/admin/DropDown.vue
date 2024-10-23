<template>
  <div class="dropdown" @click="handleClick()">
    <h5 v-if="title" class="dropdown__header">{{ title }}</h5>
    <h5 v-else class="dropdown__header">Продукт без названия</h5>
    <img
      class="dropdown__img"
      :class="{ open: isOpen }"
      src="/img/ui/arrow.svg"
      alt="arrow"
    />
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isOpen" ref="content" class="dropdown__content" @click.stop>
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { nextTick } from "vue";

const props = defineProps({
  title: String,
});

const isOpen = ref(false);
const content = ref(null);

const handleClick = () => {
  isOpen.value = !isOpen.value;
};

const beforeEnter = (el) => {
  el.style.height = "0";
  el.style.opacity = "0";
  el.style.marginTop = "0";
};

const enter = (el) => {
  el.style.transition =
    "height 0.5s ease, opacity 0.5s ease, margin-top 0.5s ease";
  const height = el.scrollHeight;
  el.style.height = `${height}px`;
  el.style.opacity = "1";
  el.style.marginTop = "20px";
};

const afterEnter = (el) => {
  el.style.height = "auto";
};

const beforeLeave = (el) => {
  const height = el.scrollHeight;
  el.style.height = `${height}px`;
  el.style.marginTop = "20px";
};

const leave = (el) => {
  el.style.transition =
    "height 0.5s ease, opacity 0.5s ease, margin-top 0.5s ease";
  nextTick(() => {
    el.style.height = "0";
    el.style.opacity = "0";
    el.style.marginTop = "0";
  });
};

const afterLeave = (el) => {
  el.style.height = "0";
};
</script>

<style lang="scss">
.dropdown {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  cursor: pointer;
  border: $input-border;
  border-color: $primary-color;
  border-radius: 5px;
  transition: max-height 2s ease-in;
  user-select: none;
  @include shadow-light;

  @media (max-width: 747px) {
    width: 85%;
  }

  &__img {
    position: absolute;
    top: 0px;
    right: 10px;
    width: 20px;
    transform: rotate(90deg);
    transition: 0.6s;
  }

  &__content {
    user-select: text;
    overflow: hidden;
    height: 0;
    opacity: 0;
    margin-top: 0;
    transition: max-height 0.5s ease, opacity 0.5s ease, margin-top 0.5s ease;
    cursor: default;
  }
}
.open {
  transform: rotate(270deg);
}
</style>
