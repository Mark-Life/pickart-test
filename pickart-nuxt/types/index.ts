export interface ArtPiece {
  id: string
  title: string
  artist: string
  year: number
  price: number
  description: string
  dimensions: string
  medium: string
  style: string
  published: boolean
  images: string[]
  created_at: string
  updated_at: string
}

export interface Place {
  id: string
  slug: string
  name: string
  type: 'hotel' | 'apartment' | 'gallery' | 'office'
  location: string
  description: string
  art_piece_id: string
  image: string
  created_at: string
  updated_at: string
} 