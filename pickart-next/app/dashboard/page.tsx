import { getCurrentUser, getUserProfile } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Dashboard | PickArt",
  description: "Your PickArt Dashboard",
}

export default async function Dashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  // Redirect admin users to admin dashboard
  const userProfile = await getUserProfile(user.id)
  if (userProfile?.role === "admin") {
    redirect("/admin")
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>
              Welcome to your PickArt dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for your user dashboard.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>
              Your recent activity on PickArt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>No recent activity to display.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Next steps for your PickArt journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Complete your profile information</li>
              <li>Browse available art pieces</li>
              <li>Check out featured properties</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 