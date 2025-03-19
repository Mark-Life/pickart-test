import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import type { CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  // Get the token and type from the URL
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Return an error if the token or type are missing
  if (!token_hash || !type) {
    return NextResponse.redirect(new URL('/error?message=Missing token or type', request.url))
  }

  // Create a response to set cookies on
  const cookieStore = cookies()
  
  // Create a client using the server client that can modify cookies
  const supabase = createServerClient(
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

  // Verify the OTP
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  })

  if (error) {
    return NextResponse.redirect(
      new URL(`/error?message=${encodeURIComponent(error.message)}`, request.url)
    )
  }

  // If no error, redirect to the success page or the provided next URL
  return NextResponse.redirect(new URL(next, request.url))
} 