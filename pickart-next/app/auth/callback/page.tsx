"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function AuthCallback() {
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
            console.log('Auth Callback: Existing session found, checking user role')
            
            // Check user role to decide redirect
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", session.user.id)
                .single()
              
              if (profile?.role === "admin") {
                console.log('Auth Callback: Admin user detected, redirecting to admin dashboard')
                router.push('/admin')
              } else {
                console.log('Auth Callback: Regular user detected, redirecting to dashboard')
                router.push('/dashboard')
              }
            } catch (err) {
              console.error('Auth Callback: Error getting user role:', err)
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