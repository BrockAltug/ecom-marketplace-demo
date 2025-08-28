"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-store"
import { Tag, Truck } from "lucide-react"

interface CartSummaryProps {
  showCheckoutButton?: boolean
  onCheckout?: () => void
}

export function CartSummary({ showCheckoutButton = true, onCheckout }: CartSummaryProps) {
  const { state, dispatch } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const applyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toLowerCase() === "save10") {
      dispatch({ type: "APPLY_COUPON", payload: { code: couponCode, discount: 10 } })
      setCouponApplied(true)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coupon Code */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponApplied}
            />
            <Button variant="outline" onClick={applyCoupon} disabled={!couponCode || couponApplied}>
              <Tag className="h-4 w-4 mr-1" />
              Apply
            </Button>
          </div>
          {couponApplied && <p className="text-sm text-green-600">Coupon applied successfully!</p>}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal ({state.items.length} items)</span>
            <span>${state.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              <span>Shipping</span>
            </div>
            <span className={state.shipping === 0 ? "text-green-600" : ""}>
              {state.shipping === 0 ? "FREE" : `$${state.shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>${state.tax.toFixed(2)}</span>
          </div>

          {state.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${state.discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${state.total.toFixed(2)}</span>
        </div>

        {/* Free Shipping Notice */}
        {state.shipping > 0 && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            Add ${(50 - state.subtotal).toFixed(2)} more for free shipping
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <Button className="w-full" size="lg" onClick={onCheckout} disabled={state.items.length === 0}>
            Proceed to Checkout
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
