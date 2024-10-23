import { defineEventHandler, readBody, createError, setCookie } from "h3";
import { useRuntimeConfig } from "#imports";
import { randomBytes } from "crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;
  const config = useRuntimeConfig();

  const validUsername = config.private.username;
  const validPassword = config.private.password;

  if (username === validUsername && password === validPassword) {
    const token = randomBytes(64).toString("hex");
    const maxAge = 60 * 60 * 24 * 7; // время в секундах 60 (секунды) * 60 (минуты) * 24 (часы) * 7 (дни)
    setCookie(event, "token", token, { httpOnly: true, maxAge });
    return { token, user: { username } }; // Возвращаем объект с полями token и user
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }
});
