import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  listPrice?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PriceDisplay({ price, listPrice, size = "md", className }: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  }

  const discountPercentage = listPrice && listPrice > price ? Math.round(((listPrice - price) / listPrice) * 100) : 0

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-bold", sizeClasses[size])}>${price.toFixed(2)}</span>
      {listPrice && listPrice > price && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through",
              size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm",
            )}
          >
            ${listPrice.toFixed(2)}
          </span>
          <span className="text-xs text-green-600 font-medium">Save {discountPercentage}%</span>
        </>
      )}
    </div>
  )
}
