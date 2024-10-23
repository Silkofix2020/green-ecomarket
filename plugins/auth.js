import { defineNuxtPlugin } from "#app";
import { ref } from "vue";
import { useCookie } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const user = ref(null);

  const login = async ({ username, password }) => {
    try {
      const data = await $fetch("/api/auth/login", {
        method: "POST",
        body: { username, password },
      });
      console.log("Server response:", data);
      if (data && data.user) {
        user.value = data.user;
      } else {
        throw new Error("Invalid server response");
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    user.value = null;
  };

  const fetchUser = async () => {
    try {
      const data = await $fetch("/api/auth/user", {
        method: "GET",
      });
      user.value = data.user;
    } catch (error) {
      user.value = null;
    }
  };

  const isAuthenticated = () => {
    return !!user.value || !!useCookie("token").value;
  };

  nuxtApp.provide("auth", {
    user,
    login,
    logout,
    fetchUser,
    isAuthenticated,
  });

  fetchUser(); // Fetch user on plugin initialization if token is present
});
