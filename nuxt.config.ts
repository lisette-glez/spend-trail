export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_vars.scss" as *;',
        },
      },
    },
  },
  css: ["@/assets/scss/main.scss", "bootstrap-icons/font/bootstrap-icons.css"],
  modules: ["@nuxtjs/supabase", "@nuxt/image", "@nuxtjs/color-mode"],
  plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
  image: {
    providers: {
      myProvider: {
        name: "myProvider",
        provider: "~/providers/my-provider.ts",
      },
    },
  },
  runtimeConfig: {
    mindee: {
      apiKey: process.env.API_MINDEE_KEY,
    },
    public: {
      receiptImgUrl: process.env.DEMO_RECEIPT_IMAGE_URL,
      invoiceImgUrl: process.env.DEMO_INVOICE_IMAGE_URL,
    },
  },
});
