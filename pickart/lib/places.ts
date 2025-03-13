import { db } from "./db"
import { places } from "./db/schema"
import { eq } from "drizzle-orm"
import { getArtPieceById } from "./art"

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
  createdAt: Date
  updatedAt: Date
}

// Mock places data
const placesData: Place[] = [
  {
    id: "1",
    slug: "grand-hotel",
    name: "The Grand Hotel",
    type: "hotel",
    location: "New York, NY",
    description: "A luxury hotel in the heart of Manhattan featuring curated art in every room.",
    artPieceId: "1", // Assigned to "Sunset Horizon"
    image: "/placeholder.svg?height=600&width=800&text=Grand+Hotel",
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Get all places
export async function getAllPlaces(): Promise<Place[]> {
  const result = await db.select().from(places)
  return result
}

// Get a place by slug
export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const result = await db.select().from(places).where(eq(places.slug, slug))
  return result[0] || null
}

// Assign an art piece to a place
export async function assignArtPieceToPlace(placeId: string, artPieceId: string | null): Promise<Place | null> {
  const result = await db
    .update(places)
    .set({ artPieceId, updatedAt: new Date() })
    .where(eq(places.id, placeId))
    .returning()
  
  if (!result[0]) {
    throw new Error(`Place with ID ${placeId} not found`)
  }

  return result[0]
}

// Get all places with their assigned art pieces
export async function getPlacesWithArtPieces() {
  const allPlaces = await getAllPlaces()

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

