"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-store"

interface CartItemProps {
  item: {
    id: string
    title: string
    brand: string
    image: string
    price: number
    listPrice: number
    quantity: number
    variant?: string
    size?: string
    color?: string
  }
}

export function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart()
  const [quantity, setQuantity] = useState(item.quantity)

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity)
      dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: newQuantity } })
    }
  }

  const removeItem = () => {
    dispatch({ type: "REMOVE_ITEM", payload: item.id })
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    updateQuantity(value)
  }

  return (
    <div className="flex gap-4 py-6 border-b">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.brand}</p>

            {/* Variants */}
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              {item.color && <span>Color: {item.color}</span>}
              {item.size && <span>Size: {item.size}</span>}
              {item.variant && <span>{item.variant}</span>}
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={removeItem}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
            {item.listPrice > item.price && (
              <span className="text-sm text-muted-foreground line-through">${item.listPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max="99"
              className="w-16 text-center h-8"
            />

            <Button variant="outline" size="icon" onClick={() => updateQuantity(quantity + 1)} className="h-8 w-8">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Item Total */}
        <div className="mt-2 text-right">
          <span className="font-semibold">Subtotal: ${(item.price * quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
