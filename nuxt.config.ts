export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["bootstrap/dist/css/bootstrap.css"],
  plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
});
