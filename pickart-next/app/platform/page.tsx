import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PlatformPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // If not authenticated, redirect to login
    redirect('/platform/login')
  }
  
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PickArt Platform</h1>
        <p className="text-gray-600 mt-2">Welcome, {user.email}</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <p className="text-gray-600">
          This is your protected platform dashboard. Only authenticated users can see this page.
        </p>
        
        <div className="mt-6 flex space-x-4">
          <Link 
            href="/platform/profile" 
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            My Profile
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

// This is a server component
// We'll implement a client component for logging out
function LogoutButton() {
  return (
    <form action="/platform/logout" method="post">
      <button 
        type="submit"
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        Log Out
      </button>
    </form>
  )
} 