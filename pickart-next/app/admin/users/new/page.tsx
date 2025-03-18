"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewUserPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"artist" | "host">("artist")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would submit to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to the users list
    router.push("/admin/users")
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New User</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Type</CardTitle>
            <CardDescription>Select the type of user you want to create</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={userType}
              onValueChange={(value) => setUserType(value as "artist" | "host")}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex items-start space-x-3 space-y-0 border rounded-md p-4 flex-1">
                <RadioGroupItem value="artist" id="artist" />
                <div className="grid gap-1.5">
                  <Label htmlFor="artist" className="font-medium">
                    Artist / Agent
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Create an account for an artist or art agent who will upload and sell artwork
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0 border rounded-md p-4 flex-1">
                <RadioGroupItem value="host" id="host" />
                <div className="grid gap-1.5">
                  <Label htmlFor="host" className="font-medium">
                    Host / Property Owner
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Create an account for a host or property owner who will display artwork
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Enter the user's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="Enter first name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="Enter last name" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="Enter email address" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" placeholder="Enter phone number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" placeholder="Enter address" required />
            </div>
          </CardContent>
        </Card>

        {userType === "artist" ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Artist Details</CardTitle>
              <CardDescription>Enter additional details for the artist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Artist Display Name *</Label>
                <Input id="displayName" placeholder="Enter display name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Account Name *</Label>
                <Input id="bankName" placeholder="Enter bank account name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAddress">Bank Account Address *</Label>
                <Input id="bankAddress" placeholder="Enter bank account address" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankNumber">Bank Account Number *</Label>
                <Input id="bankNumber" placeholder="Enter bank account number" required />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="artistContract" />
                <Label htmlFor="artistContract">Artist has signed the contract</Label>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Host Details</CardTitle>
              <CardDescription>Enter additional details for the host</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name (optional)</Label>
                <Input id="businessName" placeholder="Enter business name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostBankName">Bank Account Name *</Label>
                <Input id="hostBankName" placeholder="Enter bank account name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostBankAddress">Bank Account Address *</Label>
                <Input id="hostBankAddress" placeholder="Enter bank account address" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostBankNumber">Bank Account Number *</Label>
                <Input id="hostBankNumber" placeholder="Enter bank account number" required />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="hostContract" />
                <Label htmlFor="hostContract">Host has signed the contract</Label>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/users")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save User"}
          </Button>
        </div>
      </form>
    </div>
  )
}

