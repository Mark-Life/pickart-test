import { db } from './index'
import { countries } from './schema'
import { createClient } from '@supabase/supabase-js'

/**
 * Utility function to check if database connection is working
 * Returns information about the database connection status
 */
export async function checkDatabaseConnection() {
  const results = {
    drizzle: {
      connected: false,
      error: null as string | null,
      message: ''
    },
    supabase: {
      connected: false,
      error: null as string | null,
      message: ''
    },
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  }

  // Check Drizzle connection
  try {
    // Try a simple query
    const countriesCount = await db.select({ count: countries.code }).from(countries)
    results.drizzle.connected = true
    results.drizzle.message = `Connected successfully. Found ${countriesCount.length} countries.`
  } catch (error) {
    results.drizzle.connected = false
    results.drizzle.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Check Supabase connection
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      results.supabase.error = 'Missing Supabase credentials'
      return results
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase.from('countries').select('code', { count: 'exact' })
    
    if (error) {
      results.supabase.error = error.message
    } else {
      results.supabase.connected = true
      results.supabase.message = `Connected to Supabase successfully. Found ${data.length} countries.`
    }
  } catch (error) {
    results.supabase.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return results
}

/**
 * Simple function to test if the database connection is configured properly
 */
export async function testDbConnection() {
  try {
    console.log('Testing database connection...')
    const info = await checkDatabaseConnection()
    console.log('Environment variables:')
    console.log(`- DATABASE_URL: ${info.env.hasDbUrl ? 'Set' : 'Missing'}`)
    console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${info.env.hasSupabaseUrl ? 'Set' : 'Missing'}`)
    console.log(`- SUPABASE_SERVICE_ROLE_KEY: ${info.env.hasSupabaseKey ? 'Set' : 'Missing'}`)
    
    console.log('\nDrizzle connection:')
    if (info.drizzle.connected) {
      console.log(`✅ ${info.drizzle.message}`)
    } else {
      console.log(`❌ Connection failed: ${info.drizzle.error}`)
    }
    
    console.log('\nSupabase connection:')
    if (info.supabase.connected) {
      console.log(`✅ ${info.supabase.message}`)
    } else {
      console.log(`❌ Connection failed: ${info.supabase.error}`)
    }
    
    return info
  } catch (error) {
    console.error('Error testing database connection:', error)
    throw error
  }
} 