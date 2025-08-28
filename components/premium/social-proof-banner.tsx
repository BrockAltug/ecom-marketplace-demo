"use client"

import { useState, useEffect } from "react"
import { ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const recentActivities = [
  { user: "Sarah M.", action: "purchased", item: "Wireless Headphones", location: "New York" },
  { user: "Mike R.", action: "added to cart", item: "Smart Watch", location: "California" },
  { user: "Emma L.", action: "purchased", item: "Yoga Mat", location: "Texas" },
  { user: "David K.", action: "purchased", item: "Coffee Maker", location: "Florida" },
  { user: "Lisa P.", action: "added to wishlist", item: "Designer Bag", location: "Illinois" },
]

export function SocialProofBanner() {
  const [currentActivity, setCurrentActivity] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % recentActivities.length)
      setIsVisible(false)
      setTimeout(() => setIsVisible(true), 100)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const activity = recentActivities[currentActivity]

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <div
        className={`bg-background border rounded-lg shadow-lg p-4 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              <span className="text-accent">{activity.user}</span> {activity.action}
            </p>
            <p className="text-xs text-muted-foreground truncate">{activity.item}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {activity.location}
              </Badge>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
