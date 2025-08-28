"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Share2, Scale, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/mobile-drawer"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/search-utils"

interface MobileProductActionsProps {
  product: Product
  onAddToCart: () => void
  onAddToWishlist: () => void
  onQuickView: () => void
  onShare: () => void
  onCompare: () => void
  isInWishlist: boolean
  isInComparison: boolean
  canAddToComparison: boolean
}

export function MobileProductActions({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onShare,
  onCompare,
  isInWishlist,
  isInComparison,
  canAddToComparison,
}: MobileProductActionsProps) {
  const [open, setOpen] = useState(false)

  const actions = [
    {
      icon: ShoppingCart,
      label: "Add to Cart",
      action: () => {
        onAddToCart()
        setOpen(false)
      },
      primary: true,
    },
    {
      icon: Heart,
      label: isInWishlist ? "Remove from Wishlist" : "Add to Wishlist",
      action: () => {
        onAddToWishlist()
        setOpen(false)
      },
      active: isInWishlist,
    },
    {
      icon: Eye,
      label: "Quick View",
      action: () => {
        onQuickView()
        setOpen(false)
      },
    },
    {
      icon: Scale,
      label: isInComparison ? "Remove from Compare" : "Add to Compare",
      action: () => {
        onCompare()
        setOpen(false)
      },
      active: isInComparison,
      disabled: !canAddToComparison && !isInComparison,
    },
    {
      icon: Share2,
      label: "Share Product",
      action: () => {
        onShare()
        setOpen(false)
      },
    },
  ]

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden bg-transparent border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
        >
          Actions
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left">{product.title}</DrawerTitle>
          <p className="text-sm text-muted-foreground text-left">
            by {product.brand} • ${product.price}
          </p>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <div className="grid gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.primary ? "default" : "outline"}
                size="lg"
                className={cn(
                  "justify-start h-12 text-left",
                  action.active && "bg-primary/10 border-primary text-primary",
                )}
                onClick={action.action}
                disabled={action.disabled}
              >
                <action.icon className="h-5 w-5 mr-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
