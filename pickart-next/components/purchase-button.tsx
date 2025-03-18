"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArtworkWithDetails } from "@/lib/art"

type PurchaseButtonProps = {
  artPiece: ArtworkWithDetails
}

type DeliveryMethod = "delivery" | "pickup"

export default function PurchaseButton({ artPiece }: PurchaseButtonProps) {
  const [open, setOpen] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)

    // Mock checkout process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would redirect to Stripe checkout
    alert(`Processing ${deliveryMethod} for "${artPiece.title}". In a real app, this would redirect to Stripe.`)

    setIsProcessing(false)
    setOpen(false)
  }

  return (
    <>
      <Button 
        className="w-full py-6 text-lg" 
        onClick={() => setOpen(true)}
        type="button"
      >
        Purchase
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>Select your preferred delivery method for "{artPiece.title}".</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup value={deliveryMethod} onValueChange={(value: DeliveryMethod) => setDeliveryMethod(value)} className="space-y-4">
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="delivery" id="delivery" />
                <div className="grid gap-1.5">
                  <Label htmlFor="delivery" className="font-medium">
                    Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    We'll ship the artwork to your address. Shipping costs will be calculated at checkout.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="pickup" id="pickup" />
                <div className="grid gap-1.5">
                  <Label htmlFor="pickup" className="font-medium">
                    Self-Pickup
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Pick up the artwork from our gallery location. No additional fees.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              disabled={isProcessing}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCheckout} 
              disabled={isProcessing}
              type="button"
            >
              {isProcessing ? "Processing..." : "Continue to Checkout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

