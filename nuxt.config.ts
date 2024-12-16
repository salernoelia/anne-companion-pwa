// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@vite-pwa/nuxt"],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },

  compatibilityDate: "2024-11-30",

  vite: {
    optimizeDeps: {
      exclude: ["@electric-sql/pglite"],
    },
  },

  pwa: {
    manifest: {
      name: "anne Companion",
      short_name: "anne",
      description: "Your app description",
      theme_color: "#ffffff",
      icons: [
        {
          src: "/icons/icon-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
