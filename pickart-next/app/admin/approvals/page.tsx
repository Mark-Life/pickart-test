"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, UserPlus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getUserRegistrationApprovals, approveUserRegistration, rejectUserRegistration } from '@/app/actions'

interface RegistrationApproval {
  id: string
  user_id: string
  status: string
  requested_role: string
  created_at: string
  notes?: string
  user?: {
    first_name: string
    last_name: string
    email: string
  }
}

export default function AdminApprovalsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pendingApprovals, setPendingApprovals] = useState<RegistrationApproval[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchPendingApprovals = async () => {
    setIsLoading(true)
    try {
      // Use server action instead of direct client call
      const { data, error } = await getUserRegistrationApprovals()
      
      if (error) throw error
      
      console.log("Pending approvals from server:", data)
      setPendingApprovals(data || [])
    } catch (error) {
      console.error("Error fetching approvals:", error)
      toast({
        title: "Error",
        description: "Failed to load pending approvals.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  const handleApprove = async (approvalId: string, userId: string) => {
    setProcessingId(approvalId)
    try {
      // Get current admin ID
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error("Not authenticated")
      }
      
      // Use server action
      const { success, error } = await approveUserRegistration(approvalId, session.user.id)
      
      if (!success) throw error
      
      toast({
        title: "Approved",
        description: "Registration has been approved successfully.",
        variant: "default",
      })
      
      // Refresh the list
      fetchPendingApprovals()
    } catch (error) {
      console.error("Error approving registration:", error)
      toast({
        title: "Error",
        description: "Failed to approve registration.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (approvalId: string) => {
    setProcessingId(approvalId)
    try {
      // Get current admin ID
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error("Not authenticated")
      }
      
      // Use server action
      const { success, error } = await rejectUserRegistration(approvalId, session.user.id)
      
      if (!success) throw error
      
      toast({
        title: "Rejected",
        description: "Registration has been rejected.",
        variant: "default",
      })
      
      // Refresh the list
      fetchPendingApprovals()
    } catch (error) {
      console.error("Error rejecting registration:", error)
      toast({
        title: "Error",
        description: "Failed to reject registration.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <Button onClick={fetchPendingApprovals} variant="outline">
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Registration Approvals</CardTitle>
          <CardDescription>Approve or reject pending user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pendingApprovals.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No pending approvals</h3>
              <p className="text-gray-500">There are no pending registration approvals at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-md p-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-lg">
                          {approval.user?.first_name} {approval.user?.last_name}
                        </h3>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          {approval.status}
                        </Badge>
                      </div>
                      <p className="text-gray-500">{approval.user?.email}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {approval.requested_role}
                        </Badge>
                        <span className="text-sm text-gray-500 ml-2">
                          Requested {new Date(approval.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                        onClick={() => handleApprove(approval.id, approval.user_id)}
                        disabled={!!processingId}
                      >
                        {processingId === approval.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                        onClick={() => handleReject(approval.id)}
                        disabled={!!processingId}
                      >
                        {processingId === approval.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 