"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  role: "artist" | "host"
}

export default function RegistrationComplete() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const completeRegistration = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (!session) {
          throw new Error("No active session found")
        }
        
        // Get the registration data from localStorage
        const storedData = localStorage.getItem("pickart_registration")
        if (!storedData) {
          throw new Error("Registration data not found")
        }
        
        const registrationData = JSON.parse(storedData) as UserRegistrationData
        
        // Create a user record in the users table
        const { error: userError } = await supabase.from("users").insert([
          {
            id: session.user.id,
            first_name: registrationData.firstName,
            last_name: registrationData.lastName,
            email: registrationData.email,
            role: registrationData.role,
            // Required fields for the users table
            phone: "", // To be updated by user later
            address: "", // To be updated by user later
            country_code: null, // To be updated by user later
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (userError) throw userError

        // Create additional records based on role
        if (registrationData.role === "artist") {
          const { error: artistError } = await supabase
            .from('artists')
            .insert({
              user_id: session.user.id,
              artist_type: 'artist',
              display_name: `${registrationData.firstName} ${registrationData.lastName}`,
              contract_signed: false
            })
            
          if (artistError) throw artistError
        } else if (registrationData.role === "host") {
          const { error: hostError } = await supabase
            .from('hosts')
            .insert({
              user_id: session.user.id,
              host_type: 'host',
              contract_signed: false
            })
            
          if (hostError) throw hostError
        }
        
        // Create registration approval record
        const { error: approvalError } = await supabase
          .from('registration_approvals')
          .insert({
            user_id: session.user.id,
            status: 'pending',
            requested_role: registrationData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          
        if (approvalError) throw approvalError
        
        // Clear the registration data
        localStorage.removeItem("pickart_registration")
        
        toast({
          title: "Registration complete",
          description: "Your account has been created successfully.",
          variant: "default",
        })
        
        setIsComplete(true)
        
        // Redirect to verification pending page instead of dashboard
        setTimeout(() => {
          router.push("/verification-pending")
        }, 2000)
      } catch (error: any) {
        console.error("Registration completion error:", error)
        toast({
          title: "Registration error",
          description: error.message || "Failed to complete registration",
          variant: "destructive",
        })
        
        // Redirect to registration page on error
        setTimeout(() => {
          router.push("/register")
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    completeRegistration()
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoading ? "Completing Registration" : isComplete ? "Registration Complete" : "Registration Error"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {isLoading ? (
              <p>Please wait while we complete your registration...</p>
            ) : isComplete ? (
              <p>Your account has been created successfully. Redirecting to verification page...</p>
            ) : (
              <p>There was an error completing your registration. Returning to registration page...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 