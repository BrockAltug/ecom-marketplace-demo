"use client"

import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { VirtualScroll } from "@/components/ui/virtual-scroll"
import { Search, Package, TrendingUp, Filter } from "lucide-react"
import { useState } from "react"

interface Product {
  id: string
  title: string
  brand: string
  images: string[]
  price: number
  listPrice: number
  rating: number
  reviews: number
  badges: string[]
  shipping: string
}

interface SearchResultsProps {
  products: Product[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  viewMode?: "grid" | "list"
}

export function SearchResults({
  products,
  loading = false,
  hasMore = false,
  onLoadMore,
  viewMode = "grid",
}: SearchResultsProps) {
  const [useVirtualScroll, setUseVirtualScroll] = useState(false)

  const LoadingSkeleton = ({ count = 12 }: { count?: number }) => (
    <div
      className={
        viewMode === "list" ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4 animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
          <Skeleton className={viewMode === "list" ? "h-20 w-20" : "aspect-square w-full"} />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="relative mb-6">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <div className="absolute -top-2 -right-2">
          <Search className="h-6 w-6 text-muted-foreground/50" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">No products found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any products matching your search. Try adjusting your filters or search terms.
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Try searching for:</span>
          {["Electronics", "Clothing", "Home & Garden", "Sports"].map((suggestion) => (
            <Button key={suggestion} variant="outline" size="sm" className="text-xs bg-transparent">
              {suggestion}
            </Button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Browse All Products
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Trending
          </Button>
        </div>
      </div>
    </div>
  )

  const shouldUseVirtualScroll = products.length > 100 && viewMode === "list"

  if (loading && products.length === 0) {
    return <LoadingSkeleton />
  }

  if (products.length === 0) {
    return <EmptyState />
  }

  const gridClasses =
    viewMode === "list" ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

  if (shouldUseVirtualScroll) {
    return (
      <div className="space-y-8">
        <VirtualScroll
          items={products}
          itemHeight={120}
          containerHeight={600}
          renderItem={(product) => <ProductCard key={product.id} product={product} viewMode={viewMode} />}
          className="border rounded-lg"
        />

        {hasMore && (
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={onLoadMore} disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                "Load More Products"
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {products.length > 50 && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Showing {products.length} products</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setUseVirtualScroll(!useVirtualScroll)} className="text-xs">
            {useVirtualScroll ? "Standard View" : "Performance Mode"}
          </Button>
        </div>
      )}

      <div className={`${gridClasses} stagger-fade-in`}>
        {products.map((product, index) => (
          <div key={product.id} style={{ animationDelay: `${Math.min(index * 50, 800)}ms` }}>
            <ProductCard product={product} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[200px] hover:shadow-md transition-all duration-200 bg-transparent"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-accent rounded-full animate-spin" />
                Loading more products...
              </div>
            ) : (
              <>
                Load More Products
                <span className="ml-2 text-xs text-muted-foreground">({products.length} of many)</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Loading More */}
      {loading && products.length > 0 && <LoadingSkeleton count={4} />}
    </div>
  )
}
