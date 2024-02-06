export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "bootstrap/dist/css/bootstrap.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
  modules: ["@nuxtjs/supabase"],
  plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
  runtimeConfig: {
    mindee: {     
      apiKey: process.env.API_MINDEE_KEY,
    },
    public: {
      img1Url: process.env.SUPABASE_RECEIPT_IMAGE1_URL,
      img2Url: process.env.SUPABASE_RECEIPT_IMAGE2_URL,
    },
  },
});
