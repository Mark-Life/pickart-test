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
        
        // Create a profile record in the profiles table
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: session.user.id,
            first_name: registrationData.firstName,
            last_name: registrationData.lastName,
            email: registrationData.email,
            role: registrationData.role,
            display_name: `${registrationData.firstName} ${registrationData.lastName}`,
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) throw profileError
        
        // Clear the registration data
        localStorage.removeItem("pickart_registration")
        
        toast({
          title: "Registration complete",
          description: "Your account has been created successfully.",
          variant: "default",
        })
        
        setIsComplete(true)
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
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
              <p>Your account has been created successfully. Redirecting to dashboard...</p>
            ) : (
              <p>There was an error completing your registration. Returning to registration page...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 