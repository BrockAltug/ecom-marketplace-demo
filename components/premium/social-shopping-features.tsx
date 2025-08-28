"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Users, Eye, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialShoppingFeaturesProps {
  productId: string
  className?: string
}

export function SocialShoppingFeatures({ productId, className }: SocialShoppingFeaturesProps) {
  const [liked, setLiked] = useState(false)
  const [following, setFollowing] = useState(false)

  // Mock social data
  const socialData = {
    likes: 1247 + (liked ? 1 : 0),
    views: 8934,
    shares: 156,
    comments: 89,
    groupBuyers: 23,
    recentBuyers: [
      { id: "1", name: "Sarah M.", avatar: "/placeholder.svg", time: "2 min ago" },
      { id: "2", name: "John D.", avatar: "/placeholder.svg", time: "5 min ago" },
      { id: "3", name: "Emma L.", avatar: "/placeholder.svg", time: "12 min ago" },
    ],
    influencerRecommendation: {
      name: "TechReviewer Pro",
      avatar: "/placeholder.svg",
      followers: "125K",
      verified: true,
      review: "This is hands down the best product in its category. Highly recommended!",
    },
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Social Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Social Activity</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {socialData.views.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {socialData.groupBuyers} buying together
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={() => setLiked(!liked)}
              className="flex-1"
            >
              <Heart className={cn("h-4 w-4 mr-1", liked && "fill-current")} />
              {socialData.likes.toLocaleString()}
            </Button>

            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <MessageCircle className="h-4 w-4 mr-1" />
              {socialData.comments}
            </Button>

            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Share2 className="h-4 w-4 mr-1" />
              {socialData.shares}
            </Button>
          </div>

          {/* Recent Buyers */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent buyers:</p>
            <div className="flex items-center gap-2">
              {socialData.recentBuyers.map((buyer) => (
                <div key={buyer.id} className="flex items-center gap-2 text-xs">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={buyer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{buyer.name}</p>
                    <p className="text-muted-foreground">{buyer.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Influencer Recommendation */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={socialData.influencerRecommendation.avatar || "/placeholder.svg"} />
              <AvatarFallback>TR</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{socialData.influencerRecommendation.name}</p>
                {socialData.influencerRecommendation.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {socialData.influencerRecommendation.followers} followers
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-2">{socialData.influencerRecommendation.review}</p>

              <Button variant={following ? "secondary" : "outline"} size="sm" onClick={() => setFollowing(!following)}>
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group Buying */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <p className="font-semibold text-sm">Group Buying Available</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Save 15%</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            Join {socialData.groupBuyers} others and save on bulk orders
          </p>

          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Join Group Buy
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
