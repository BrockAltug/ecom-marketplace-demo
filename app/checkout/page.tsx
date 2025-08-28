"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-store"
import { useAuth } from "@/lib/auth-store"
import { CheckCircle, Gift, Zap, Shield, CreditCard, Truck } from "lucide-react"

const steps = [
  { id: "shipping", title: "Shipping", description: "Address & method" },
  { id: "payment", title: "Payment", description: "Card & billing" },
  { id: "review", title: "Review", description: "Confirm order" },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState("shipping")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [useExpressCheckout, setUseExpressCheckout] = useState(false)
  const { state, dispatch } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const handleStepComplete = (step: string) => {
    setCompletedSteps((prev) => [...prev, step])

    if (step === "shipping") {
      setCurrentStep("payment")
    } else if (step === "payment") {
      setCurrentStep("review")
    }
  }

  const handleBackToCart = () => {
    router.push("/cart")
  }

  const handleBackToShipping = () => {
    setCurrentStep("shipping")
  }

  const handleBackToPayment = () => {
    setCurrentStep("payment")
  }

  const handlePlaceOrder = () => {
    setOrderPlaced(true)
    // Clear cart after order
    setTimeout(() => {
      dispatch({ type: "CLEAR_CART" })
    }, 2000)
  }

  const handleExpressCheckout = () => {
    setUseExpressCheckout(true)
    setOrderPlaced(true)
    setTimeout(() => {
      dispatch({ type: "CLEAR_CART" })
    }, 1500)
  }

  if (state.items.length === 0 && !orderPlaced) {
    router.push("/cart")
    return null
  }

  if (orderPlaced) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order #MP-2024-{Math.floor(Math.random() * 1000)} has been confirmed and
              will be shipped soon.
            </p>

            <Card className="mb-6 text-left">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Express Delivery</span>
                  <Badge variant="secondary" className="text-xs">
                    Tomorrow
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-accent" />
                  <span className="text-sm">+50 loyalty points earned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="text-sm">Purchase protection included</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => router.push("/account/orders")} className="w-full" disabled>
                Track Your Order
              </Button>
              <Button variant="outline" onClick={() => router.push("/account/loyalty")} className="w-full" disabled>
                View Loyalty Points
              </Button>
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Checkout</h1>

        {user && state.items.length === 1 && (
          <div className="mb-8">
            <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold">Express Checkout Available</p>
                      <p className="text-sm text-muted-foreground">
                        Skip the forms and checkout instantly with saved details
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleExpressCheckout} className="bg-yellow-600 hover:bg-yellow-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Express Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <CheckoutSteps steps={steps} currentStep={currentStep} completedSteps={completedSteps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <ShippingForm onNext={() => handleStepComplete("shipping")} onBack={handleBackToCart} />
            )}

            {currentStep === "payment" && (
              <PaymentForm onNext={() => handleStepComplete("payment")} onBack={handleBackToShipping} />
            )}

            {currentStep === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Main Street
                      <br />
                      Apartment 4B
                      <br />
                      New York, NY 10001
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">•••• •••• •••• 3456</span>
                    </div>
                  </div>

                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Gift className="h-4 w-4 text-accent" />
                      Premium Benefits
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        <span>Purchase protection included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-3 w-3" />
                        <span>Free express shipping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gift className="h-3 w-3" />
                        <span>Earn 2x loyalty points</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBackToPayment}>
                      Back to Payment
                    </Button>
                    <Button onClick={handlePlaceOrder} className="bg-accent hover:bg-accent/90">
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <CartSummary showCheckoutButton={false} />

            {user && (
              <Card className="mt-4 border-accent/20 bg-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">You'll earn</span>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      {Math.floor(state.items.reduce((sum, item) => sum + item.price * item.quantity, 0))} points
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
