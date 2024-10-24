import dotenv from "dotenv";
dotenv.config();

export default defineNuxtConfig({
    modules: ["@pinia/nuxt", "nuxt-auth-utils", "@nuxt/image"],
    devtools: { enabled: true },
    plugins: ["~/plugins/auth.js"],

    app: {
        head: {
            title: "Green EcoMarket",
            meta: [
                { charset: "utf-8" },
                { name: "description", content: "Default description" },
                {
                    hid: "og:title",
                    name: "og:title",
                    content: "Default Open Graph Title"
                }
            ]
        }
    },
    image: {
        format: ["webp", "png", "jpeg"],
        domains: ["s3.timeweb.cloud", "localhost", "media.greenwaystart.com"],
        presets: {
            default: {
                modifiers: {
                    format: "webp"
                }
            }
        }
    },
    auth: {
        enableGlobalAppMiddleware: true,
        strategies: {
            local: {
                token: {
                    property: "token",
                    required: true,
                    type: "Bearer"
                },
                user: {
                    property: "user",
                    autoFetch: true
                },
                endpoints: {
                    login: { url: "/api/auth/login", method: "post" },
                    logout: { url: "/api/auth/logout", method: "post" },
                    user: { url: "/api/auth/user", method: "get" }
                }
            }
        }
    },

    runtimeConfig: {
        MONGODB_HOST: process.env.MONGODB_HOST,
        MONGODB_PORT: process.env.MONGODB_PORT,
        MONGODB_USERNAME: process.env.MONGODB_USERNAME,
        MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
        MONGODB_DBNAME: process.env.MONGODB_DBNAME,
        private: {
            username: process.env.APP_USERNAME,
            password: process.env.APP_PASSWORD
        },
        public: {
            // В случае, если у вас есть публичные переменные
        }
    },

    css: ["~/assets/styles/main.scss"],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
            @use "~/assets/styles/_variables.scss" as *;
            @use "~/assets/styles/_mixins.scss" as *;
            @use "~/assets/styles/_functions.scss" as *;
          `
                }
            }
        }
    },

    compatibilityDate: "2024-09-23"
});
