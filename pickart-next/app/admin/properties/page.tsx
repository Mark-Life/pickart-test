import Link from "next/link"
import Image from "next/image"
import { getAllPlaces } from "@/lib/places"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Manage Properties | PickArt Admin",
  description: "Add, edit, and manage properties in the PickArt platform",
}

export default async function PropertiesPage() {
  const places = await getAllPlaces()

  // Mock property types for each place
  const propertyTypes = ["Hotel", "Multi-room apartment", "House", "Gallery", "Restaurant", "Office"]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Properties</h1>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Property
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
          <CardDescription>Add, edit, and manage properties. Create spots for artwork display.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search properties..." className="pl-8" />
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
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="apartments">Apartments</TabsTrigger>
              <TabsTrigger value="galleries">Galleries</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Image</th>
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Type</th>
                        <th className="py-3 px-4 text-left font-medium">Location</th>
                        <th className="py-3 px-4 text-left font-medium">Spots</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {places.map((place, index) => {
                        // Assign a random property type for demo
                        const propertyType = propertyTypes[index % propertyTypes.length]
                        // Mock number of spots
                        const spotCount = Math.floor(Math.random() * 5) + 1

                        return (
                          <tr key={place.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="relative h-12 w-12 rounded overflow-hidden">
                                <Image
                                  src={place.image || "/placeholder.svg"}
                                  alt={place.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">APCH-{place.id}-XX</td>
                            <td className="py-3 px-4 font-medium">{place.name}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {propertyType}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{place.location}</td>
                            <td className="py-3 px-4">{spotCount}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Link
                                  href={`/admin/properties/${place.id}`}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </Link>
                                <Link
                                  href={`/admin/properties/${place.id}/spots`}
                                  className="text-xs text-green-600 hover:text-green-800"
                                >
                                  Manage Spots
                                </Link>
                                <Link
                                  href={`/place/${place.slug}`}
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
            <TabsContent value="hotels" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only hotel properties</div>
            </TabsContent>
            <TabsContent value="apartments" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only apartment properties</div>
            </TabsContent>
            <TabsContent value="galleries" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only gallery properties</div>
            </TabsContent>
            <TabsContent value="other" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show other property types</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

