"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Star, ThumbsUp, ThumbsDown, Camera, Video, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-store"

interface Review {
  id: string
  user: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  images?: string[]
  videos?: string[]
}

const mockReviews: Review[] = [
  {
    id: "1",
    user: "Sarah M.",
    rating: 5,
    title: "Excellent quality and fast shipping!",
    content:
      "This product exceeded my expectations. The build quality is fantastic and it arrived exactly as described. Would definitely recommend to others.",
    date: "2024-01-15",
    verified: true,
    helpful: 24,
    images: ["/placeholder.svg?key=review1", "/placeholder.svg?key=review2"],
  },
  {
    id: "2",
    user: "Mike R.",
    rating: 4,
    title: "Good value for money",
    content:
      "Solid product overall. Minor issues with setup but customer service was helpful. Works great once configured properly.",
    date: "2024-01-10",
    verified: true,
    helpful: 18,
  },
]

export function AdvancedReviews({ productId }: { productId: string }) {
  const [reviews] = useState(mockReviews)
  const [sortBy, setSortBy] = useState("helpful")
  const [filterRating, setFilterRating] = useState(0)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const { user } = useAuth()

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 12, percentage: 20 },
    { stars: 3, count: 2, percentage: 3 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 },
  ]

  const averageRating = 4.7
  const totalReviews = 60

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{item.stars}★</span>
                  <Progress value={item.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWriteReview(!showWriteReview)}
              className="bg-transparent"
            >
              Write a Review
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Camera className="h-4 w-4 mr-1" />
              Add Photo
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Video className="h-4 w-4 mr-1" />
              Add Video
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Form */}
      {showWriteReview && user && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 cursor-pointer hover:text-yellow-400 transition-colors" />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Review Title</label>
              <input type="text" placeholder="Summarize your experience" className="w-full p-2 border rounded-md" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea placeholder="Share your thoughts about this product..." className="min-h-[100px]" />
            </div>

            <div className="flex gap-2">
              <Button>Submit Review</Button>
              <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Filters */}
      <div className="flex flex-wrap gap-2">
        <Button variant={sortBy === "helpful" ? "default" : "outline"} size="sm" onClick={() => setSortBy("helpful")}>
          Most Helpful
        </Button>
        <Button variant={sortBy === "recent" ? "default" : "outline"} size="sm" onClick={() => setSortBy("recent")}>
          Most Recent
        </Button>
        <Button
          variant={filterRating === 5 ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterRating(filterRating === 5 ? 0 : 5)}
        >
          5 Stars Only
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Shield className="h-4 w-4 mr-1" />
          Verified Only
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-muted-foreground mb-4">{review.content}</p>

              {review.images && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Review image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm">
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Not Helpful
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
