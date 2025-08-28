"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, Package, TrendingDown, Star, Gift, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "price_drop" | "back_in_stock" | "new_review" | "deal" | "shipping" | "recommendation"
  title: string
  message: string
  timestamp: Date
  productId?: string
  productImage?: string
  actionLabel?: string
  urgent?: boolean
}

export function AdvancedNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Simulate real-time notifications
    const generateNotification = () => {
      const types: Notification["type"][] = [
        "price_drop",
        "back_in_stock",
        "new_review",
        "deal",
        "shipping",
        "recommendation",
      ]
      const type = types[Math.floor(Math.random() * types.length)]

      const notificationTemplates = {
        price_drop: {
          title: "Price Drop Alert!",
          message: "Wireless Headphones dropped to $79.99 (was $99.99)",
          productImage: "/wireless-headphones.png",
          actionLabel: "View Deal",
          urgent: true,
        },
        back_in_stock: {
          title: "Back in Stock",
          message: "iPhone 15 Pro is now available",
          productImage: "/placeholder.svg",
          actionLabel: "Buy Now",
        },
        new_review: {
          title: "New 5-Star Review",
          message: "Smart Watch received a glowing review",
          productImage: "/fitness-tracker-lifestyle.png",
          actionLabel: "Read Review",
        },
        deal: {
          title: "Flash Sale",
          message: "24-hour deal: 40% off Electronics",
          actionLabel: "Shop Now",
          urgent: true,
        },
        shipping: {
          title: "Order Shipped",
          message: "Your order #12345 is on the way",
          actionLabel: "Track Package",
        },
        recommendation: {
          title: "Recommended for You",
          message: "Based on your recent purchases",
          actionLabel: "View Items",
        },
      }

      const template = notificationTemplates[type]
      const newNotification: Notification = {
        id: Date.now().toString(),
        type,
        title: template.title,
        message: template.message,
        timestamp: new Date(),
        productImage: template.productImage,
        actionLabel: template.actionLabel,
        urgent: template.urgent,
      }

      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 notifications
    }

    // Generate initial notifications
    setTimeout(generateNotification, 2000)
    setTimeout(generateNotification, 5000)
    setTimeout(generateNotification, 8000)

    // Generate periodic notifications
    const interval = setInterval(generateNotification, 15000 + Math.random() * 20000)

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "price_drop":
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case "back_in_stock":
        return <Package className="h-4 w-4 text-blue-600" />
      case "new_review":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "deal":
        return <Gift className="h-4 w-4 text-red-600" />
      case "shipping":
        return <Package className="h-4 w-4 text-purple-600" />
      case "recommendation":
        return <Zap className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-20 right-6 z-40">
        <Button variant="secondary" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative shadow-lg">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{notifications.length}</Badge>
          )}
        </Button>
      </div>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="fixed top-16 right-6 z-50 w-80 max-h-96 overflow-y-auto">
          <Card className="shadow-xl">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors",
                      notification.urgent && "bg-red-50 border-l-4 border-l-red-500",
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-2"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {notification.actionLabel && (
                          <Button variant="outline" size="sm" className="mt-2 h-7 text-xs bg-transparent">
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>

                      {notification.productImage && (
                        <img
                          src={notification.productImage || "/placeholder.svg"}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                    </div>
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
