"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, CreditCard, MapPin, Truck, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-store"
import type { Product } from "@/lib/search-utils"

interface OneClickBuyProps {
  product: Product
  className?: string
}

export function OneClickBuy({ product, className }: OneClickBuyProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const { user } = useAuth()

  const handleOneClickBuy = async () => {
    if (!user) return

    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)

      // Reset after showing success
      setTimeout(() => {
        setOrderComplete(false)
      }, 3000)
    }, 2000)
  }

  if (!user) return null

  if (orderComplete) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Order Placed!</p>
              <p className="text-sm text-green-600">Arriving tomorrow by 2 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-accent/20 bg-accent/5 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg">One-Click Buy</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            Express
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>•••• •••• •••• 3456</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>123 Main St, New York, NY</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span>Tomorrow delivery by 2 PM</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-bold text-accent">${product.price}</span>
          </div>

          <Button onClick={handleOneClickBuy} disabled={isProcessing} className="w-full bg-accent hover:bg-accent/90">
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent-foreground/20 border-t-accent-foreground rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Buy Now - ${product.price}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
