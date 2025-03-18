import Link from "next/link"
import Image from "next/image"
import { getAllArtPieces } from "@/lib/art"
import { getAllPlaces } from "@/lib/places"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search, ArrowUpDown, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Manage Allocations | PickArt Admin",
  description: "Manage artwork allocations to spots in the PickArt platform",
}

export default async function AllocationsPage() {
  const artworks = await getAllArtPieces()
  const places = await getAllPlaces()

  // Generate mock allocations data
  const allocations = places
    .filter((place) => place.artPieceId) // Only places with art assigned
    .map((place) => {
      const artwork = artworks.find((art) => art.id === place.artPieceId)

      // Mock allocation data
      return {
        id: `alloc-${place.id}-${place.artPieceId}`,
        spotId: `spot-${place.id}-1`,
        spotName: `${place.name} - Main Wall`,
        propertyName: place.name,
        propertyImage: place.image,
        propertyLocation: place.location,
        artworkId: place.artPieceId,
        artworkTitle: artwork?.title || "Unknown Artwork",
        artworkImage: artwork?.images[0] || "/placeholder.svg",
        artworkArtist: artwork?.artist || "Unknown Artist",
        status: ["ALLOCATED", "DELIVERED", "LIVE"][Math.floor(Math.random() * 3)],
        allocatedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }
    })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Allocations</h1>
        <Button asChild>
          <Link href="/admin/allocations/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Allocation
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Artwork Allocations</CardTitle>
          <CardDescription>Manage the allocation of artworks to spots across properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search allocations..." className="pl-8" />
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
              <TabsTrigger value="all">All Allocations</TabsTrigger>
              <TabsTrigger value="allocated">Allocated</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Artwork</th>
                        <th className="py-3 px-4 text-left font-medium">Spot</th>
                        <th className="py-3 px-4 text-left font-medium">Property</th>
                        <th className="py-3 px-4 text-left font-medium">Allocated Date</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map((allocation) => {
                        return (
                          <tr key={allocation.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="relative h-10 w-10 rounded overflow-hidden mr-2">
                                  <Image
                                    src={allocation.artworkImage || "/placeholder.svg"}
                                    alt={allocation.artworkTitle}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{allocation.artworkTitle}</div>
                                  <div className="text-xs text-gray-500">by {allocation.artworkArtist}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">{allocation.spotName}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="relative h-8 w-8 rounded overflow-hidden mr-2">
                                  <Image
                                    src={allocation.propertyImage || "/placeholder.svg"}
                                    alt={allocation.propertyName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div>{allocation.propertyName}</div>
                                  <div className="text-xs text-gray-500">{allocation.propertyLocation}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{allocation.allocatedDate}</td>
                            <td className="py-3 px-4">
                              <AllocationStatusBadge status={allocation.status} />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/admin/allocations/${allocation.id}`}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Details
                                </Link>
                                <Link
                                  href={`/admin/allocations/${allocation.id}/update`}
                                  className="text-xs text-green-600 hover:text-green-800"
                                >
                                  Update Status
                                </Link>
                                <button className="text-xs text-red-600 hover:text-red-800">Remove</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Other tab contents would be similar but filtered */}
            <TabsContent value="allocated" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only allocated artworks</div>
            </TabsContent>
            <TabsContent value="delivered" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only delivered artworks</div>
            </TabsContent>
            <TabsContent value="live" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only live artworks</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Allocation Wizard */}
      <Card>
        <CardHeader>
          <CardTitle>Allocation Wizard</CardTitle>
          <CardDescription>Use the wizard to quickly match artworks to available spots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Start a New Allocation</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              The allocation wizard will guide you through the process of matching artworks to spots based on
              requirements
            </p>
            <Button asChild>
              <Link href="/admin/allocations/wizard">
                Start Allocation Wizard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Allocation status badge component
function AllocationStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "ALLOCATED":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
          Allocated
        </Badge>
      )
    case "DELIVERED":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
          Delivered
        </Badge>
      )
    case "LIVE":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
          Live
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100">
          {status}
        </Badge>
      )
  }
}

