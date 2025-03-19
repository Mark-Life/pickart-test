"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface RegistrationInfo {
  email: string | null
  role: string | null | undefined
  status: string | null
}

export default function VerificationPending() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
    email: null,
    role: null,
    status: null
  })
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true)
      
      try {
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
        
        // Get registration approval status
        const { data: approvalData, error: approvalError } = await supabase
          .from("registration_approvals")
          .select("status, requested_role")
          .eq("user_id", session.user.id)
          .single()
        
        if (approvalError && approvalError.code !== 'PGRST116') {
          console.error("Error fetching approval status:", approvalError)
        }
        
        // Check if the user exists in the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, role")
          .eq("id", session.user.id)
          .single()
        
        const roleValue = approvalData?.requested_role || (userData?.role || null)
        const statusValue = approvalData?.status || null
        
        setRegistrationInfo({
          email: session.user.email ?? null,
          role: roleValue,
          status: statusValue
        })
        
        // If approval is approved and user exists in users table, redirect to dashboard
        if (approvalData?.status === 'approved' && userData) {
          const role = userData.role || 'user'
          redirectToDashboard(role)
        }
      } catch (error) {
        console.error("Error checking user session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    const redirectToDashboard = (role: string) => {
      const dashboardPath = role === 'artist' 
        ? '/artist/dashboard' 
        : role === 'host' 
          ? '/host/dashboard'
          : '/dashboard'
          
      router.push(dashboardPath)
    }
    
    checkUserSession()
    
    // Set up periodic checking for user record
    const interval = setInterval(checkUserSession, 60000) // Check every 60 seconds
    
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md px-4">
          <Card className="w-full">
            <CardContent className="pt-6 flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <Card className="w-full">
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
                Your account {registrationInfo.email && `(${registrationInfo.email})`} has been successfully created, but it's currently awaiting verification by our administrators.
              </p>
              {registrationInfo.role && (
                <p className="mt-2">
                  You've registered as a <span className="font-medium">{registrationInfo.role}</span> and your verification is currently <span className="font-medium">{registrationInfo.status || "pending"}</span>.
                </p>
              )}
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
                    We check your verification status automatically every 60 seconds.
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
    </div>
  )
} 