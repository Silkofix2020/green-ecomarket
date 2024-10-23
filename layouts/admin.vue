<template>
  <AdminHeader v-if="isLoggedIn" />
  <NuxtPage />
  <div v-if="isLoggedIn"></div>

  <div class="redirect" v-else>
    <h3 class="redirect__title">Пользователь не авторизован!!!</h3>
    <div class="redirect__group">
      <h5 class="redirect__subtitle">Переадресация</h5>
      <div class="redirect-animate">
        <span class="redirect-animate__item">.</span>
        <span class="redirect-animate__item">.</span>
        <span class="redirect-animate__item">.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useHead, useRoute, useRouter, useNuxtApp } from "#imports";
import AdminHeader from "~/components/admin/AdminHeader.vue";

const route = useRoute();
const router = useRouter();

// useHead({
//   title: "GM Admin",
//   meta: [
//     { name: "description", content: "This is a dynamic page description" },
//   ],
// });

const { $auth } = useNuxtApp();
const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = $auth.isAuthenticated();
});
</script>

<style lang="scss">
.redirect {
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
  &__group {
    display: flex;
    gap: 5px;
  }
  &-animate {
    position: relative;

    &__item {
      position: absolute;
      &:nth-child(1) {
        left: 0;
        animation: 0.7s ease-in infinite 0.2s jump1;
      }
      &:nth-child(2) {
        left: 5px;
        animation: 0.7s ease-in infinite 0.4s jump1;
      }
      &:nth-child(3) {
        left: 10px;
        animation: 0.7s ease-in infinite 0.6s jump1;
      }
    }
  }
}

@keyframes jump1 {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
