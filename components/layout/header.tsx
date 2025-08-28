"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, ShoppingCart, User, Menu, Heart, Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-store"
import { useAuth } from "@/lib/auth-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import { WishlistModal } from "@/components/wishlist/wishlist-modal"


export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false)
  const items = useCart((state) => state.items)
  const { user, logout } = useAuth()
  const { getItemCount } = useWishlistStore()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/search")
    }
    setMobileSearchOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleWishlistClick = () => {
    setWishlistModalOpen(true)
  }

  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Beauty", "Automotive", "Toys"]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex h-16 items-center justify-between">
            {/* Logo and mobile menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 sm:w-96">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 py-6">
                    {user && (
                      <div className="pb-4 border-b">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                            <User className="h-5 w-5 text-accent-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 className="text-lg font-semibold">Categories</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant="ghost"
                          className="justify-start h-12 text-left"
                          onClick={(e) => {
                            e.preventDefault()
                            router.push(`/search?categories=${encodeURIComponent(category)}`)
                          }}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>

                    {user && (
                      <div className="pt-4 border-t space-y-2">
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => router.push("/account")}
                        >
                          My Account
                        </Button>
                        <Button variant="ghost" className="justify-start w-full" onClick={handleWishlistClick}>
                          Wishlist
                          {getItemCount() > 0 && (
                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">{getItemCount()}</Badge>
                          )}
                        </Button>
                        {user.role === "seller" && (
                          <Button
                            variant="ghost"
                            className="justify-start w-full"
                            onClick={() => router.push("/seller")}
                          >
                            Seller Dashboard
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="justify-start w-full text-destructive"
                          onClick={handleLogout}
                        >
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/")
                }}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">M</span>
                </div>
                <span className="hidden sm:block text-xl font-bold">MarketPlace</span>
              </a>
            </div>

            {/* Desktop Search bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 h-10"
                />
                <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="hidden sm:flex relative" onClick={handleWishlistClick}>
                <Heart className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{getItemCount()}</Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Bell className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{items.length}</Badge>
                )}
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/account")}>My Account</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account")}>Orders</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleWishlistClick}>
                      Wishlist
                      {getItemCount() > 0 && (
                        <Badge className="ml-2 h-4 w-4 rounded-full p-0 text-xs">{getItemCount()}</Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.role === "seller" && (
                      <>
                        <DropdownMenuItem onClick={() => router.push("/seller")}>Seller Dashboard</DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => router.push("/login")}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => router.push("/register")}>
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation categories - desktop only */}
          <div className="hidden md:flex items-center gap-6 py-2 border-t">
            {categories.slice(0, 6).map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className="text-sm hover:text-accent hover:bg-accent/10"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/search?categories=${encodeURIComponent(category)}`)
                }}
              >
                {category}
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm">
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.slice(6).map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(`/search?categories=${encodeURIComponent(category)}`)
                    }}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="fixed inset-0 z-50 bg-background md:hidden">
            <div className="flex items-center gap-4 p-4 border-b">
              <Button variant="ghost" size="icon" onClick={() => setMobileSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
              <form onSubmit={handleSearch} className="flex-1">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </form>
              <Button type="submit" onClick={handleSearch}>
                Search
              </Button>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 6).map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="justify-start bg-transparent"
                    onClick={() => {
                      router.push(`/search?categories=${encodeURIComponent(category)}`)
                      setMobileSearchOpen(false)
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <WishlistModal open={wishlistModalOpen} onOpenChange={setWishlistModalOpen} />
    </>
  )
}
