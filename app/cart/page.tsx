"use client"

import { useRouter } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-store"
import { ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    router.push("/search")
  }

  if (items.length === 0) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button onClick={handleContinueShopping}>Continue Shopping</Button>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Continue Shopping */}
              <div className="pt-6">
                <Button variant="outline" onClick={handleContinueShopping}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div>
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </PageShell>
  )
}
