import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "https://consultatucita.hospitalhuaycan.gob.pe";
const apiBase = process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3001";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/color-mode",
    "motion-v/nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "@peterbud/nuxt-query",
  ],

  nuxtQuery: {
    autoImports: ["useQuery", "useMutation", "useQueryClient"],
    devtools: true,
    queryClientOptions: {
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      apiBase,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "es-PE" },
      meta: [
        { name: "theme-color", content: "#f2b134" },
        {
          name: "robots",
          content: "index, follow, max-image-preview:large, max-snippet:150",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: "es",
    locales: [
      { code: "es", name: "Español", language: "es-PE", file: "es.json" },
      { code: "en", name: "English", language: "en-US", file: "en.json" },
    ],
  },

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },

  colorMode: {
    storageKey: "citas-color-mode",
    classSuffix: "",
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 0,
    },

    mode: "svg",
    class: "shrink-0",
    fetchTimeout: 2000,
    serverBundle: "local",
  },

  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },
});
