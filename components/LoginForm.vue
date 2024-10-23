<template>
  <div class="login">
    <div class="login__wrapper">
      <h1 class="login__title">Login</h1>
      <form class="login__form" @submit.prevent="handleLogin">
        <Input
          id="username"
          v-model="username"
          type="text"
          showLabel
          required
          placeholder="Username"
        />
        <Input
          id="password"
          v-model="password"
          type="password"
          showLabel
          required
          placeholder="Password"
        />
        <Button class="login__button" type="submit">Login</Button>
      </form>
      <div>
        <span>Заблудился? ➤ </span
        ><NuxtLink class="login__link" to="/">Вернуться на Главную</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useNuxtApp } from "#app";
import Button from "../components/UI/Button.vue";
import Input from "../components/UI/Input.vue";

const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const { $auth } = useNuxtApp();

const handleLogin = async () => {
  try {
    await $auth.login({ username: username.value, password: password.value });
    router.push("/admin"); // Перенаправить на защищенную страницу после успешного входа
  } catch (err) {
    error.value = "Login failed. Please check your credentials and try again.";
  }
};
</script>
<style lang="scss">
.login {
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(/img/login-bg.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &__wrapper {
    width: 98%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    border: $input-border;
    border-color: $primary-color;
    border-radius: 10px;
    padding: 60px 5px;
    backdrop-filter: blur(20px);
    @include shadow-light;
    color: $white-color;
    text-align: center;
  }
  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  &__link {
    text-decoration: none;
    color: $white-color;
    &:hover {
      text-decoration: underline;
    }
  }
  &__button {
    width: 100%;
  }
}
</style>
