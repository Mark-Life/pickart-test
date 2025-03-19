"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface AdminRegistrationData {
  firstName: string
  lastName: string
  inviteToken: string
  role: "admin"
}

export default function AdminSignupComplete() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const completeAdminSignup = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (!session) {
          throw new Error("No active session found")
        }
        
        // Get the registration data from localStorage
        const storedData = localStorage.getItem("pickart_admin_registration")
        if (!storedData) {
          throw new Error("Registration data not found")
        }
        
        const registrationData = JSON.parse(storedData) as AdminRegistrationData
        
        // Create a profile record in the profiles table
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: session.user.id,
            first_name: registrationData.firstName,
            last_name: registrationData.lastName,
            email: session.user.email,
            role: "admin",
            display_name: `${registrationData.firstName} ${registrationData.lastName}`,
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) throw profileError
        
        // Mark the invite as used
        const { error: inviteError } = await supabase
          .from("admin_invites")
          .update({ used_at: new Date().toISOString() })
          .eq("invite_token", registrationData.inviteToken)

        if (inviteError) throw inviteError
        
        // Clear the registration data
        localStorage.removeItem("pickart_admin_registration")
        
        toast({
          title: "Admin account created",
          description: "Your admin account has been created successfully.",
          variant: "default",
        })
        
        setIsComplete(true)
        
        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 2000)
      } catch (error: any) {
        console.error("Admin registration completion error:", error)
        toast({
          title: "Registration error",
          description: error.message || "Failed to complete admin registration",
          variant: "destructive",
        })
        
        // Redirect to home page on error
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    completeAdminSignup()
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoading ? "Completing Admin Setup" : isComplete ? "Admin Account Created" : "Setup Error"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {isLoading ? (
              <p>Please wait while we complete your admin account setup...</p>
            ) : isComplete ? (
              <p>Your admin account has been created successfully. Redirecting to dashboard...</p>
            ) : (
              <p>There was an error completing your registration. Returning to home page...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 