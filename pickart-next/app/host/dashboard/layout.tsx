import Link from "next/link"
import { redirect } from "next/navigation"
import { 
  LayoutDashboard,
  Building,
  MapPin,
  Settings,
  LogOut
} from "lucide-react"
import { getCurrentUser } from "@/lib/supabase/server"
import { isUserApproved } from "@/app/actions"

export const metadata = {
  title: "Host Dashboard | PickArt",
  description: "Manage your properties and art spots",
}

interface HostLayoutProps {
  children: React.ReactNode
}

export default async function HostLayout({ children }: HostLayoutProps) {
  // Check if user is authenticated
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  // Check if user is approved using the server action that bypasses RLS
  const { approved, user: userData, error } = await isUserApproved(user.id)
  
  // Check if user exists in public.users table and is approved
  if (!approved || !userData) {
    redirect("/verification-pending")
  }
  
  // Check if user has host role
  if (userData.role !== "host") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/host/dashboard" className="text-xl font-bold text-black">
              Host Dashboard
            </Link>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-1">
              <Link href="/host/dashboard" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
                Dashboard
              </Link>
              <Link href="/host/properties" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <Building className="mr-3 h-5 w-5 text-gray-500" />
                My Properties
              </Link>
              <Link href="/host/spots" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                Art Spots
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link href="/host/settings" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                  <Settings className="mr-3 h-5 w-5 text-gray-500" />
                  Settings
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button className="flex w-full items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                    <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                    Logout
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile menu implementation would go here */}
        <main className="flex-1 overflow-y-auto bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
} 