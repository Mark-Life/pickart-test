import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/supabase/server"
import { isUserApproved } from "@/app/actions"

export default async function HostDashboard() {
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
      <h1 className="text-3xl font-bold mb-8">Host Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {userData.first_name}!</CardTitle>
            <CardDescription>
              Manage your properties and art spots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your host dashboard shows you an overview of your activity on PickArt.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
            <CardDescription>
              Your registered properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You haven't added any properties yet. Start by adding your first property.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Art Spots</CardTitle>
            <CardDescription>
              Available spaces for artwork
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>No art spots created yet. Add a property first, then define spots for art placement.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 