"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Variant {
  type: string
  options: string[]
}

interface VariantPickerProps {
  variants: Variant[]
  onVariantChange?: (variant: string, option: string) => void
  className?: string
}

export function VariantPicker({ variants, onVariantChange, className }: VariantPickerProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  const handleVariantSelect = (variantType: string, option: string) => {
    const newSelection = { ...selectedVariants, [variantType]: option }
    setSelectedVariants(newSelection)
    onVariantChange?.(variantType, option)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {variants.map((variant) => (
        <div key={variant.type}>
          <h4 className="font-medium mb-2 capitalize">
            {variant.type}:{" "}
            {selectedVariants[variant.type] && (
              <span className="text-muted-foreground font-normal">{selectedVariants[variant.type]}</span>
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => {
              const isSelected = selectedVariants[variant.type] === option

              if (variant.type === "color") {
                return (
                  <Button
                    key={option}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVariantSelect(variant.type, option)}
                    className={cn("min-w-[60px]", isSelected && "ring-2 ring-accent ring-offset-2")}
                  >
                    {option}
                  </Button>
                )
              }

              return (
                <Button
                  key={option}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVariantSelect(variant.type, option)}
                  className={cn(isSelected && "ring-2 ring-accent ring-offset-2")}
                >
                  {option}
                </Button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
