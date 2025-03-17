import { createClient } from '@supabase/supabase-js'

export async function generateStaticParams() {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabase.url, config.public.supabase.key)
  
  const { data: pieces, error } = await supabase
    .from('art_pieces')
    .select('id')
    .eq('published', true)

  if (error) throw error

  return pieces.map((piece) => ({
    id: piece.id,
  }))
} 