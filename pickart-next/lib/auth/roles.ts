import { createAdminClient } from '@/lib/supabase/admin'
import { User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'artist' | 'host' | 'pending' | 'unknown'

interface UserWithRole {
  id: string
  email: string
  role: UserRole
  approved: boolean
}

export async function getUserRole(user: User | null): Promise<UserWithRole> {
  
  if (!user) {
    return {
      id: '',
      email: '',
      role: 'unknown',
      approved: false
    }
  }

  // Use admin client to bypass RLS
  const supabase = createAdminClient()
  
  // Check if user exists in public.users table and get their role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', user.id)
    .single()
  
  
  if (userError || !userData) {
    // Check if there's a pending registration approval
    const { data: approvalData, error: approvalError } = await supabase
      .from('registration_approvals')
      .select('id, requested_role, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    
    if (approvalError || !approvalData) {
      return {
        id: user.id,
        email: user.email || '',
        role: 'unknown',
        approved: false
      }
    }
    
    return {
      id: user.id,
      email: user.email || '',
      role: approvalData.requested_role as UserRole,
      approved: approvalData.status === 'approved'
    }
  }
  
  // Check if the user has an approved registration
  const { data: approvalData, error: approvalError } = await supabase
    .from('registration_approvals')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .limit(1)
    .single()

  
  const result = {
    id: userData.id,
    email: userData.email,
    role: userData.role as UserRole,
    approved: !!approvalData
  }
  
  return result
}

export function canViewHostContent(role: UserRole, approved: boolean): boolean {
  const canView = (role === 'host' || role === 'admin') && approved
  return canView
}

export function canViewArtistContent(role: UserRole, approved: boolean): boolean {
  const canView = (role === 'artist' || role === 'admin') && approved
  return canView
}

export function canViewAdminContent(role: UserRole, approved: boolean): boolean {
  const canView = role === 'admin' && approved
  return canView
}

export function shouldShowPendingApproval(role: UserRole, approved: boolean): boolean {
  const shouldShow = role !== 'unknown' && !approved
  return shouldShow
} 