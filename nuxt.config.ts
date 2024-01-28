export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: [
    "bootstrap/dist/css/bootstrap.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
  modules: ["@nuxtjs/supabase"],
  plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
  runtimeConfig: {
    public: {
      apiBaseInvoice: process.env.API_MINDEE_INVOICE_URL,
      apiBaseReceipt: process.env.API_MINDEE_RECEIPT_URL,
      apiBasePassport: process.env.API_MINDEE_PASSPORT_URL,
      apiKey: process.env.API_MINDEE_KEY,
      img1Url: process.env.SUPABASE_RECEIPT_IMAGE1_URL,
      img2Url: process.env.SUPABASE_RECEIPT_IMAGE2_URL,
      img4Url: process.env.SUPABASE_RECEIPT_IMAGE4_URL,
    },
  },
});
