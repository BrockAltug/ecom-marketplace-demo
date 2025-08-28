"use client"

import type React from "react"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LiveChatWidget } from "@/components/premium/live-chat-widget"
import { SocialProofBanner } from "@/components/premium/social-proof-banner"
import { AIRecommendations } from "@/components/premium/ai-recommendations"
import { VoiceSearch } from "@/components/premium/voice-search"
import { ProductComparisonTool } from "@/components/premium/product-comparison-tool"
import { AdvancedNotifications } from "@/components/premium/advanced-notifications"
import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Book,
  Sparkles,
  Car,
  Gamepad2,
  ArrowRight,
  Star,
  TrendingUp,
  Heart,
  Briefcase,
  Coffee,
  Shield,
  Zap,
  Globe,
} from "lucide-react"
import categories from "@/src/data/categories.json"

const iconMap = {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Book,
  Sparkles,
  Car,
  Gamepad2,
  Heart,
  Briefcase,
  Coffee,
  Shield,
  Zap,
  Globe,
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Non-functional search
  }

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search?categories=${encodeURIComponent(categoryName)}`)
  }

  const featuredProducts = [
    {
      id: "1",
      title: "Wireless Bluetooth Headphones",
      price: 79.99,
      listPrice: 99.99,
      rating: 4.5,
      image: "/wireless-headphones.png",
      badge: "Best Seller",
    },
    {
      id: "2",
      title: "Organic Cotton T-Shirt",
      price: 24.99,
      listPrice: 34.99,
      rating: 4.3,
      image: "/cotton-t-shirt.png",
      badge: "Eco-Friendly",
    },
    {
      id: "3",
      title: "Smart Home Security Camera",
      price: 149.99,
      listPrice: 199.99,
      rating: 4.7,
      image: "/outdoor-security-camera.png",
      badge: "Top Rated",
    },
    {
      id: "4",
      title: "Fitness Tracker Watch",
      price: 199.99,
      listPrice: 249.99,
      rating: 4.4,
      image: "/fitness-tracker-lifestyle.png",
      badge: "New",
    },
  ]

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing
            <span className="text-accent block">Products</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Shop from millions of products with AI-powered recommendations, voice search, and premium marketplace
            features.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <VoiceSearch />
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>Popular searches:</span>
            {["iPhone", "Nike Shoes", "Coffee Maker", "Laptop"].map((term) => (
              <Button
                key={term}
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-accent"
                onClick={(e) => e.preventDefault()}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-accent/5 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold">Buyer Protection</p>
                <p className="text-sm text-muted-foreground">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold">Lightning Fast</p>
                <p className="text-sm text-muted-foreground">Same-day delivery available</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Globe className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold">Global Marketplace</p>
                <p className="text-sm text-muted-foreground">Shop from worldwide sellers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our wide range of product categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap]
              return (
                <Card
                  key={category.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} items</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Now</h2>
              <p className="text-muted-foreground">Most popular products this week</p>
            </div>
            <Button variant="outline" className="hidden md:flex items-center gap-2 bg-transparent">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2">{product.badge}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">${product.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${product.listPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Personalized for You</h2>
            <p className="text-muted-foreground">AI-powered recommendations based on your preferences</p>
          </div>
          <AIRecommendations />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-8 md:p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-6 text-accent" />
              <h2 className="text-3xl font-bold mb-4">Join MarketPlace Premium</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get free shipping, exclusive deals, early access to sales, and personalized recommendations.
              </p>
              <Button size="lg" className="bg-accent hover:bg-accent/90" disabled>
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <LiveChatWidget />
      <SocialProofBanner />
      <ProductComparisonTool />
      <AdvancedNotifications />
    </PageShell>
  )
}
