export default defineNuxtConfig({
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
      apiBaseDriver: process.env.API_MINDEE_DRIVER_URL,
      apiBasePassport: process.env.API_MINDEE_PASSPORT_URL,
      apiKey: process.env.API_MINDEE_KEY,
    },
  },
});
