"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

function AdminSignupFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  })

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false)
        setIsValidating(false)
        return
      }

      try {
        // Check if the token exists and is valid
        const { data, error } = await supabase
          .from("admin_invites")
          .select("email, expires_at")
          .eq("invite_token", token)
          .single()

        if (error) throw error

        // Check if the token has expired
        if (new Date(data.expires_at) < new Date()) {
          throw new Error("Invite has expired")
        }

        setInviteEmail(data.email)
        setIsValidToken(true)
      } catch (error) {
        console.error("Invalid or expired token:", error)
        setIsValidToken(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Store admin data in localStorage for retrieval after magic link auth
      localStorage.setItem(
        "pickart_admin_registration",
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          inviteToken: token,
          role: "admin"
        })
      )

      // Send magic link for admin signup
      const { error } = await supabase.auth.signInWithOtp({
        email: inviteEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin-signup/complete`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: "admin",
          },
        },
      })

      if (error) throw error

      setMagicLinkSent(true)
      toast({
        title: "Verification email sent",
        description: "Please check your email to confirm your account.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <p>Validating invitation...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isValidToken) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Invalid Invitation</CardTitle>
          <CardDescription>The invitation link is invalid or has expired.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/")} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (magicLinkSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>We've sent a verification link to {inviteEmail}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Click the link in your email to verify and complete your admin account setup.
          </p>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => setMagicLinkSent(false)}
          >
            Back to signup
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Admin Account</CardTitle>
        <CardDescription>Complete your admin account setup for {inviteEmail}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={inviteEmail} disabled className="bg-gray-100" />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create admin account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function AdminSignupForm() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    }>
      <AdminSignupFormContent />
    </Suspense>
  )
}

