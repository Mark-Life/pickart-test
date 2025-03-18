import { db } from "./db"
import { properties, spots, propertyTypes, countries, propertyPhotos, spotPhotos } from "./db/schema"
import { eq, and, asc, or } from "drizzle-orm"
import { getArtPieceById } from "./art"
import { createClient } from '@supabase/supabase-js'

// Supabase client setup - only initialize if environment variables are available
let supabase: any = null;
let supabaseUrl: string | undefined;

try {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized in places.ts');
  } else {
    console.warn('Supabase environment variables missing in places.ts, using fallback mode');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client in places.ts:', error);
}

// Helper to create storage URLs
function getStorageUrl(folderPath: string, storagePath: string): string {
  if (!storagePath) {
    return '/placeholder.svg';
  }
  
  try {
    if (supabaseUrl && supabase) {
      // Ensure folder path doesn't have leading/trailing slashes
      const normalizedFolder = folderPath.replace(/^\/|\/$/g, '');
      
      // Ensure storage path doesn't have leading slashes
      const normalizedStorage = storagePath.replace(/^\//, '');
      
      return `${supabaseUrl}/storage/v1/object/public/pickart/${normalizedFolder}/${normalizedStorage}`;
    }
  } catch (error) {
    console.warn('Error creating storage URL:', error);
  }
  
  // Fallback to placeholder if Supabase not configured or error occurs
  return `/placeholder.svg?text=${encodeURIComponent(storagePath.split('/').pop() || 'image')}`;
}

// Property/Place type with necessary fields for display
export type Place = {
  id: string
  slug: string // We'll use propertyId as slug
  name: string
  type: string // From propertyType
  location: string // Composed from city, state, country
  description: string // Using position_description or general property info
  artPieceId: string | null // ID of the assigned artwork, null if none
  image: string // Main property/spot photo
  createdAt: Date
  updatedAt: Date
}

// Get all places (properties with their spots)
export async function getAllPlaces(): Promise<Place[]> {
  const allProperties = await db
    .select({
      id: properties.id,
      propertyId: properties.propertyId,
      propertyName: properties.propertyName,
      propertyType: properties.propertyType,
      city: properties.city,
      state: properties.state,
      countryCode: properties.countryCode,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
    })
    .from(properties)
    .orderBy(asc(properties.propertyName))

  // For each property, get country name and first property photo
  const placesWithDetails = await Promise.all(
    allProperties.map(async (property) => {
      // Get country name
      const countryResult = await db
        .select({ name: countries.name })
        .from(countries)
        .where(eq(countries.code, property.countryCode))
        .limit(1)
      
      const countryName = countryResult[0]?.name || property.countryCode

      // Get property photo
      const photoResult = await db
        .select({
          storagePath: propertyPhotos.storagePath,
          folderPath: propertyPhotos.folderPath,
        })
        .from(propertyPhotos)
        .where(eq(propertyPhotos.propertyId, property.id))
        .limit(1)
      
      let imageUrl = '/placeholder.svg'
      if (photoResult.length > 0) {
        imageUrl = getStorageUrl(photoResult[0].folderPath, photoResult[0].storagePath);
      }

      // Get spots with artworks for this property
      const spotsResult = await db
        .select({
          id: spots.id,
          currentArtworkId: spots.currentArtworkId,
          roomName: spots.roomName,
          positionDescription: spots.positionDescription,
        })
        .from(spots)
        .where(eq(spots.propertyId, property.id))
        .orderBy(asc(spots.id))
      
      // Find first spot with artwork
      const spotWithArtwork = spotsResult.find(spot => spot.currentArtworkId !== null)
      
      return {
        id: property.id,
        slug: property.propertyId.toLowerCase(),
        name: property.propertyName,
        type: property.propertyType,
        location: `${property.city}, ${property.state}, ${countryName}`,
        description: `A ${property.propertyType} located in ${property.city}`,
        artPieceId: spotWithArtwork?.currentArtworkId || null,
        image: imageUrl,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      }
    })
  )

  return placesWithDetails
}

// Get a place by slug (propertyId)
export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  // slugs are lowercase propertyIds
  const propertyResult = await db
    .select({
      id: properties.id,
      propertyId: properties.propertyId,
      propertyName: properties.propertyName,
      propertyType: properties.propertyType,
      city: properties.city,
      state: properties.state,
      countryCode: properties.countryCode,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
    })
    .from(properties)
    .where(eq(properties.propertyId, slug.toUpperCase()))
    .limit(1)
  
  if (propertyResult.length === 0) {
    return null
  }

  const property = propertyResult[0]

  // Get country name
  const countryResult = await db
    .select({ name: countries.name })
    .from(countries)
    .where(eq(countries.code, property.countryCode))
    .limit(1)
  
  const countryName = countryResult[0]?.name || property.countryCode

  // Get property photo
  const photoResult = await db
    .select({
      storagePath: propertyPhotos.storagePath,
      folderPath: propertyPhotos.folderPath,
    })
    .from(propertyPhotos)
    .where(eq(propertyPhotos.propertyId, property.id))
    .limit(1)
  
  let imageUrl = '/placeholder.svg'
  if (photoResult.length > 0) {
    imageUrl = getStorageUrl(photoResult[0].folderPath, photoResult[0].storagePath);
  }

  // Get spots with artworks for this property
  const spotsResult = await db
    .select({
      id: spots.id,
      currentArtworkId: spots.currentArtworkId,
      roomName: spots.roomName,
      positionDescription: spots.positionDescription,
    })
    .from(spots)
    .where(eq(spots.propertyId, property.id))
    .orderBy(asc(spots.id))
  
  // Find first spot with artwork
  const spotWithArtwork = spotsResult.find(spot => spot.currentArtworkId !== null)
  
  return {
    id: property.id,
    slug: property.propertyId.toLowerCase(),
    name: property.propertyName,
    type: property.propertyType,
    location: `${property.city}, ${property.state}, ${countryName}`,
    description: `A ${property.propertyType} located in ${property.city}`,
    artPieceId: spotWithArtwork?.currentArtworkId || null,
    image: imageUrl,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  }
}

// Get places with their assigned art pieces
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

// Helper function to find a specific spot
export async function getSpot(spotId: string) {
  const result = await db
    .select()
    .from(spots)
    .where(eq(spots.id, spotId))
    .limit(1)
  
  return result[0] || null
}

// Assign an art piece to a place (spot)
export async function assignArtPieceToPlace(placeId: string, artPieceId: string | null, spotId?: string): Promise<Place | null> {
  // If no specific spotId is provided, find the first available spot in the place
  if (!spotId) {
    const spotsResult = await db
      .select({
        id: spots.id,
      })
      .from(spots)
      .where(eq(spots.propertyId, placeId))
      .orderBy(asc(spots.id))
      .limit(1)
    
    if (spotsResult.length === 0) {
      throw new Error(`No spots found for place with ID ${placeId}`)
    }
    
    spotId = spotsResult[0].id
  }
  
  // Update the spot with the artwork ID
  const result = await db
    .update(spots)
    .set({ 
      currentArtworkId: artPieceId,
      status: artPieceId ? 'allocated' : 'ready_for_allocation',
      updatedAt: new Date()
    })
    .where(eq(spots.id, spotId))
    .returning()
  
  if (result.length === 0) {
    throw new Error(`Spot with ID ${spotId} not found`)
  }

  // Get the place details after update
  const property = await db
    .select({
      id: properties.id,
      propertyId: properties.propertyId,
    })
    .from(properties)
    .innerJoin(spots, eq(properties.id, spots.propertyId))
    .where(eq(spots.id, spotId))
    .limit(1)
  
  if (property.length === 0) {
    throw new Error(`Property for spot with ID ${spotId} not found`)
  }
  
  return getPlaceBySlug(property[0].propertyId.toLowerCase())
}

