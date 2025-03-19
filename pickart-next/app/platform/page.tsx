import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  getUserRole, 
  canViewHostContent, 
  canViewArtistContent, 
  canViewAdminContent,
  shouldShowPendingApproval
} from '@/lib/auth/roles'

// Import test components
import HostText from '@/components/platform/test/host-text'
import ArtistText from '@/components/platform/test/artist-text'
import AdminText from '@/components/platform/test/admin-text'
import NotApproved from '@/components/platform/test/not-approved'

export default async function PlatformPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // If not authenticated, redirect to login
    redirect('/platform/login')
  }
  
  // Get user role and approval status
  const userWithRole = await getUserRole(user)
  const { role, approved } = userWithRole
  
  // Determine which components to show
  const showHostContent = canViewHostContent(role, approved)
  const showArtistContent = canViewArtistContent(role, approved)
  const showAdminContent = canViewAdminContent(role, approved)
  const showPendingApproval = shouldShowPendingApproval(role, approved)
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">PickArt Platform</h1>
        <p className="text-gray-600 mt-2">Welcome, {user.email}</p>
        
        {role !== 'unknown' && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Role: {role}
            </span>
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {approved ? 'Approved' : 'Pending Approval'}
            </span>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Role-Based Content Test</h2>
        
        {/* Show role-specific content */}
        {showPendingApproval && <NotApproved />}
        {showHostContent && <HostText />}
        {showArtistContent && <ArtistText />}
        {showAdminContent && <AdminText />}
        
        {role === 'unknown' && (
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h3 className="font-medium text-gray-700">New User</h3>
            <p className="text-gray-600">
              Your account doesn't have a role yet. Please complete registration or contact an administrator.
            </p>
          </div>
        )}
        
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