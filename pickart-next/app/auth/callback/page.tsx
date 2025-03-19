"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('Auth Callback: Starting authentication callback handling')
      
      try {
        // Get the token_hash and type from the URL
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const next = searchParams.get('next') || '/dashboard'

        console.log('Auth Callback: Parameters found:', {
          tokenHash: tokenHash ? 'present' : 'missing',
          type: type || 'missing',
          next
        })

        if (tokenHash && type) {
          console.log('Auth Callback: Verifying OTP')
          
          // Verify the OTP
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any
          })

          if (error) {
            console.error('Auth Callback: OTP verification failed:', error)
            setError(error.message)
            toast({
              title: "Authentication failed",
              description: error.message,
              variant: "destructive",
            })
            
            // Redirect to login after a delay
            setTimeout(() => {
              router.push('/login')
            }, 3000)
            return
          }
          
          console.log('Auth Callback: OTP verified successfully, redirecting to', next)
          toast({
            title: "Authentication successful",
            description: "You've been signed in successfully.",
            variant: "default",
          })
          
          // Redirect to specified page or dashboard
          router.push(next)
        } else {
          console.log('Auth Callback: Missing token_hash or type, checking existing session')
          
          // Check if user has an active session
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            throw error
          }
          
          if (session) {
            console.log('Auth Callback: Existing session found, checking user record')
            
            // Check if user exists in the users table
            const { data: user, error: userError } = await supabase
              .from("users")
              .select("role")
              .eq("id", session.user.id)
              .single()
              
            if (userError && userError.code === 'PGRST116') {
              // Record not found - user exists in auth but not in public.users table
              console.log('Auth Callback: User not found in users table, redirecting to verification page')
              router.push('/verification-pending')
              return
            } else if (userError) {
              throw userError
            }
            
            // User exists in public.users table, redirect based on role
            if (user?.role === "admin") {
              console.log('Auth Callback: Admin user detected, redirecting to admin dashboard')
              router.push('/admin')
            } else if (user?.role === "artist") {
              console.log('Auth Callback: Artist user detected, redirecting to artist dashboard')
              router.push('/artist/dashboard')
            } else if (user?.role === "host") {
              console.log('Auth Callback: Host user detected, redirecting to host dashboard')
              router.push('/host/dashboard')
            } else {
              console.log('Auth Callback: Regular user detected, redirecting to dashboard')
              router.push('/dashboard')
            }
          } else {
            console.log('Auth Callback: No session found, redirecting to login')
            setError("Missing authentication parameters")
            router.push('/login')
          }
        }
      } catch (err: any) {
        console.error('Auth Callback: Error during callback:', err)
        setError(err.message || "An error occurred during authentication")
        toast({
          title: "Authentication error",
          description: err.message || "An error occurred during authentication",
          variant: "destructive",
        })
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            {isLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse h-6 w-24 bg-gray-200 rounded mx-auto"></div>
                <p>Completing authentication...</p>
              </div>
            ) : error ? (
              <p className="text-red-500">Authentication failed: {error}</p>
            ) : (
              <p>Authentication successful! Redirecting...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="space-y-3">
                <div className="animate-pulse h-6 w-24 bg-gray-200 rounded mx-auto"></div>
                <p>Loading authentication...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 