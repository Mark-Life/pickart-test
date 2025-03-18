import Link from "next/link"
import Image from "next/image"
import { getAllArtPieces } from "@/lib/art"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ArtworkStatusBadge } from "@/components/artwork-status-badge"

export const metadata = {
  title: "Manage Artworks | PickArt Admin",
  description: "Add, edit, and manage artworks in the PickArt platform",
}

export default async function ArtworksPage() {
  const artworks = await getAllArtPieces()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Artworks</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Artwork
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Artwork Management</CardTitle>
          <CardDescription>Add, edit, and manage artworks. Approve submissions and allocate to spots.</CardDescription>
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
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Image</th>
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">Title</th>
                        <th className="py-3 px-4 text-left font-medium">Artist</th>
                        <th className="py-3 px-4 text-left font-medium">Price</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artworks.map((artwork) => {
                        // Mock status for demo
                        const statuses = ["DRAFT", "PENDING", "READY", "ALLOCATED", "DELIVERED", "LIVE"]
                        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

                        return (
                          <tr key={artwork.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="relative h-12 w-12 rounded overflow-hidden">
                                <Image
                                  src={artwork.images[0] || "/placeholder.svg"}
                                  alt={artwork.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">AWCH-{artwork.id}-XX</td>
                            <td className="py-3 px-4 font-medium">{artwork.title}</td>
                            <td className="py-3 px-4">{artwork.artist}</td>
                            <td className="py-3 px-4">${artwork.price.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <ArtworkStatusBadge status={randomStatus} />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/admin/artworks/${artwork.id}`}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </Link>
                                <Link
                                  href={`/admin/artworks/${artwork.id}/allocate`}
                                  className="text-xs text-green-600 hover:text-green-800"
                                >
                                  Allocate
                                </Link>
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
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
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

