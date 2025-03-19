import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// This client bypasses RLS and should ONLY be used in server-side functions
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase credentials for admin client')
    throw new Error('Missing environment variables for Supabase admin client')
  }
  
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey
  )
} 