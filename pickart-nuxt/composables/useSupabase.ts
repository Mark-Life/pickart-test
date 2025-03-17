import type { ArtPiece, Place } from '~/types'

export const useSupabase = () => {
  const supabase = useSupabaseClient()

  const getArtPieces = async () => {
    try {
      const { data, error } = await supabase
        .from('art_pieces')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching art pieces:', error)
        return [] as ArtPiece[]
      }
      return data as ArtPiece[]
    } catch (error) {
      console.error('Error in getArtPieces:', error)
      return [] as ArtPiece[]
    }
  }

  const getArtPiece = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('art_pieces')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching art piece:', error)
        return null
      }
      return data as ArtPiece
    } catch (error) {
      console.error('Error in getArtPiece:', error)
      return null
    }
  }

  const getPlaces = async () => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching places:', error)
        return [] as Place[]
      }
      return data as Place[]
    } catch (error) {
      console.error('Error in getPlaces:', error)
      return [] as Place[]
    }
  }

  const getPlace = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching place:', error)
        return null
      }
      return data as Place
    } catch (error) {
      console.error('Error in getPlace:', error)
      return null
    }
  }

  return {
    getArtPieces,
    getArtPiece,
    getPlaces,
    getPlace
  }
} 