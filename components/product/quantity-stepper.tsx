"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QuantityStepperProps {
  initialQuantity?: number
  min?: number
  max?: number
  onQuantityChange?: (quantity: number) => void
  className?: string
}

export function QuantityStepper({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onQuantityChange,
  className,
}: QuantityStepperProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || min
    const clampedValue = Math.max(min, Math.min(max, value))
    setQuantity(clampedValue)
    onQuantityChange?.(clampedValue)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="h-8 w-8 bg-transparent"
      >
        <Minus className="h-3 w-3" />
      </Button>

      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 text-center h-8"
      />

      <Button variant="outline" size="icon" onClick={handleIncrease} disabled={quantity >= max} className="h-8 w-8">
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
