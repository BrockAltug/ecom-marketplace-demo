"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { ImageGallery } from "@/components/product/image-gallery"
import { RatingStars } from "@/components/product/rating-stars"
import { PriceDisplay } from "@/components/product/price-display"
import { VariantPicker } from "@/components/product/variant-picker"
import { QuantityStepper } from "@/components/product/quantity-stepper"
import { ProductCarousel } from "@/components/product/product-carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import products from "@/src/data/products.json"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const product = products.find((p) => p.id === productId)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </PageShell>
    )
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    // Non-functional add to cart
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <span>Home</span> / <span>Electronics</span> / <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <ImageGallery images={product.images} alt={product.title} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                <RatingStars rating={product.rating} size="lg" showValue />
                <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            <PriceDisplay price={product.price} listPrice={product.listPrice} size="lg" />

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Variants */}
            <VariantPicker variants={product.variants} />

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <QuantityStepper initialQuantity={quantity} onQuantityChange={setQuantity} />
                <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" onClick={handleWishlist}>
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <span className="text-sm">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm">2-year warranty included</span>
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sold by {product.seller}</p>
                    <p className="text-sm text-muted-foreground">Verified seller</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    View Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="specs" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reviews feature coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shipping Options</h4>
                  <p className="text-sm text-muted-foreground">
                    Free standard shipping on orders over $50. Express shipping available.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Return Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy. Items must be in original condition.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && <ProductCarousel title="Related Products" products={relatedProducts} />}
      </div>
    </PageShell>
  )
}
