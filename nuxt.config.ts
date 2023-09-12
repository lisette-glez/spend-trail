export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "bootstrap/dist/css/bootstrap.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
  plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_OCR_URL,
      apiKey: process.env.API_OCR_KEY,
    },
  },
});
