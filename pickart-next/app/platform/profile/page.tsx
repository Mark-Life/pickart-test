import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserRole } from '@/lib/auth/roles'

export default async function ProfilePage() {
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Link 
          href="/platform" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600">
            <strong>ID:</strong> {user.id}
          </p>
          <p className="text-gray-600">
            <strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || '').toLocaleString()}
          </p>
          <p className="text-gray-600">
            <strong>Role:</strong> {role || 'Not assigned'}
          </p>
          <p className="text-gray-600">
            <strong>Status:</strong> {
              role === 'unknown' ? 'No role assigned' :
              approved ? 'Approved' : 'Pending Approval'
            }
          </p>
        </div>
      </div>
    </div>
  )
} 