"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  // Check for query params
  useEffect(() => {
    const registered = searchParams.get("registered")
    if (registered) {
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
        variant: "destructive",
      })
    }
    
    const token_hash = searchParams.get("token_hash")
    const type = searchParams.get("type")
    
    if (token_hash && type) {
      verifyMagicLink(token_hash, type)
    }
  }, [searchParams])
  
  const verifyMagicLink = async (token_hash: string, type: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({ 
        token_hash, 
        type: type as any 
      })
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "You've been signed in successfully.",
        variant: "default",
      })
      
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Failed to verify magic link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      setMagicLinkSent(true)
      toast({
        title: "Magic link sent",
        description: "Check your email for the login link.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Failed to send magic link.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>We've sent a magic link to {email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Click the link in your email to sign in to your account.
          </p>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => setMagicLinkSent(false)}
          >
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your PickArt account with a magic link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending magic link..." : "Send magic link"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function LoginForm() {
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
      <LoginFormContent />
    </Suspense>
  )
}

