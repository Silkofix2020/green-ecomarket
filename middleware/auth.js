export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $auth } = useNuxtApp();

  if (!import.meta.env.SSR) {
    if (!$auth.isAuthenticated() && to.path.startsWith("/admin")) {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Задержка 3 секунды перед переадресацией
      return navigateTo("/login");
    }
  }
});
