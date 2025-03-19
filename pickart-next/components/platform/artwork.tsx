import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ArtworkStatusBadge } from "@/components/artwork-status-badge"
import { getUserRole, UserRole } from "@/lib/auth/roles"
import { createAdminClient } from "@/lib/supabase/admin"
import { User } from "@supabase/supabase-js"

// Import and use the ArtworkStatus type from the badge component
import type { ArtworkStatus as BadgeArtworkStatus } from "@/components/artwork-status-badge"

// This type matches the database enum
type DBArtworkStatus = 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'delivered' | 'live' | 'sold'

// Helper function to convert DB status to badge status
function mapStatusToBadgeStatus(status: DBArtworkStatus): BadgeArtworkStatus {
  switch (status) {
    case 'draft': return 'DRAFT'
    case 'pending_approval': return 'PENDING'
    case 'ready_for_allocation': return 'READY'
    case 'allocated': return 'ALLOCATED'
    case 'delivered': return 'DELIVERED'
    case 'live': return 'LIVE'
    case 'sold': return 'LIVE' // Map sold to LIVE for badge display
    default: return 'DRAFT'
  }
}

interface Artwork {
  id: string
  artwork_id: string
  title: string
  artist_id: string
  artist_name?: string
  price: number
  status: DBArtworkStatus
  image_url?: string
}

// Fetch artworks based on user role
async function getArtworks(user: User, role: UserRole, approved: boolean): Promise<Artwork[]> {
  // If not approved or unknown role, return empty array
  if (!approved || role === 'unknown') {
    return []
  }

  const supabase = createAdminClient()
  
  // If admin, fetch all artworks
  if (role === 'admin') {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        id, 
        artwork_id, 
        title, 
        price, 
        status, 
        artist_id,
        artists!inner(display_name)
      `)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching artworks:', error)
      return []
    }

    return data.map(item => ({
      id: item.id,
      artwork_id: item.artwork_id,
      title: item.title,
      artist_id: item.artist_id,
      artist_name: item.artists?.display_name?.[0] || 'Unknown Artist',
      price: item.price,
      status: item.status as DBArtworkStatus,
      // Get image_url from a separate query or join if needed
    }))
  }
  
  // If artist, fetch only their artworks
  if (role === 'artist') {
    // First get the artist record for this user
    const { data: artistData, error: artistError } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single()
    
    if (artistError || !artistData) {
      console.error('Error fetching artist:', artistError)
      return []
    }
    
    const artistId = artistData.id
    
    // Now fetch artworks for this artist
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        id, 
        artwork_id, 
        title, 
        price, 
        status, 
        artist_id,
        artists!inner(display_name)
      `)
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false })
    
    if (error || !data) {
      console.error('Error fetching artworks for artist:', error)
      return []
    }
    
    return data.map(item => ({
      id: item.id,
      artwork_id: item.artwork_id,
      title: item.title,
      artist_id: item.artist_id,
      artist_name: item.artists?.display_name?.[0] || 'Unknown Artist',
      price: item.price,
      status: item.status as DBArtworkStatus,
      // Get image_url from a separate query or join if needed
    }))
  }
  
  // For hosts or other roles, return empty array
  return []
}

// Get artwork images
async function getArtworkImages(artworkIds: string[]): Promise<Record<string, string>> {
  if (artworkIds.length === 0) return {}
  
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('artwork_photos')
    .select('artwork_id, storage_path, folder_path, is_primary')
    .in('artwork_id', artworkIds)
    .eq('is_primary', true)
  
  if (error || !data) {
    console.error('Error fetching artwork images:', error)
    return {}
  }
  
  const imageMap: Record<string, string> = {}
  
  for (const photo of data) {
    // Using the storage URL helper function if available, or construct URL directly
    imageMap[photo.artwork_id] = `/storage/${photo.folder_path}/${photo.storage_path}`
  }
  
  return imageMap
}

export default async function ArtworksPage({ user }: { user: User }) {
  // Get user role
  const userWithRole = await getUserRole(user)
  const { role, approved } = userWithRole

  // Only proceed if user is an admin or artist and is approved
  const canViewArtworks = (role === 'admin' || role === 'artist') && approved
  
  if (!canViewArtworks) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Restricted</h2>
        <p className="text-yellow-700">
          You don't have permission to view artwork management. 
          {role === 'unknown' && " Your account doesn't have a role assigned."}
          {!approved && " Your account is pending approval."}
        </p>
      </div>
    )
  }

  // Fetch artworks for this user based on their role
  const artworks = await getArtworks(user, role, approved)
  
  // Get images for artworks
  const artworkIds = artworks.map(a => a.id)
  const artworkImages = await getArtworkImages(artworkIds)
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {role === 'artist' && (
          <Button asChild>
            <Link href="/platform/artworks/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Artwork
            </Link>
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Artwork Management</CardTitle>
          <CardDescription>
            {role === 'admin' 
              ? 'Add, edit, and manage artworks. Approve submissions and allocate to spots.'
              : 'Upload, edit, and manage your artworks.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search artworks..." className="pl-8" />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" className="md:w-auto">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Artworks</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="ready">Ready for Allocation</TabsTrigger>
              <TabsTrigger value="allocated">Allocated</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {artworks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No artworks found. {role === 'artist' && "Click 'Add New Artwork' to get started."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-left font-medium">Image</th>
                          <th className="py-3 px-4 text-left font-medium">ID</th>
                          <th className="py-3 px-4 text-left font-medium">Title</th>
                          {role === 'admin' && <th className="py-3 px-4 text-left font-medium">Artist</th>}
                          <th className="py-3 px-4 text-left font-medium">Price</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artworks.map((artwork) => (
                          <tr key={artwork.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="relative h-12 w-12 rounded overflow-hidden">
                                <Image
                                  src={artworkImages[artwork.id] || "/placeholder.svg"}
                                  alt={artwork.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">{artwork.artwork_id}</td>
                            <td className="py-3 px-4 font-medium">{artwork.title}</td>
                            {role === 'admin' && <td className="py-3 px-4">{artwork.artist_name}</td>}
                            <td className="py-3 px-4">${artwork.price.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <ArtworkStatusBadge status={mapStatusToBadgeStatus(artwork.status)} />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/platform/artworks/${artwork.id}`}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </Link>
                                {role === 'admin' && (
                                  <Link
                                    href={`/platform/artworks/${artwork.id}/allocate`}
                                    className="text-xs text-green-600 hover:text-green-800"
                                  >
                                    Allocate
                                  </Link>
                                )}
                                <Link
                                  href={`/art/${artwork.id}`}
                                  className="text-xs text-gray-600 hover:text-gray-800"
                                  target="_blank"
                                >
                                  View
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Other tab contents would be similar but filtered */}
            <TabsContent value="draft" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only draft artworks</div>
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only pending approval artworks</div>
            </TabsContent>
            <TabsContent value="ready" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only ready for allocation artworks</div>
            </TabsContent>
            <TabsContent value="allocated" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only allocated artworks</div>
            </TabsContent>
            <TabsContent value="live" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only live artworks</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}