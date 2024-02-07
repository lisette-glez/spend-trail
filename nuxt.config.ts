export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "bootstrap/dist/css/bootstrap.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
  modules: ["@nuxtjs/supabase", "@nuxt/image"],
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
      imgBaseUrl: process.env.IMGBASE_URL,
    },
  },
});
