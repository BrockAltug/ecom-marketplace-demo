"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface LiveInventoryTrackerProps {
  productId: string
  initialStock?: number
  className?: string
}

export function LiveInventoryTracker({ productId, initialStock = 100, className }: LiveInventoryTrackerProps) {
  const [stock, setStock] = useState(initialStock)
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")
  const [recentPurchases, setRecentPurchases] = useState(0)

  useEffect(() => {
    // Simulate real-time inventory updates
    const interval = setInterval(
      () => {
        const change = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0

        setStock((prev) => {
          const newStock = Math.max(0, Math.min(100, prev + change))

          if (change > 0) setTrend("up")
          else if (change < 0) {
            setTrend("down")
            setRecentPurchases((p) => p + Math.abs(change))
          } else setTrend("stable")

          return newStock
        })
      },
      5000 + Math.random() * 10000,
    ) // Random intervals between 5-15 seconds

    return () => clearInterval(interval)
  }, [])

  const stockPercentage = (stock / initialStock) * 100
  const isLowStock = stockPercentage < 20
  const isOutOfStock = stock === 0

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Stock Status</span>
        </div>

        <div className="flex items-center gap-1">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
          {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}

          <Badge
            variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "default"}
            className={cn("text-xs", !isOutOfStock && !isLowStock && "bg-green-100 text-green-800 hover:bg-green-100")}
          >
            {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
          </Badge>
        </div>
      </div>

      <div className="space-y-1">
        <Progress
          value={stockPercentage}
          className={cn("h-2", isLowStock && "bg-red-100", isOutOfStock && "bg-red-200")}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{stock} units available</span>
          {recentPurchases > 0 && (
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {recentPurchases} sold recently
            </span>
          )}
        </div>
      </div>

      {isLowStock && !isOutOfStock && (
        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 p-2 rounded">
          <AlertTriangle className="h-3 w-3" />
          <span>Only {stock} left - order soon!</span>
        </div>
      )}
    </div>
  )
}
