// This file will be replaced with actual Supabase connections
// Mock database of art pieces for development

// SUPABASE INTEGRATION:
// Import the Supabase client
// import { createClient } from '@supabase/supabase-js'
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
// const supabase = createClient(supabaseUrl, supabaseKey)

// Mock art pieces data
const artPieces = [
  {
    id: "1",
    title: "Sunset Horizon",
    artist: "Emma Johnson",
    year: 2023,
    price: 2500,
    description:
      "A vibrant depiction of a sunset over the ocean, capturing the warm hues of the evening sky reflecting on the water. This piece evokes a sense of peace and contemplation.",
    dimensions: '36" × 48"',
    medium: "Oil on canvas",
    style: "Contemporary",
    published: true,
    images: [
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600&text=Detail+1",
      "/placeholder.svg?height=800&width=600&text=Detail+2",
    ],
  },
  {
    id: "2",
    title: "Urban Rhythm",
    artist: "Marcus Chen",
    year: 2022,
    price: 1800,
    description:
      "An abstract representation of city life, with geometric shapes and bold colors creating a sense of movement and energy. The piece captures the dynamic nature of urban environments.",
    dimensions: '24" × 36"',
    medium: "Acrylic on canvas",
    style: "Abstract",
    published: true,
    images: [
      "/placeholder.svg?height=800&width=600&text=Urban+Rhythm",
      "/placeholder.svg?height=800&width=600&text=Detail+1",
    ],
  },
  {
    id: "3",
    title: "Serene Forest",
    artist: "Olivia Parker",
    year: 2021,
    price: 3200,
    description:
      "A detailed landscape painting of a misty forest at dawn. The interplay of light filtering through the trees creates a magical atmosphere that invites the viewer to step into the scene.",
    dimensions: '40" × 30"',
    medium: "Oil on canvas",
    style: "Realism",
    published: true,
    images: [
      "/placeholder.svg?height=800&width=600&text=Serene+Forest",
      "/placeholder.svg?height=800&width=600&text=Detail+1",
      "/placeholder.svg?height=800&width=600&text=Detail+2",
      "/placeholder.svg?height=800&width=600&text=Detail+3",
    ],
  },
  {
    id: "4",
    title: "Fragmented Memories",
    artist: "James Wilson",
    year: 2023,
    price: 2100,
    description:
      "A mixed media piece exploring the concept of memory and how our recollections become fragmented over time. Layers of materials create depth and texture, symbolizing the complexity of human memory.",
    dimensions: '30" × 30"',
    medium: "Mixed media on wood panel",
    style: "Contemporary",
    published: true,
    images: [
      "/placeholder.svg?height=800&width=600&text=Fragmented+Memories",
      "/placeholder.svg?height=800&width=600&text=Detail+1",
    ],
  },
  {
    id: "5",
    title: "Whispers of the Sea",
    artist: "Sophia Martinez",
    year: 2022,
    price: 2800,
    description:
      "An impressionistic seascape that captures the ever-changing nature of the ocean. Textured brushstrokes create movement, giving the viewer a sense of standing by the shore.",
    dimensions: '36" × 24"',
    medium: "Oil on canvas",
    style: "Impressionism",
    published: true,
    images: [
      "/placeholder.svg?height=800&width=600&text=Whispers+of+the+Sea",
      "/placeholder.svg?height=800&width=600&text=Detail+1",
      "/placeholder.svg?height=800&width=600&text=Detail+2",
    ],
  },
  {
    id: "6",
    title: "Untitled No. 7",
    artist: "David Lee",
    year: 2023,
    price: 1500,
    description:
      "A minimalist composition exploring the relationship between form and space. The subtle color palette creates a contemplative atmosphere.",
    dimensions: '24" × 24"',
    medium: "Acrylic on canvas",
    style: "Minimalism",
    published: false, // Unpublished piece
    images: ["/placeholder.svg?height=800&width=600&text=Untitled+No.+7"],
  },
]

// Get all published art pieces
export async function getPublishedArtPieces() {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('art_pieces')
  //   .select('*')
  //   .eq('published', true)
  //
  // if (error) {
  //   console.error('Error fetching art pieces:', error)
  //   return []
  // }
  //
  // return data

  return artPieces.filter((art) => art.published)
}

// Get all art pieces (for admin)
export async function getAllArtPieces() {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('art_pieces')
  //   .select('*')
  //
  // if (error) {
  //   console.error('Error fetching all art pieces:', error)
  //   return []
  // }
  //
  // return data

  return [...artPieces] // Return a copy of the array
}

// Get all published art piece IDs for static generation
export async function getPublishedArtPieceIds() {
  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('art_pieces')
  //   .select('id')
  //   .eq('published', true)
  //
  // if (error) {
  //   console.error('Error fetching art piece IDs:', error)
  //   return []
  // }
  //
  // return data.map(item => item.id)

  const pieces = await getPublishedArtPieces()
  return pieces.map((piece) => piece.id)
}

// Get a specific art piece by ID
export async function getArtPieceById(id) {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('art_pieces')
  //   .select('*')
  //   .eq('id', id)
  //   .single()
  //
  // if (error) {
  //   console.error(`Error fetching art piece with ID ${id}:`, error)
  //   return null
  // }
  //
  // return data

  return artPieces.find((art) => art.id === id)
}

// Update art piece status (publish/unpublish)
export async function updateArtPieceStatus(id, published) {
  // SUPABASE IMPLEMENTATION:
  // const { data, error } = await supabase
  //   .from('art_pieces')
  //   .update({ published })
  //   .eq('id', id)
  //   .select()
  //   .single()
  //
  // if (error) {
  //   console.error(`Error updating art piece status with ID ${id}:`, error)
  //   throw new Error(`Failed to update art piece status: ${error.message}`)
  // }
  //
  // // After successful update, trigger revalidation
  // await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?token=${process.env.REVALIDATION_TOKEN}&path=/art/${id}`)
  // await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?token=${process.env.REVALIDATION_TOKEN}&path=/art`)
  //
  // return data

  // Mock implementation
  const artPiece = artPieces.find((art) => art.id === id)
  if (!artPiece) {
    throw new Error(`Art piece with ID ${id} not found`)
  }

  artPiece.published = published
  return artPiece
}

