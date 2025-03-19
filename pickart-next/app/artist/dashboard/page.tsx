import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/supabase/server"
import { isUserApproved } from "@/app/actions"

export default async function ArtistDashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }
  
  // Use server action to get user data
  const { approved, user: userData } = await isUserApproved(user.id)
  
  if (!approved || !userData) {
    return null
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Artist Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {userData.first_name}!</CardTitle>
            <CardDescription>
              Manage your artworks and track their placements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your artist dashboard shows you an overview of your activity on PickArt.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Artworks</CardTitle>
            <CardDescription>
              Your artwork portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You haven't added any artworks yet. Start by adding your first artwork.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Placements</CardTitle>
            <CardDescription>
              Where your art is currently displayed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>No active placements yet. Your art will appear here when it's placed in a spot.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 