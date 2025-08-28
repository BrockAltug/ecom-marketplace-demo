"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { MobileProductActions } from "./mobile-product-actions"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/search-utils"

interface TouchOptimizedCardProps {
  product: Product
  onAddToCart: () => void
  onAddToWishlist: () => void
  onQuickView: () => void
  onShare: () => void
  onCompare: () => void
  isInWishlist: boolean
  isInComparison: boolean
  canAddToComparison: boolean
  onClick: () => void
}

export function TouchOptimizedCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onShare,
  onCompare,
  isInWishlist,
  isInComparison,
  canAddToComparison,
  onClick,
}: TouchOptimizedCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }
  }

  const discountPercentage = Math.round(((product.listPrice - product.price) / product.listPrice) * 100)

  return (
    <Card
      ref={cardRef}
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 touch-manipulation"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <div className="relative" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <img
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-200"
            />

            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.badges.slice(0, 2).map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs font-medium">
                {badge}
              </Badge>
            ))}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-xs font-medium">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 shadow-md"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToWishlist()
              }}
            >
              <Heart className={cn("h-4 w-4", isInWishlist && "fill-red-500 text-red-500")} />
            </Button>
          </div>

          {/* Shipping Badge */}
          {product.shipping === "Free" && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="text-xs bg-background/90 font-medium">
                Free Shipping
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-3">
            <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-accent transition-colors leading-tight">
              {product.title}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn("w-3 h-3 rounded-sm", i < Math.floor(product.rating) ? "bg-yellow-400" : "bg-muted")}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {product.rating} ({product.reviews.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">${product.price}</span>
            {product.listPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">${product.listPrice}</span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 h-11 font-medium"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart()
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>

            <MobileProductActions
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onQuickView={onQuickView}
              onShare={onShare}
              onCompare={onCompare}
              isInWishlist={isInWishlist}
              isInComparison={isInComparison}
              canAddToComparison={canAddToComparison}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
