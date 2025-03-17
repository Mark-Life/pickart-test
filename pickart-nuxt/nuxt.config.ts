// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
  ],

  nitro: {
    prerender: {
      routes: ['/art', '/places'],
      crawlLinks: true,
      failOnError: false
    },
    routeRules: {
      '/**': { cors: true }
    }
  },

  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || '',
        redirect: false,
      }
    }
  },

  // Add app hooks to validate environment variables
  hooks: {
    'app:created': () => {
      const { url, key } = useRuntimeConfig().public.supabase
      if (!url || !key) {
        throw new Error(
          'Supabase environment variables are missing. Please set SUPABASE_URL and SUPABASE_KEY in your environment.'
        )
      }
    }
  },

  app: {
    head: {
      title: 'PickArt | Discover and Purchase Unique Art',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'PickArt is a platform for discovering and purchasing unique art pieces from talented artists around the world.' }
      ]
    }
  },

  compatibilityDate: '2025-03-17'
})