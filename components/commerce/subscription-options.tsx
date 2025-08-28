"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { RefreshCw, Calendar, Percent, Truck } from "lucide-react"
import type { Product } from "@/lib/search-utils"

interface SubscriptionOptionsProps {
  product: Product
  onSubscribe?: (frequency: string, discount: number) => void
}

const subscriptionPlans = [
  { id: "weekly", label: "Weekly", discount: 5, savings: "Save 5%" },
  { id: "biweekly", label: "Every 2 weeks", discount: 10, savings: "Save 10%" },
  { id: "monthly", label: "Monthly", discount: 15, savings: "Save 15%" },
  { id: "quarterly", label: "Every 3 months", discount: 20, savings: "Save 20%" },
]

export function SubscriptionOptions({ product, onSubscribe }: SubscriptionOptionsProps) {
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const currentPlan = subscriptionPlans.find((plan) => plan.id === selectedPlan)
  const discountedPrice = currentPlan ? product.price * (1 - currentPlan.discount / 100) : product.price

  const handleSubscribe = async () => {
    if (!currentPlan) return

    setIsSubscribing(true)

    // Simulate subscription setup
    setTimeout(() => {
      setIsSubscribing(false)
      onSubscribe?.(selectedPlan, currentPlan.discount)
    }, 2000)
  }

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            Subscribe & Save
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Auto-delivery
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-background/50 transition-colors"
              >
                <RadioGroupItem value={plan.id} id={plan.id} />
                <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{plan.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {plan.savings}
                      </Badge>
                      <span className="font-bold">${(product.price * (1 - plan.discount / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="bg-background/50 p-3 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Percent className="h-4 w-4 text-green-600" />
            <span>Save ${(product.price - discountedPrice).toFixed(2)} per delivery</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-green-600" />
            <span>Free shipping on all subscription orders</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RefreshCw className="h-4 w-4 text-green-600" />
            <span>Cancel or modify anytime</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Subscription Price:</span>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">${discountedPrice.toFixed(2)}</span>
              <div className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</div>
            </div>
          </div>

          <Button onClick={handleSubscribe} disabled={isSubscribing} className="w-full bg-green-600 hover:bg-green-700">
            {isSubscribing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Setting up subscription...
              </div>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Subscribe Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
