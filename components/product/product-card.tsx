"use client"

import type React from "react"

import { useState } from "react"
import { Star, Heart, ShoppingCart, Eye, Scale, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuickViewModal } from "./quick-view-modal"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useComparisonStore } from "@/lib/comparison-store"
import { useRecentlyViewedStore } from "@/lib/recently-viewed-store"
import { useCartStore } from "@/lib/cart-store"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/search-utils"

interface ProductCardProps {
  product: Product
  className?: string
  showQuickActions?: boolean
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, className, showQuickActions = true, viewMode = "grid" }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showQuickView, setShowQuickView] = useState(false)

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const {
    addItem: addToComparison,
    removeItem: removeFromComparison,
    isInComparison,
    canAddMore,
  } = useComparisonStore()
  const { addItem: addToRecentlyViewed } = useRecentlyViewedStore()
  const { addItem: addToCart } = useCartStore()

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image: product.images[0],
      })
    }
  }

  const handleComparison = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInComparison(product.id)) {
      removeFromComparison(product.id)
    } else if (canAddMore()) {
      addToComparison({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        listPrice: product.listPrice,
        rating: product.rating,
        image: product.images[0],
        category: product.category,
        specs: product.specs,
      })
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      variants: {},
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  const handleCardClick = () => {
    addToRecentlyViewed({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
    })

    // Navigate to product page (non-functional in demo)
    window.location.href = `/product/${product.id}`
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} by ${product.brand}`,
          url: `/product/${product.id}`,
        })
      } catch (err) {
        navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`)
    }
  }

  const discountPercentage = Math.round(((product.listPrice - product.price) / product.listPrice) * 100)

  if (viewMode === "list") {
    return (
      <>
        <Card
          className={cn("group cursor-pointer hover:shadow-lg transition-all duration-200", className)}
          onClick={handleCardClick}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex gap-3 sm:gap-4">
              {/* Image */}
              <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onMouseEnter={() => {
                    if (product.images.length > 1) {
                      setCurrentImageIndex(1)
                    }
                  }}
                  onMouseLeave={() => setCurrentImageIndex(0)}
                />

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <Badge variant="destructive" className="absolute top-1 left-1 text-xs">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  {showQuickActions && (
                    <div className="flex gap-1 ml-2 sm:ml-4">
                      <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8" onClick={handleWishlist}>
                        <Heart
                          className={cn(
                            "h-3 w-3 sm:h-4 sm:w-4",
                            isInWishlist(product.id) && "fill-red-500 text-red-500",
                          )}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 sm:h-8 sm:w-8 hidden sm:flex"
                        onClick={handleComparison}
                        disabled={!canAddMore() && !isInComparison(product.id)}
                      >
                        <Scale className={cn("h-4 w-4", isInComparison(product.id) && "text-primary")} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 sm:h-8 sm:w-8 hidden sm:flex"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-2.5 w-2.5 sm:h-3 sm:w-3",
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {product.rating} ({product.reviews.toLocaleString()})
                  </span>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold">${product.price}</span>
                    {product.listPrice > product.price && (
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        ${product.listPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
                      onClick={handleQuickView}
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Quick View</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9" onClick={handleAddToCart}>
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <QuickViewModal product={product} open={showQuickView} onOpenChange={setShowQuickView} />
      </>
    )
  }

  return (
    <>
      <Card
        className={cn("group cursor-pointer hover:shadow-lg transition-all duration-200", className)}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              onMouseEnter={() => {
                if (product.images.length > 1) {
                  setCurrentImageIndex(1)
                }
              }}
              onMouseLeave={() => setCurrentImageIndex(0)}
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {showQuickActions && (
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleWishlist}>
                  <Heart
                    className={cn("h-3 w-3 sm:h-4 sm:w-4", isInWishlist(product.id) && "fill-red-500 text-red-500")}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex"
                  onClick={handleComparison}
                  disabled={!canAddMore() && !isInComparison(product.id)}
                >
                  <Scale className={cn("h-4 w-4", isInComparison(product.id) && "text-primary")} />
                </Button>
                <Button size="icon" variant="secondary" className="h-7 w-7 sm:h-8 sm:w-8" onClick={handleQuickView}>
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Shipping Badge */}
            {product.shipping === "Free" && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="text-xs bg-background/90">
                  Free Shipping
                </Badge>
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4">
            <div className="mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">{product.brand}</p>
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-accent transition-colors">
                {product.title}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-2.5 w-2.5 sm:h-3 sm:w-3",
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {product.rating} ({product.reviews.toLocaleString()})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base sm:text-lg font-bold">${product.price}</span>
              {product.listPrice > product.price && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">${product.listPrice}</span>
              )}
            </div>

            {showQuickActions && (
              <Button
                className="w-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-sm h-9"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <QuickViewModal product={product} open={showQuickView} onOpenChange={setShowQuickView} />
    </>
  )
}
