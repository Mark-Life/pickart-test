"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import InviteAdminForm from "@/components/auth/invite-admin-form"
import { User, Mail, Calendar, Shield } from "lucide-react"

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [admins, setAdmins] = useState<any[]>([])

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          throw new Error("Not authenticated")
        }

        // Check if current user is admin
        const { data: currentUserProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (currentUserProfile?.role !== "admin") {
          throw new Error("Unauthorized")
        }

        // Fetch all admin users
        const { data, error } = await supabase.from("profiles").select("*").eq("role", "admin")

        if (error) throw error

        setAdmins(data || [])
      } catch (error) {
        console.error("Error fetching admins:", error)
        toast({
          title: "Error",
          description: "Failed to load admin users.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Users</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage admin users with access to the PickArt platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : admins.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No admin users found</div>
              ) : (
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-start space-x-4 p-4 border rounded-md">
                      <div className="bg-primary/10 rounded-full p-2">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            {admin.first_name} {admin.last_name}
                          </h3>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            Admin
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" /> {admin.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" /> Joined {new Date(admin.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <InviteAdminForm />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Admin Privileges</CardTitle>
              <CardDescription>What admin users can do</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span className="text-sm">Manage all artworks and spots</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span className="text-sm">Approve or reject user registrations</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span className="text-sm">Invite new admin users</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span className="text-sm">Access all platform settings</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

