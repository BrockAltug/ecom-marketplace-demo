"use client"

import { useState } from "react"
import { Sparkles, ArrowRight, Heart, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const aiRecommendations = [
  {
    id: "ai-1",
    title: "Based on your recent views",
    products: [
      {
        id: "rec-1",
        title: "Premium Wireless Earbuds",
        price: 129.99,
        image: "/wireless-earbuds.png",
        confidence: 95,
      },
      {
        id: "rec-2",
        title: "Bluetooth Speaker",
        price: 79.99,
        image: "/bluetooth-speaker.png",
        confidence: 88,
      },
    ],
  },
  {
    id: "ai-2",
    title: "Trending in your area",
    products: [
      {
        id: "rec-3",
        title: "Smart Home Hub",
        price: 199.99,
        image: "/smart-home-hub.png",
        confidence: 92,
      },
      {
        id: "rec-4",
        title: "LED Strip Lights",
        price: 24.99,
        image: "/led-strip-lights.png",
        confidence: 85,
      },
    ],
  },
]

export function AIRecommendations() {
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div className="space-y-6">
      {aiRecommendations.map((section, index) => (
        <Card key={section.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.products.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="flex gap-4 p-4 rounded-lg border hover:shadow-md transition-all duration-200">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-accent transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-lg font-bold text-accent mt-1">${product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {product.confidence}% match
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline" className="bg-transparent">
                View More Recommendations <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
