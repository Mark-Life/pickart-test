"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"
import { signOut } from "@/app/auth/actions"

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  redirectTo?: string
}

export default function SignOutButton({
  variant = "default",
  size = "default",
  className,
  redirectTo = "/",
}: SignOutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)

    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
        variant: "destructive",
      })
      router.push(redirectTo)
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? (
        "Signing out..."
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </>
      )}
    </Button>
  )
}

