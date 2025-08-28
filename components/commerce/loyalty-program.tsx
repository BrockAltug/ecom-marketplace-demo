"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, Gift, Crown, Zap, Trophy } from "lucide-react"
import { useAuth } from "@/lib/auth-store"

const loyaltyTiers = [
  {
    name: "Bronze",
    icon: Star,
    color: "text-amber-600",
    minPoints: 0,
    benefits: ["Free shipping on orders $50+", "Birthday discount"],
  },
  {
    name: "Silver",
    icon: Gift,
    color: "text-gray-500",
    minPoints: 1000,
    benefits: ["Free shipping on all orders", "Early access to sales", "5% cashback"],
  },
  {
    name: "Gold",
    icon: Crown,
    color: "text-yellow-500",
    minPoints: 2500,
    benefits: ["Priority customer support", "10% cashback", "Exclusive products"],
  },
  {
    name: "Platinum",
    icon: Trophy,
    color: "text-purple-500",
    minPoints: 5000,
    benefits: ["Personal shopping assistant", "15% cashback", "VIP events"],
  },
]

export function LoyaltyProgram() {
  const { user } = useAuth()
  const [userPoints] = useState(1750) // Mock user points

  if (!user) return null

  const currentTier = loyaltyTiers.reduce((prev, curr) => (userPoints >= curr.minPoints ? curr : prev))

  const nextTier = loyaltyTiers.find((tier) => tier.minPoints > userPoints)
  const pointsToNext = nextTier ? nextTier.minPoints - userPoints : 0
  const progressPercent = nextTier
    ? ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <currentTier.icon className={`h-5 w-5 ${currentTier.color}`} />
            MarketPlace Rewards
          </CardTitle>
          <Badge variant="secondary" className={currentTier.color}>
            {currentTier.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Your Points</span>
            <span className="text-lg font-bold text-accent">{userPoints.toLocaleString()}</span>
          </div>

          {nextTier && (
            <>
              <Progress value={progressPercent} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {pointsToNext.toLocaleString()} points to {nextTier.name} tier
              </p>
            </>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Your Benefits</h4>
          <ul className="space-y-1">
            {currentTier.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="h-3 w-3 text-accent" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            Redeem Points
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
