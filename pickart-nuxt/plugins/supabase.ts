export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // Check if Supabase environment variables are set
  if (!config.public.supabase.url || !config.public.supabase.key) {
    console.error('Supabase configuration is missing')
    throw createError({
      statusCode: 500,
      message: 'Supabase configuration is missing. Please check environment variables.',
    })
  }
}) 