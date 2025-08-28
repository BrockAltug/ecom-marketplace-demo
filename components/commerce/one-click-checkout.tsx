"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Zap, CreditCard, MapPin, Truck, Shield, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-store"

interface OneClickCheckoutProps {
  productId: string
  productTitle: string
  productPrice: number
  productImage: string
  className?: string
}

export function OneClickCheckout({
  productId,
  productTitle,
  productPrice,
  productImage,
  className,
}: OneClickCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const { user } = useAuth()

  const handleOneClickBuy = async () => {
    if (!user) return

    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setOrderComplete(true)

    // Reset after 3 seconds
    setTimeout(() => setOrderComplete(false), 3000)
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">Sign in for one-click purchasing</p>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (orderComplete) {
    return (
      <Card className={`${className} border-green-200 bg-green-50`}>
        <CardContent className="p-4 text-center">
          <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <p className="font-semibold text-green-800 mb-1">Order Placed!</p>
          <p className="text-xs text-green-700">Confirmation sent to your email</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4 text-yellow-500" />
          One-Click Buy
          <Badge variant="secondary" className="text-xs">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Summary */}
        <div className="flex gap-3">
          <img src={productImage || "/placeholder.svg"} alt={productTitle} className="w-12 h-12 object-cover rounded" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm line-clamp-2">{productTitle}</p>
            <p className="text-lg font-bold">${productPrice}</p>
          </div>
        </div>

        <Separator />

        {/* Saved Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Default Address</p>
              <p className="text-muted-foreground">123 Main St, New York, NY</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Saved Payment</p>
              <p className="text-muted-foreground">•••• •••• •••• 3456</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Express Shipping</p>
              <p className="text-muted-foreground">Arrives tomorrow</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center font-semibold">
          <span>Total:</span>
          <span>${(productPrice + 9.99).toFixed(2)}</span>
        </div>

        {/* Buy Button */}
        <Button
          onClick={handleOneClickBuy}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Buy Now - ${(productPrice + 9.99).toFixed(2)}
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Secure checkout • 30-day returns</span>
        </div>
      </CardContent>
    </Card>
  )
}
