"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Scale, X, Star, ShoppingCart } from "lucide-react"
import { useComparisonStore } from "@/lib/comparison-store"
import { useCartStore } from "@/lib/cart-store"

export function ProductComparisonTool() {
  const { items, removeItem, clearAll } = useComparisonStore()
  const { addItem: addToCart } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)

  if (items.length === 0) return null

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: 1,
      variants: {},
    })
  }

  const getComparisonFeatures = () => {
    const allSpecs = new Set<string>()
    items.forEach((item) => {
      if (item.specs) {
        Object.keys(item.specs).forEach((spec) => allSpecs.add(spec))
      }
    })
    return Array.from(allSpecs)
  }

  const features = getComparisonFeatures()

  return (
    <>
      {/* Floating Comparison Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Scale className="h-6 w-6" />
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs">{items.length}</Badge>
        </Button>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Product Comparison ({items.length}/4)
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeItem(product.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />

                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold">${product.price}</span>
                      {product.listPrice && product.listPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">${product.listPrice}</span>
                      )}
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2 mb-4">
                      {features.map((feature) => (
                        <div key={feature} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{feature}:</span>
                          <span className="font-medium">
                            {product.specs?.[feature] || <X className="h-3 w-3 text-muted-foreground inline" />}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button size="sm" className="w-full" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
