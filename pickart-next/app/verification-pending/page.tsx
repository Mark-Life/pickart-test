"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function VerificationPending() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    const checkUserSession = async () => {
      // Check if user has an active session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // If no session, redirect to login
        router.push('/login')
        return
      }
      
      // Set user email safely
      if (session.user.email) {
        setUserEmail(session.user.email)
      }
      
      // Double-check if the user exists in the users table
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", session.user.id)
        .single()
        
      if (data && !error) {
        // User record exists now, redirect to dashboard
        router.push('/dashboard')
      }
    }
    
    checkUserSession()
    
    // Set up periodic checking for user record
    const interval = setInterval(checkUserSession, 10000) // Check every 10 seconds
    
    return () => clearInterval(interval)
  }, [router])
  
  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
        variant: "default",
      })
      router.push('/login')
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
      setIsSigningOut(false)
    }
  }
  
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-center text-xl">Verification Pending</CardTitle>
          <CardDescription className="text-center">
            Your account is awaiting verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p>
              Your account {userEmail && `(${userEmail})`} has been successfully created, but it's currently awaiting verification by our administrators.
            </p>
            <p className="mt-2">
              You'll receive an email notification once your account has been verified, and you'll then be able to access the platform.
            </p>
          </div>
          
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Please check your email for any additional verification steps or requirements.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full"
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              "Sign Out"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 