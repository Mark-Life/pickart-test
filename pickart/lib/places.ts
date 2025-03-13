// Mock data for places (hotels, apartments, etc.)
export type Place = {
  id: string
  slug: string
  name: string
  type: "hotel" | "apartment" | "gallery" | "office"
  location: string
  description: string
  artPieceId: string | null // ID of the assigned art piece, null if none
  image: string
}

// Mock places data
const places: Place[] = [
  {
    id: "1",
    slug: "grand-hotel",
    name: "The Grand Hotel",
    type: "hotel",
    location: "New York, NY",
    description: "A luxury hotel in the heart of Manhattan featuring curated art in every room.",
    artPieceId: "1", // Assigned to "Sunset Horizon"
    image: "/placeholder.svg?height=600&width=800&text=Grand+Hotel",
  },
  {
    id: "2",
    slug: "skyline-apartments",
    name: "Skyline Apartments",
    type: "apartment",
    location: "Chicago, IL",
    description: "Modern apartments with stunning views of the Chicago skyline.",
    artPieceId: "3", // Assigned to "Serene Forest"
    image: "/placeholder.svg?height=600&width=800&text=Skyline+Apartments",
  },
  {
    id: "3",
    slug: "riverside-gallery",
    name: "Riverside Gallery",
    type: "gallery",
    location: "Portland, OR",
    description: "A contemporary art gallery showcasing local and international artists.",
    artPieceId: "2", // Assigned to "Urban Rhythm"
    image: "/placeholder.svg?height=600&width=800&text=Riverside+Gallery",
  },
  {
    id: "4",
    slug: "ocean-view-resort",
    name: "Ocean View Resort",
    type: "hotel",
    location: "Miami, FL",
    description: "A beachfront resort with art-inspired interiors and ocean views.",
    artPieceId: null, // No art piece assigned yet
    image: "/placeholder.svg?height=600&width=800&text=Ocean+View+Resort",
  },
  {
    id: "5",
    slug: "tech-hub-offices",
    name: "Tech Hub Offices",
    type: "office",
    location: "San Francisco, CA",
    description: "Modern office spaces for tech startups with art installations.",
    artPieceId: "5", // Assigned to "Whispers of the Sea"
    image: "/placeholder.svg?height=600&width=800&text=Tech+Hub+Offices",
  },
]

// Get all places
export async function getAllPlaces(): Promise<Place[]> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('places')
  //   .select('*')
  //
  // if (error) {
  //   console.error('Error fetching places:', error)
  //   return []
  // }
  //
  // return data

  return [...places] // Return a copy of the array
}

// Get a place by slug
export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('places')
  //   .select('*')
  //   .eq('slug', slug)
  //   .single()
  //
  // if (error) {
  //   console.error(`Error fetching place with slug ${slug}:`, error)
  //   return null
  // }
  //
  // return data

  return places.find((place) => place.slug === slug) || null
}

// Assign an art piece to a place
export async function assignArtPieceToPlace(placeId: string, artPieceId: string | null): Promise<Place | null> {
  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('places')
  //   .update({ artPieceId })
  //   .eq('id', placeId)
  //   .select()
  //   .single()
  //
  // if (error) {
  //   console.error(`Error assigning art piece to place with ID ${placeId}:`, error)
  //   throw new Error(`Failed to assign art piece: ${error.message}`)
  // }
  //
  // return data

  // Mock implementation
  const place = places.find((p) => p.id === placeId)
  if (!place) {
    throw new Error(`Place with ID ${placeId} not found`)
  }

  place.artPieceId = artPieceId
  return place
}

// Get all places with their assigned art pieces
export async function getPlacesWithArtPieces() {
  const allPlaces = await getAllPlaces()

  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('places')
  //   .select(`
  //     *,
  //     art_pieces:artPieceId (
  //       id, title, artist, images
  //     )
  //   `)
  //
  // if (error) {
  //   console.error('Error fetching places with art pieces:', error)
  //   return []
  // }
  //
  // return data

  // For our mock implementation, we'll manually join the data
  const { getArtPieceById } = await import("./art")

  // Use Promise.all to fetch all art pieces in parallel
  const placesWithArt = await Promise.all(
    allPlaces.map(async (place) => {
      if (place.artPieceId) {
        const artPiece = await getArtPieceById(place.artPieceId)
        return {
          ...place,
          artPiece: artPiece || null,
        }
      }
      return {
        ...place,
        artPiece: null,
      }
    }),
  )

  return placesWithArt
}

