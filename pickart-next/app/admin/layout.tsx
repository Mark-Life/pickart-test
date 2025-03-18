import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Palette, Users, MapPin, LayoutDashboard, QrCode, Building, ArrowUpDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard | PickArt",
  description: "Manage artworks, spots, properties, and users in the PickArt platform",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
          <div className="mt-8 flex flex-col flex-1">
            <nav className="flex-1 px-2 space-y-1">
              <Link
                href="/admin"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
                Dashboard
              </Link>
              <Link
                href="/admin/artworks"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <Palette className="mr-3 h-5 w-5 text-gray-500" />
                Artworks
              </Link>
              <Link
                href="/admin/properties"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <Building className="mr-3 h-5 w-5 text-gray-500" />
                Properties
              </Link>
              <Link
                href="/admin/spots"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                Spots
              </Link>
              <Link
                href="/admin/allocations"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <ArrowUpDown className="mr-3 h-5 w-5 text-gray-500" />
                Allocations
              </Link>
              <Link
                href="/admin/users"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <Users className="mr-3 h-5 w-5 text-gray-500" />
                Users
              </Link>
              <Link
                href="/admin/qr-codes"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <QrCode className="mr-3 h-5 w-5 text-gray-500" />
                QR Codes
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 pb-8">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

