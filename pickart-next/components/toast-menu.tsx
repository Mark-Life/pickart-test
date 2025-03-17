"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Bell, Check, Info, AlertTriangle, X, ShoppingCart, Heart, MessageCircle } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function ToastMenu() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: "Success!",
      description: "Your art piece has been added to cart.",
    })
    setOpen(false)
  }

  const showErrorToast = () => {
    toast({
      variant: "destructive",
      title: "Error!",
      description: "There was a problem with your request.",
    })
    setOpen(false)
  }

  const showInfoToast = () => {
    toast({
      variant: "info",
      title: "Information",
      description: "New art pieces are available in your area.",
    })
    setOpen(false)
  }

  const showWarningToast = () => {
    toast({
      variant: "warning",
      title: "Warning",
      description: "Your session will expire in 5 minutes.",
    })
    setOpen(false)
  }

  const showCartToast = () => {
    toast({
      title: "Added to Cart",
      description: "Sunset Horizon has been added to your cart.",
      action: (
        <Button variant="outline" size="sm" onClick={() => console.log("View cart")}>
          View Cart
        </Button>
      ),
    })
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] rounded-t-xl">
        <SheetHeader className="text-left">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Choose a notification type to display</SheetDescription>
        </SheetHeader>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={showSuccessToast}
          >
            <Check className="h-6 w-6 text-green-500" />
            <span>Success</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={showErrorToast}
          >
            <X className="h-6 w-6 text-red-500" />
            <span>Error</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={showInfoToast}
          >
            <Info className="h-6 w-6 text-blue-500" />
            <span>Information</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={showWarningToast}
          >
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <span>Warning</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={showCartToast}
          >
            <ShoppingCart className="h-6 w-6 text-purple-500" />
            <span>Cart</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => {
              toast({
                title: "Liked!",
                description: "You've liked Serene Forest.",
              })
              setOpen(false)
            }}
          >
            <Heart className="h-6 w-6 text-pink-500" />
            <span>Like</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => {
              toast({
                title: "New Message",
                description: "You have a new message from Emma Johnson.",
              })
              setOpen(false)
            }}
          >
            <MessageCircle className="h-6 w-6 text-indigo-500" />
            <span>Message</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

