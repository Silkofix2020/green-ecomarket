import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");

  if (!token) {
    return {
      user: null,
    };
  }

  return {
    user: {
      username: "admin", // Это можно заменить на реальную логику получения пользователя
    },
  };
});
