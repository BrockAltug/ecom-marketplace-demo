"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Calendar, Package, CreditCard, Settings } from "lucide-react"

interface Subscription {
  id: string
  productTitle: string
  productImage: string
  price: number
  frequency: "weekly" | "monthly" | "quarterly"
  nextDelivery: Date
  status: "active" | "paused" | "cancelled"
  savings: number
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "sub-1",
      productTitle: "Premium Coffee Beans",
      productImage: "/placeholder.svg",
      price: 24.99,
      frequency: "monthly",
      nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "active",
      savings: 15,
    },
    {
      id: "sub-2",
      productTitle: "Organic Dog Food",
      productImage: "/placeholder.svg",
      price: 45.99,
      frequency: "monthly",
      nextDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "paused",
      savings: 20,
    },
  ])

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: sub.status === "active" ? "paused" : "active" } : sub)),
    )
  }

  const updateFrequency = (id: string, frequency: "weekly" | "monthly" | "quarterly") => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, frequency } : sub)))
  }

  const getStatusColor = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "paused":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Subscriptions</h2>
          <p className="text-muted-foreground">Manage your recurring orders and save money</p>
        </div>
        <Button variant="outline" className="bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Subscription Benefits */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Package className="h-6 w-6 mx-auto text-accent mb-2" />
              <p className="font-semibold">Never Run Out</p>
              <p className="text-sm text-muted-foreground">Automatic deliveries</p>
            </div>
            <div>
              <Badge className="h-6 w-6 mx-auto text-accent mb-2 bg-transparent border-accent text-accent">%</Badge>
              <p className="font-semibold">Save Up to 25%</p>
              <p className="text-sm text-muted-foreground">Exclusive subscriber pricing</p>
            </div>
            <div>
              <Settings className="h-6 w-6 mx-auto text-accent mb-2" />
              <p className="font-semibold">Full Control</p>
              <p className="text-sm text-muted-foreground">Pause, skip, or cancel anytime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={subscription.productImage || "/placeholder.svg"}
                  alt={subscription.productTitle}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{subscription.productTitle}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="bg-transparent">
                          Save {subscription.savings}%
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">${subscription.price}</p>
                      <p className="text-sm text-muted-foreground">per {subscription.frequency.slice(0, -2)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Next Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription.nextDelivery.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Frequency</p>
                        <Select
                          value={subscription.frequency}
                          onValueChange={(value: "weekly" | "monthly" | "quarterly") =>
                            updateFrequency(subscription.id, value)
                          }
                        >
                          <SelectTrigger className="w-full h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Payment</p>
                        <p className="text-sm text-muted-foreground">•••• 3456</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={subscription.status === "active"}
                          onCheckedChange={() => toggleSubscription(subscription.id)}
                        />
                        <span className="text-sm">{subscription.status === "active" ? "Active" : "Paused"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Skip Next
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Modify
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Subscription */}
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Add New Subscription</h3>
          <p className="text-muted-foreground mb-4">
            Browse products and set up automatic deliveries to save time and money
          </p>
          <Button variant="outline" className="bg-transparent">
            Browse Products
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
