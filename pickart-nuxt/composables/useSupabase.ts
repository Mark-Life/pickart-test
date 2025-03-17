import type { ArtPiece, Place } from '~/types'

export const useSupabase = () => {
  const supabase = useSupabaseClient()

  const getArtPieces = async () => {
    const { data, error } = await supabase
      .from('art_pieces')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as ArtPiece[]
  }

  const getArtPiece = async (id: string) => {
    const { data, error } = await supabase
      .from('art_pieces')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as ArtPiece
  }

  const getPlaces = async () => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Place[]
  }

  const getPlace = async (slug: string) => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Place
  }

  return {
    getArtPieces,
    getArtPiece,
    getPlaces,
    getPlace
  }
} 