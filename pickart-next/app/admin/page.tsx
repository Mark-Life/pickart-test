import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Users, MapPin, Building, ArrowUpDown, TrendingUp } from "lucide-react"
import { getAllArtPieces } from "@/lib/art"
import { getAllPlaces } from "@/lib/places"

export const metadata = {
  title: "Admin Dashboard | PickArt",
  description: "Manage art pieces, properties, spots, and users in the PickArt platform",
}

export default async function AdminDashboard() {
  const artPieces = await getAllArtPieces()
  const places = await getAllPlaces()

  // Mock data for now
  const stats = {
    totalArtworks: artPieces.length,
    totalProperties: places.length,
    totalSpots: places.length * 2, // Mock calculation
    totalUsers: 12,
    totalAllocations: 5,
    totalSales: 3,
    revenue: 4250,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArtworks}</div>
            <p className="text-xs text-muted-foreground">{artPieces.filter((a) => a.published).length} published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Across {places.length} locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpots}</div>
            <p className="text-xs text-muted-foreground">{stats.totalSpots - 5} available for allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">8 artists, 4 hosts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Allocations</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAllocations}</div>
            <p className="text-xs text-muted-foreground">Across {places.length} properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">${stats.revenue.toLocaleString()} revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/admin/artworks/new"
          className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-32"
        >
          <Palette className="h-8 w-8 mb-2 text-primary" />
          <h3 className="font-medium">Add New Artwork</h3>
        </Link>
        <Link
          href="/admin/properties/new"
          className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-32"
        >
          <Building className="h-8 w-8 mb-2 text-primary" />
          <h3 className="font-medium">Add New Property</h3>
        </Link>
        <Link
          href="/admin/spots/new"
          className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-32"
        >
          <MapPin className="h-8 w-8 mb-2 text-primary" />
          <h3 className="font-medium">Add New Spot</h3>
        </Link>
        <Link
          href="/admin/users/new"
          className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-32"
        >
          <Users className="h-8 w-8 mb-2 text-primary" />
          <h3 className="font-medium">Add New User</h3>
        </Link>
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Artwork Allocated",
                description: "Sunset Horizon was allocated to Grand Hotel lobby",
                timestamp: "2 hours ago",
              },
              {
                action: "New Property Added",
                description: "Tech Hub Offices was added to the platform",
                timestamp: "5 hours ago",
              },
              {
                action: "Artwork Sold",
                description: "Urban Rhythm was purchased for $1,800",
                timestamp: "1 day ago",
              },
              {
                action: "New Artist Registered",
                description: "Emma Johnson joined as an artist",
                timestamp: "2 days ago",
              },
              {
                action: "QR Code Generated",
                description: "New QR code for Riverside Gallery spot #3",
                timestamp: "3 days ago",
              },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

