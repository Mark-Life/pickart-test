export default defineEventHandler((event) => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  // Check if Supabase environment variables are set
  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      message: 'Supabase configuration is missing'
    })
  }

  return {
    status: 'healthy',
    timestamp: new Date().toISOString()
  }
}) 