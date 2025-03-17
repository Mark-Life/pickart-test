import { createClient } from '@supabase/supabase-js'

export async function generateStaticParams() {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabase.url, config.public.supabase.key)
  
  const { data: places, error } = await supabase
    .from('places')
    .select('slug')

  if (error) throw error

  return places.map((place) => ({
    slug: place.slug,
  }))
} 