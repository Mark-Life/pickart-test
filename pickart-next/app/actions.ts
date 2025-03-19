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

/**
 * Check if a user is approved and can access their dashboard
 */
export async function isUserApproved(userId: string) {
  try {
    // First, get user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        // User doesn't exist in the users table
        return { approved: false, user: null, error: null }
      }
      throw userError
    }
    
    // Get approval data
    const { data: approvalData, error: approvalError } = await supabaseAdmin
      .from('registration_approvals')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (approvalError && approvalError.code !== 'PGRST116') {
      console.error('Error fetching approval:', approvalError)
    }
    
    // User is approved if they have an approval record with status 'approved'
    // OR if they exist in the users table but don't have any approval record
    // (legacy users or manually created users)
    const isApproved = (approvalData && approvalData.status === 'approved') || 
                      (userData && !approvalData);
    
    return {
      approved: isApproved,
      user: userData,
      error: null
    }
  } catch (error) {
    console.error('Error checking user approval:', error)
    return { approved: false, user: null, error }
  }
} 