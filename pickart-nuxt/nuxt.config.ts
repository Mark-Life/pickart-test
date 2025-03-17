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
      routes: ['/art', '/places']
    }
  },

  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        redirect: false,
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