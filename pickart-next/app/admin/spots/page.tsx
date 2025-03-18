import Link from "next/link"
import Image from "next/image"
import { getAllPlaces } from "@/lib/places"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search, ArrowUpDown, QrCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Manage Spots | PickArt Admin",
  description: "Add, edit, and manage artwork display spots in the PickArt platform",
}

export default async function SpotsPage() {
  const places = await getAllPlaces()

  // Generate mock spots data
  const spots = places.flatMap((place) => {
    // Create 1-3 spots per place
    const spotCount = Math.floor(Math.random() * 3) + 1

    return Array.from({ length: spotCount }, (_, i) => ({
      id: `${place.id}-${i + 1}`,
      placeId: place.id,
      placeName: place.name,
      placeImage: place.image,
      location: place.location,
      floor: Math.floor(Math.random() * 3),
      room: ["Living Room", "Lobby", "Hallway", "Dining Area", "Reception"][Math.floor(Math.random() * 5)],
      position: ["North Wall", "South Wall", "East Wall", "West Wall", "Center"][Math.floor(Math.random() * 5)],
      fixtureMethod: ["Wall Mount", "Standing", "Hanging", "Shelf"][Math.floor(Math.random() * 4)],
      maxWeight: Math.floor(Math.random() * 20) + 5,
      dimensions: `${Math.floor(Math.random() * 100) + 50}cm × ${Math.floor(Math.random() * 100) + 50}cm`,
      status: ["READY", "ALLOCATED", "LIVE"][Math.floor(Math.random() * 3)],
      artworkId: place.artPieceId,
    }))
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Spots</h1>
        <Button asChild>
          <Link href="/admin/spots/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Spot
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Spot Management</CardTitle>
          <CardDescription>
            Add, edit, and manage spots for artwork display. Generate QR codes and allocate artworks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search spots..." className="pl-8" />
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
              <TabsTrigger value="all">All Spots</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
              <TabsTrigger value="allocated">Allocated</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Property</th>
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">Location</th>
                        <th className="py-3 px-4 text-left font-medium">Dimensions</th>
                        <th className="py-3 px-4 text-left font-medium">Fixture</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spots.map((spot) => {
                        return (
                          <tr key={spot.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="relative h-10 w-10 rounded overflow-hidden mr-2">
                                  <Image
                                    src={spot.placeImage || "/placeholder.svg"}
                                    alt={spot.placeName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium">{spot.placeName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">ASCH-{spot.id}-XX</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{spot.room}</div>
                                <div className="text-xs text-gray-500">
                                  Floor {spot.floor}, {spot.position}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{spot.dimensions}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div>{spot.fixtureMethod}</div>
                                <div className="text-xs text-gray-500">Max {spot.maxWeight}kg</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <SpotStatusBadge status={spot.status} />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/admin/spots/${spot.id}`}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </Link>
                                <Link
                                  href={`/admin/spots/${spot.id}/allocate`}
                                  className="text-xs text-green-600 hover:text-green-800"
                                >
                                  Allocate
                                </Link>
                                <Link
                                  href={`/admin/spots/${spot.id}/qr`}
                                  className="text-xs text-purple-600 hover:text-purple-800"
                                >
                                  <QrCode className="h-3 w-3 inline mr-1" />
                                  QR Code
                                </Link>
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
            <TabsContent value="ready" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only ready spots</div>
            </TabsContent>
            <TabsContent value="allocated" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only allocated spots</div>
            </TabsContent>
            <TabsContent value="live" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only live spots</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Spot status badge component
function SpotStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "READY":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
          Ready for Allocation
        </Badge>
      )
    case "ALLOCATED":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
          Allocated
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

