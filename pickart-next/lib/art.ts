// This file will be replaced with actual Supabase connections
// Mock database of art pieces for development

// Import for Supabase client
import { createClient } from '@supabase/supabase-js'
import { db } from "./db"
import { artworks, artworkPhotos, artists, users } from "./db/schema"
import { eq, and, SQL, asc } from "drizzle-orm"

// Type for artwork with all necessary fields for display
export type ArtworkWithDetails = {
  id: string
  artworkId: string
  title: string
  artist: string // Display name from artists table
  year: number
  price: number
  description: string | null
  dimensions: string // Composed from width, height, depth
  medium: string
  style: string | null
  published: boolean // Derived from status being 'live'
  images: string[] // URLs from artwork_photos
  createdAt: Date
  updatedAt: Date
}

// Supabase client setup - only initialize if environment variables are available
let supabase: any = null;
let supabaseUrl: string | undefined;

try {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase environment variables missing, using fallback mode');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
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

// Get all published art pieces (status = 'live')
export async function getPublishedArtPieces(): Promise<ArtworkWithDetails[]> {
  const result = await db
    .select({
      id: artworks.id,
      artworkId: artworks.artworkId,
      title: artworks.title,
      artistId: artworks.artistId,
      year: artworks.year,
      description: artworks.description,
      medium: artworks.medium,
      style: artworks.style,
      widthCm: artworks.widthCm,
      heightCm: artworks.heightCm,
      depthCm: artworks.depthCm,
      price: artworks.price,
      status: artworks.status,
      createdAt: artworks.createdAt,
      updatedAt: artworks.updatedAt,
    })
    .from(artworks)
    .where(eq(artworks.status, 'live'))
    .orderBy(asc(artworks.createdAt))

  // Fetch additional details for each artwork
  const enrichedResults = await Promise.all(
    result.map(async (artwork) => {
      // Get artist display name
      const artist = await db
        .select({
          displayName: artists.displayName,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(artists)
        .innerJoin(users, eq(artists.id, users.id))
        .where(eq(artists.id, artwork.artistId))
        .limit(1)

      // Get artwork images
      const photos = await db
        .select({
          storagePath: artworkPhotos.storagePath,
          folderPath: artworkPhotos.folderPath,
          isPrimary: artworkPhotos.isPrimary,
        })
        .from(artworkPhotos)
        .where(eq(artworkPhotos.artworkId, artwork.id))
        .orderBy(asc(artworkPhotos.isPrimary))

      // Create image URLs
      const imageUrls = photos.map(photo => 
        getStorageUrl(photo.folderPath, photo.storagePath)
      )

      // Create dimensions string
      const dimensions = `${artwork.widthCm} × ${artwork.heightCm}${artwork.depthCm ? ' × ' + artwork.depthCm : ''} cm`

      return {
        id: artwork.id,
        artworkId: artwork.artworkId,
        title: artwork.title,
        artist: artist[0]?.displayName || `${artist[0]?.firstName} ${artist[0]?.lastName}` || 'Unknown Artist',
        year: artwork.year,
        price: Number(artwork.price),
        description: artwork.description,
        dimensions,
        medium: artwork.medium,
        style: artwork.style,
        published: artwork.status === 'live',
        images: imageUrls.length > 0 ? imageUrls : ['/placeholder.svg'],
        createdAt: artwork.createdAt,
        updatedAt: artwork.updatedAt,
      }
    })
  )

  return enrichedResults
}

// Get all art pieces (for admin)
export async function getAllArtPieces(): Promise<ArtworkWithDetails[]> {
  const result = await db
    .select({
      id: artworks.id,
      artworkId: artworks.artworkId,
      title: artworks.title,
      artistId: artworks.artistId,
      year: artworks.year,
      description: artworks.description,
      medium: artworks.medium,
      style: artworks.style,
      widthCm: artworks.widthCm,
      heightCm: artworks.heightCm,
      depthCm: artworks.depthCm,
      price: artworks.price,
      status: artworks.status,
      createdAt: artworks.createdAt,
      updatedAt: artworks.updatedAt,
    })
    .from(artworks)
    .orderBy(asc(artworks.createdAt))

  // Reuse the same enrichment logic as getPublishedArtPieces
  const enrichedResults = await Promise.all(
    result.map(async (artwork) => {
      // Get artist display name
      const artist = await db
        .select({
          displayName: artists.displayName,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(artists)
        .innerJoin(users, eq(artists.id, users.id))
        .where(eq(artists.id, artwork.artistId))
        .limit(1)

      // Get artwork images
      const photos = await db
        .select({
          storagePath: artworkPhotos.storagePath,
          folderPath: artworkPhotos.folderPath,
          isPrimary: artworkPhotos.isPrimary,
        })
        .from(artworkPhotos)
        .where(eq(artworkPhotos.artworkId, artwork.id))
        .orderBy(asc(artworkPhotos.isPrimary))

      // Create image URLs
      const imageUrls = photos.map(photo => 
        getStorageUrl(photo.folderPath, photo.storagePath)
      )

      // Create dimensions string
      const dimensions = `${artwork.widthCm} × ${artwork.heightCm}${artwork.depthCm ? ' × ' + artwork.depthCm : ''} cm`

      return {
        id: artwork.id,
        artworkId: artwork.artworkId,
        title: artwork.title,
        artist: artist[0]?.displayName || `${artist[0]?.firstName} ${artist[0]?.lastName}` || 'Unknown Artist',
        year: artwork.year,
        price: Number(artwork.price),
        description: artwork.description,
        dimensions,
        medium: artwork.medium,
        style: artwork.style,
        published: artwork.status === 'live',
        images: imageUrls.length > 0 ? imageUrls : ['/placeholder.svg'],
        createdAt: artwork.createdAt,
        updatedAt: artwork.updatedAt,
      }
    })
  )

  return enrichedResults
}

// Get all published art piece IDs for static generation
export async function getPublishedArtPieceIds(): Promise<string[]> {
  const result = await db
    .select({ artworkId: artworks.artworkId })
    .from(artworks)
    .where(eq(artworks.status, 'live'))

  return result.map((item) => item.artworkId)
}

// Get a specific art piece by ID
export async function getArtPieceById(artworkId: string): Promise<ArtworkWithDetails | null> {
  const result = await db
    .select({
      id: artworks.id,
      artworkId: artworks.artworkId,
      title: artworks.title,
      artistId: artworks.artistId,
      year: artworks.year,
      description: artworks.description,
      medium: artworks.medium,
      style: artworks.style,
      widthCm: artworks.widthCm,
      heightCm: artworks.heightCm,
      depthCm: artworks.depthCm,
      price: artworks.price,
      status: artworks.status,
      createdAt: artworks.createdAt,
      updatedAt: artworks.updatedAt,
    })
    .from(artworks)
    .where(eq(artworks.artworkId, artworkId))
    .limit(1)
  
  if (result.length === 0) {
    return null
  }

  const artwork = result[0]

  // Get artist display name
  const artist = await db
    .select({
      displayName: artists.displayName,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(artists)
    .innerJoin(users, eq(artists.id, users.id))
    .where(eq(artists.id, artwork.artistId))
    .limit(1)

  // Get artwork images
  const photos = await db
    .select({
      storagePath: artworkPhotos.storagePath,
      folderPath: artworkPhotos.folderPath,
      isPrimary: artworkPhotos.isPrimary,
    })
    .from(artworkPhotos)
    .where(eq(artworkPhotos.artworkId, artwork.id))
    .orderBy(asc(artworkPhotos.isPrimary))

  // Create image URLs
  const imageUrls = photos.map(photo => 
    getStorageUrl(photo.folderPath, photo.storagePath)
  )

  // Create dimensions string
  const dimensions = `${artwork.widthCm} × ${artwork.heightCm}${artwork.depthCm ? ' × ' + artwork.depthCm : ''} cm`

  return {
    id: artwork.id,
    artworkId: artwork.artworkId,
    title: artwork.title,
    artist: artist[0]?.displayName || `${artist[0]?.firstName} ${artist[0]?.lastName}` || 'Unknown Artist',
    year: artwork.year,
    price: Number(artwork.price),
    description: artwork.description,
    dimensions,
    medium: artwork.medium,
    style: artwork.style,
    published: artwork.status === 'live',
    images: imageUrls.length > 0 ? imageUrls : ['/placeholder.svg'],
    createdAt: artwork.createdAt,
    updatedAt: artwork.updatedAt,
  }
}

// Update art piece status (publish/unpublish)
export async function updateArtPieceStatus(artworkId: string, published: boolean): Promise<ArtworkWithDetails | null> {
  const status = published ? 'live' : 'draft'
  
  const result = await db
    .update(artworks)
    .set({ status, updatedAt: new Date() })
    .where(eq(artworks.artworkId, artworkId))
    .returning()
  
  if (result.length === 0) {
    throw new Error(`Art piece with ID ${artworkId} not found`)
  }

  // Trigger revalidation
  try {
    if (process.env.VERCEL_BRANCH_URL && process.env.REVALIDATION_TOKEN) {
      await fetch(`${process.env.VERCEL_BRANCH_URL}/api/revalidate?token=${process.env.REVALIDATION_TOKEN}&path=/art/${artworkId}`)
      await fetch(`${process.env.VERCEL_BRANCH_URL}/api/revalidate?token=${process.env.REVALIDATION_TOKEN}&path=/art`)
    } else {
      console.warn('Revalidation skipped: VERCEL_BRANCH_URL or REVALIDATION_TOKEN not set')
    }
  } catch (error) {
    console.error('Failed to trigger revalidation:', error)
  }

  // Return updated artwork with details
  return getArtPieceById(artworkId)
}

