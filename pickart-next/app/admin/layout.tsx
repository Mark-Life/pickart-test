import Link from "next/link"
import { redirect } from "next/navigation"
import { 
  LayoutDashboard,
  Users,
  PaintBucket,
  Building,
  MapPin,
  QrCode,
  ArrowUpDown,
  Settings,
  LogOut
} from "lucide-react"
import { getCurrentUser, createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Admin Dashboard | PickArt",
  description: "Manage art pieces, properties, spots, and users in the PickArt platform",
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Check if user is authenticated and is an admin
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  // Get user data from users table
  const supabase = await createClient()
  const { data: userData, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()
  
  // Check if user exists in public.users table
  if (error && error.code === 'PGRST116') {
    // Record not found - user exists in auth but not in public.users table
    redirect("/verification-pending")
  }
  
  // Check if user has admin role
  if (!userData || userData.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/admin" className="text-xl font-bold text-black">
              PickArt Admin
            </Link>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-1">
              <Link href="/admin" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
                Dashboard
              </Link>
              <Link href="/admin/users" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <Users className="mr-3 h-5 w-5 text-gray-500" />
                Users
              </Link>
              <Link href="/admin/approvals" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 pl-10">
                Pending Approvals
              </Link>
              <Link href="/admin/artworks" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <PaintBucket className="mr-3 h-5 w-5 text-gray-500" />
                Artworks
              </Link>
              <Link href="/admin/properties" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <Building className="mr-3 h-5 w-5 text-gray-500" />
                Properties
              </Link>
              <Link href="/admin/spots" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                Spots
              </Link>
              <Link href="/admin/qr-codes" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <QrCode className="mr-3 h-5 w-5 text-gray-500" />
                QR Codes
              </Link>
              <Link href="/admin/allocations" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                <ArrowUpDown className="mr-3 h-5 w-5 text-gray-500" />
                Allocations
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link href="/admin/profile" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
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

