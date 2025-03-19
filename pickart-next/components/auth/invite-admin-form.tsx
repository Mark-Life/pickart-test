"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function InviteAdminForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First check if the current user is an admin
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("You must be logged in to invite admins")
      }

      const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (currentUserProfile?.role !== "admin") {
        throw new Error("Only admins can invite other admins")
      }

      // Generate a unique invite token
      const inviteToken = crypto.randomUUID()

      // Store the invite in the database
      const { error: inviteError } = await supabase.from("admin_invites").insert([
        {
          email,
          invite_token: inviteToken,
          created_by: session.user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        },
      ])

      if (inviteError) throw inviteError

      // Send the invite email (in a real app, you'd use a service like SendGrid or AWS SES)
      // For now, we'll just simulate it
      const inviteUrl = `${window.location.origin}/admin-signup?token=${inviteToken}`

      console.log(`Invite URL for ${email}: ${inviteUrl}`)

      toast({
        title: "Admin invite sent",
        description: `An invitation has been sent to ${email}.`,
        variant: "default",
      })

      setEmail("")
    } catch (error: any) {
      toast({
        title: "Failed to send invite",
        description: error.message || "An error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Admin</CardTitle>
        <CardDescription>Send an invitation to a new admin user</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending invite..." : "Send Invite"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

