'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'

// Create a Supabase client for server actions
const createClient = async () => {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return {
      error: 'Email and password are required'
    }
  }
  
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return {
      error: error.message
    }
  }
  
  // Fetch user role to determine redirect
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()
    
  if (userError) {
    return {
      error: 'Error fetching user profile'
    }
  }
  
  // Redirect based on role
  if (userData?.role === 'admin') {
    redirect('/admin')
  } else if (userData?.role === 'artist') {
    redirect('/artist/dashboard')
  } else if (userData?.role === 'host') {
    redirect('/host/dashboard')
  } else {
    redirect('/dashboard')
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const countryCode = formData.get('countryCode') as string
  const role = formData.get('role') as 'artist' | 'host'
  
  if (!email || !password || !firstName || !lastName || !phone || !address || !countryCode || !role) {
    return {
      error: 'All fields are required'
    }
  }
  
  const supabase = await createClient()
  
  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName
      }
    }
  })
  
  if (error) {
    return {
      error: error.message
    }
  }
  
  if (data.user) {
    // Create user profile in database
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        address: address,
        country_code: countryCode,
        role: role
      })
      
    if (profileError) {
      return {
        error: 'Error creating user profile'
      }
    }
    
    // Create artist or host record
    if (role === 'artist') {
      const { error: artistError } = await supabase
        .from('artists')
        .insert({
          user_id: data.user.id,
          artist_type: 'artist',
          display_name: `${firstName} ${lastName}`,
          contract_signed: false
        })
        
      if (artistError) {
        return {
          error: 'Error creating artist profile'
        }
      }
    } else if (role === 'host') {
      const { error: hostError } = await supabase
        .from('hosts')
        .insert({
          user_id: data.user.id,
          host_type: 'host',
          contract_signed: false
        })
        
      if (hostError) {
        return {
          error: 'Error creating host profile'
        }
      }
    }
  }
  
  // Redirect to login page with success message
  redirect('/login?registered=true')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string
  
  if (!email) {
    return {
      error: 'Email is required'
    }
  }
  
  const supabase = await createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })
  
  if (error) {
    return {
      error: error.message
    }
  }
  
  return {
    success: 'Password reset instructions sent to your email'
  }
} 