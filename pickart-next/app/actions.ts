'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Get user registration approvals without RLS restrictions
 */
export async function getUserRegistrationApprovals() {
  try {
    const { data, error } = await supabaseAdmin
      .from('registration_approvals')
      .select(`
        *,
        user:users(first_name, last_name, email)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return { data: null, error }
  }
}

/**
 * Approve a user registration
 */
export async function approveUserRegistration(approvalId: string, adminId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('registration_approvals')
      .update({
        status: 'approved',
        approved_by: adminId,
        updated_at: new Date().toISOString()
      })
      .eq('id', approvalId)

    if (error) throw error
    
    revalidatePath('/admin/approvals')
    return { success: true, error: null }
  } catch (error) {
    console.error('Error approving user:', error)
    return { success: false, error }
  }
}

/**
 * Reject a user registration
 */
export async function rejectUserRegistration(approvalId: string, adminId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('registration_approvals')
      .update({
        status: 'rejected',
        approved_by: adminId,
        updated_at: new Date().toISOString()
      })
      .eq('id', approvalId)

    if (error) throw error
    
    revalidatePath('/admin/approvals')
    return { success: true, error: null }
  } catch (error) {
    console.error('Error rejecting user:', error)
    return { success: false, error }
  }
}

/**
 * Check user verification status without RLS restrictions
 */
export async function checkUserVerificationStatus(userId: string) {
  try {
    // Get user data from both tables without RLS restrictions
    const { data: approvalData, error: approvalError } = await supabaseAdmin
      .from('registration_approvals')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (approvalError && approvalError.code !== 'PGRST116') {
      console.error('Error fetching approval:', approvalError)
    }
    
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user:', userError)
    }
    
    return {
      approval: approvalData,
      user: userData,
      error: null
    }
  } catch (error) {
    console.error('Error checking verification status:', error)
    return { approval: null, user: null, error }
  }
} 