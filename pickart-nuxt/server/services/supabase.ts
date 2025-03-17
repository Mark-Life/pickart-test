import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabase.url,
    config.public.supabase.key
  )
  
  return supabase
}) 