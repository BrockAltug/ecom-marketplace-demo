"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, X } from "lucide-react"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useCartStore } from "@/lib/cart-store"

interface WishlistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WishlistModal({ open, onOpenChange }: WishlistModalProps) {
  const { items, removeItem, clearWishlist, getItemCount } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      brand: item.brand,
      price: item.price,
      image: item.image,
      quantity: 1,
      variants: {},
    })
  }

  const handleRemoveFromWishlist = (id: string) => {
    removeItem(id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              My Wishlist
              <Badge variant="secondary">{getItemCount()} items</Badge>
            </div>
            {items.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearWishlist}>
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Save items you love by clicking the heart icon on any product
              </p>
              <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-6 w-6 bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-lg font-bold text-primary">${item.price}</p>

                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRemoveFromWishlist(item.id)}>
                        <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex-shrink-0 border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Total: {getItemCount()} item{getItemCount() !== 1 ? "s" : ""} saved
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => {
                    // Add all items to cart
                    items.forEach((item) => handleAddToCart(item))
                    clearWishlist()
                    onOpenChange(false)
                  }}
                >
                  Add All to Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
