<template>
  <div class="burger-menu" v-if="shouldRender2">
    <button class="burger-menu__button" @click="toggleMenu">
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
    </button>
    <nav
      class="burger-menu__nav"
      v-if="shouldRender"
      v-show="isVisible"
      :class="navClass"
      @animationend="handleAnimationEnd"
    >
      <ul class="burger-menu__list">
        <li class="burger-menu__item">
          <router-link to="/catalog" class="burger-menu__link"
            >Каталог</router-link
          >
        </li>
        <li class="burger-menu__item">
          <router-link to="/about" class="burger-menu__link">О нас</router-link>
        </li>
        <li class="burger-menu__item">
          <router-link to="/contacts" class="burger-menu__link"
            >Контакты</router-link
          >
        </li>
        <li class="burger-menu__item">
          <router-link to="/admin" class="burger-menu__link">Admin</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

const isMenuOpen = ref(false);
const shouldRender = ref(false);
const shouldRender2 = ref(false);
const isVisible = ref(false);
const wasOpen = ref(false);

const toggleMenu = () => {
  if (isMenuOpen.value) {
    wasOpen.value = true;
    isMenuOpen.value = false;
    setTimeout(() => {
      isVisible.value = false;
      shouldRender.value = false;
    }, 400); // Длительность анимации в миллисекундах
  } else {
    shouldRender.value = true;
    setTimeout(() => {
      isVisible.value = true;
      isMenuOpen.value = true;
    }, 0); // Немедленно показываем видимость меню после рендеринга
  }
};

const navClass = computed(() => {
  return {
    "burger-menu__nav--open": isMenuOpen.value,
    "burger-menu__nav--close": !isMenuOpen.value && wasOpen.value,
  };
});

const handleAnimationEnd = () => {
  if (!isMenuOpen.value) {
    wasOpen.value = false;
  }
};

const checkWidth = () => {
  if (window.innerWidth <= 764) {
    shouldRender.value = false; // При инициализации, чтобы меню не было открыто
    isVisible.value = false;
    shouldRender2.value = true;
  } else {
    isMenuOpen.value = false;
    wasOpen.value = false;
    shouldRender.value = false;
    isVisible.value = false;
    shouldRender2.value = false;
  }
};

onMounted(() => {
  checkWidth();
  window.addEventListener("resize", checkWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkWidth);
});
</script>

<style lang="scss" scoped>
.burger-menu__button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  box-shadow: none;

  span {
    width: 30px;
    height: 3px;
    background: $black-color;
    border-radius: 2px;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform-origin: 3px;
    }

    &:nth-child(2) {
      transform-origin: 1px;
    }

    &:nth-child(3) {
      transform-origin: 4px;
    }

    &.open:nth-child(1) {
      transform: rotate(45deg);
    }

    &.open:nth-child(2) {
      opacity: 0;
    }

    &.open:nth-child(3) {
      transform: rotate(-45deg);
    }
  }
}

.burger-menu__nav {
  position: absolute;
  top: 75px;
  left: 0;
  right: 0;
  background-color: $white-color;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 20px;
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  overflow: hidden;

  animation-duration: 0.5s;
  animation-fill-mode: forwards;

  &--open {
    animation-name: menuOpen;
  }

  &--close {
    animation-name: menuClose;
  }

  .burger-menu__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .burger-menu__item {
    text-align: center;
  }

  .burger-menu__link {
    text-decoration: none;
    color: $black-color;
  }
}

@keyframes menuOpen {
  0% {
    height: 0;
    padding: 0 20px;
    opacity: 0;
  }
  100% {
    height: 178px;
    padding: 20px 20px;
    opacity: 1;
  }
}
@keyframes menuClose {
  0% {
    height: 178px;
    padding: 20px 20px;
    opacity: 1;
  }
  100% {
    height: 0;
    padding: 0;
    opacity: 0;
  }
}
</style>
