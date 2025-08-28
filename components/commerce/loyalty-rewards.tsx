"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Star, Gift, Crown, Zap, Trophy, ShoppingBag, Calendar } from "lucide-react"

interface LoyaltyTier {
  name: string
  icon: React.ReactNode
  pointsRequired: number
  benefits: string[]
  color: string
}

interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  type: "discount" | "freeShipping" | "product" | "experience"
  image?: string
  expiresAt?: Date
}

export function LoyaltyRewards() {
  const [currentPoints, setCurrentPoints] = useState(2450)
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const tiers: LoyaltyTier[] = [
    {
      name: "Bronze",
      icon: <ShoppingBag className="h-5 w-5" />,
      pointsRequired: 0,
      benefits: ["1 point per $1 spent", "Birthday discount"],
      color: "text-amber-600",
    },
    {
      name: "Silver",
      icon: <Star className="h-5 w-5" />,
      pointsRequired: 1000,
      benefits: ["1.5 points per $1", "Free shipping", "Early access"],
      color: "text-gray-500",
    },
    {
      name: "Gold",
      icon: <Crown className="h-5 w-5" />,
      pointsRequired: 2500,
      benefits: ["2 points per $1", "Priority support", "Exclusive deals"],
      color: "text-yellow-500",
    },
    {
      name: "Platinum",
      icon: <Trophy className="h-5 w-5" />,
      pointsRequired: 5000,
      benefits: ["3 points per $1", "Personal shopper", "VIP events"],
      color: "text-purple-500",
    },
  ]

  const rewards: Reward[] = [
    {
      id: "r1",
      title: "$5 Off Next Order",
      description: "Instant discount on your next purchase",
      pointsCost: 500,
      type: "discount",
    },
    {
      id: "r2",
      title: "Free Express Shipping",
      description: "Free 2-day shipping on any order",
      pointsCost: 300,
      type: "freeShipping",
    },
    {
      id: "r3",
      title: "Premium Headphones",
      description: "Wireless noise-canceling headphones",
      pointsCost: 2000,
      type: "product",
      image: "/wireless-headphones.png",
    },
    {
      id: "r4",
      title: "$25 Off Next Order",
      description: "Bigger savings for loyal customers",
      pointsCost: 2500,
      type: "discount",
    },
    {
      id: "r5",
      title: "VIP Shopping Experience",
      description: "Personal shopping session with expert",
      pointsCost: 3000,
      type: "experience",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "r6",
      title: "$50 Off Next Order",
      description: "Maximum savings reward",
      pointsCost: 5000,
      type: "discount",
    },
  ]

  const currentTier = tiers.reduce((prev, curr) => {
    return currentPoints >= curr.pointsRequired ? curr : prev
  }, tiers[0])

  const nextTier = tiers.find((tier) => tier.pointsRequired > currentPoints)
  const progressToNextTier = nextTier
    ? ((currentPoints - currentTier.pointsRequired) / (nextTier.pointsRequired - currentTier.pointsRequired)) * 100
    : 100

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (reward && currentPoints >= reward.pointsCost) {
      setCurrentPoints((prev) => prev - reward.pointsCost)
      setSelectedReward(rewardId)
      setTimeout(() => setSelectedReward(null), 3000)
    }
  }

  const getRewardIcon = (type: Reward["type"]) => {
    switch (type) {
      case "discount":
        return <Gift className="h-5 w-5 text-green-600" />
      case "freeShipping":
        return <Zap className="h-5 w-5 text-blue-600" />
      case "product":
        return <ShoppingBag className="h-5 w-5 text-purple-600" />
      case "experience":
        return <Crown className="h-5 w-5 text-yellow-600" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Loyalty Rewards</h2>
        <p className="text-muted-foreground">Earn points with every purchase and unlock exclusive rewards</p>
      </div>

      {/* Current Status */}
      <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white shadow-sm ${currentTier.color}`}>{currentTier.icon}</div>
              <div>
                <h3 className="font-bold text-lg">{currentTier.name} Member</h3>
                <p className="text-sm text-muted-foreground">{currentPoints.toLocaleString()} points available</p>
              </div>
            </div>
            <Badge className="bg-accent text-accent-foreground">{currentPoints.toLocaleString()} pts</Badge>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>{nextTier.pointsRequired - currentPoints} points to go</span>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`${
              tier.name === currentTier.name ? "border-accent bg-accent/5" : "border-muted"
            } transition-all duration-200`}
          >
            <CardContent className="p-4 text-center">
              <div className={`inline-flex p-2 rounded-full bg-muted mb-3 ${tier.color}`}>{tier.icon}</div>
              <h3 className="font-semibold mb-2">{tier.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {tier.pointsRequired === 0 ? "Starting tier" : `${tier.pointsRequired.toLocaleString()} points`}
              </p>
              <div className="space-y-1">
                {tier.benefits.map((benefit, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    {benefit}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className={`transition-all duration-200 ${
                  currentPoints >= reward.pointsCost
                    ? "hover:shadow-md cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                } ${selectedReward === reward.id ? "border-green-500 bg-green-50" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {getRewardIcon(reward.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{reward.title}</h4>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                    {reward.image && (
                      <img src={reward.image || "/placeholder.svg"} alt="" className="w-8 h-8 object-cover rounded" />
                    )}
                  </div>

                  {reward.expiresAt && (
                    <div className="flex items-center gap-1 mb-3 text-xs text-orange-600">
                      <Calendar className="h-3 w-3" />
                      <span>Expires {reward.expiresAt.toLocaleDateString()}</span>
                    </div>
                  )}

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-transparent">
                      {reward.pointsCost} pts
                    </Badge>
                    <Button
                      size="sm"
                      disabled={currentPoints < reward.pointsCost}
                      onClick={() => redeemReward(reward.id)}
                      className={
                        selectedReward === reward.id
                          ? "bg-green-600 hover:bg-green-700"
                          : currentPoints >= reward.pointsCost
                            ? ""
                            : "opacity-50"
                      }
                    >
                      {selectedReward === reward.id ? "Redeemed!" : "Redeem"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earn More Points */}
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardContent className="p-6 text-center">
          <Star className="h-12 w-12 mx-auto text-accent mb-4" />
          <h3 className="font-semibold mb-2">Earn More Points</h3>
          <p className="text-muted-foreground mb-4">
            Shop more, refer friends, and complete challenges to earn bonus points
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              Shop Now
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              Refer Friends
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              View Challenges
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
