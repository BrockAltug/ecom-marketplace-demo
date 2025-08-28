"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImageGallery } from "./image-gallery"
import { RatingStars } from "./rating-stars"
import { PriceDisplay } from "./price-display"
import { VariantPicker } from "./variant-picker"
import { QuantityStepper } from "./quantity-stepper"
import { Heart, ShoppingCart, Share2, Scale, Eye } from "lucide-react"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useComparisonStore } from "@/lib/comparison-store"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/lib/search-utils"

interface QuickViewModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const {
    addItem: addToComparison,
    removeItem: removeFromComparison,
    isInComparison,
    canAddMore,
  } = useComparisonStore()
  const { addItem: addToCart } = useCartStore()

  if (!product) return null

  const handleWishlist = () => {
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

  const handleComparison = () => {
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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      quantity,
      variants: selectedVariants,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} by ${product.brand}`,
          url: `/product/${product.id}`,
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View: {product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <ImageGallery images={product.images} alt={product.title} />

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
              <div className="flex items-center gap-4 mb-4">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>

            <PriceDisplay price={product.price} listPrice={product.listPrice} />

            <p className="text-muted-foreground">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <VariantPicker
                    key={variant.type}
                    type={variant.type}
                    options={variant.options}
                    selected={selectedVariants[variant.type]}
                    onSelect={(value) => setSelectedVariants((prev) => ({ ...prev, [variant.type]: value }))}
                  />
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={handleWishlist}>
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                  {isInWishlist(product.id) ? "Saved" : "Save"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleComparison}
                  disabled={!canAddMore() && !isInComparison(product.id)}
                >
                  <Scale className="h-4 w-4 mr-2" />
                  {isInComparison(product.id) ? "Added" : "Compare"}
                </Button>

                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shipping Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Shipping:</span>
                <span className="font-medium">{product.shipping === "Free" ? "Free Shipping" : product.shipping}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>Seller:</span>
                <span className="font-medium">{product.seller}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => onOpenChange(false)}>
              <Eye className="h-4 w-4 mr-2" />
              View Full Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
