"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchSort } from "@/components/search/search-sort"
import { SearchResults } from "@/components/search/search-results"
import { SearchAutocomplete } from "@/components/search/search-autocomplete"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter, SlidersHorizontal } from "lucide-react"
import products from "@/src/data/products.json"
import { filterProducts, sortProducts } from "@/lib/search-utils"
import type { FilterState, SortOption, Product } from "@/lib/search-utils"

const initialFilters: FilterState = {
  categories: [],
  subcategories: [],
  brands: [],
  priceRange: [0, 5000],
  rating: 0,
  shipping: [],
  availability: [],
  features: [],
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [loading, setLoading] = useState(false)
  const [displayCount, setDisplayCount] = useState(20)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(products as Product[], query, filters)
    return sortProducts(filtered, sortBy)
  }, [query, filters, sortBy])

  const displayedProducts = filteredAndSortedProducts.slice(0, displayCount)
  const hasMore = displayedProducts.length < filteredAndSortedProducts.length

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (filters.categories.length > 0) params.set("categories", filters.categories.join(","))
    if (filters.brands.length > 0) params.set("brands", filters.brands.join(","))
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
      params.set("price", `${filters.priceRange[0]}-${filters.priceRange[1]}`)
    }
    if (filters.rating > 0) params.set("rating", filters.rating.toString())
    if (sortBy !== "relevance") params.set("sort", sortBy)

    const newUrl = params.toString() ? `/search?${params.toString()}` : "/search"
    router.replace(newUrl, { scroll: false })
  }, [query, filters, sortBy, router])

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams(searchParams)
    if (newQuery) {
      params.set("q", newQuery)
    } else {
      params.delete("q")
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleLoadMore = () => {
    setLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) => prev + 20)
      setLoading(false)
    }, 800)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setSortBy("relevance")
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <SearchAutocomplete
              products={products as Product[]}
              onSearch={handleSearch}
              placeholder="Search for products, brands, categories..."
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{query ? `Search results for "${query}"` : "All Products"}</h1>
            <p className="text-muted-foreground">
              {query
                ? `Found ${filteredAndSortedProducts.length.toLocaleString()} products matching your search`
                : "Discover amazing products from our marketplace"}
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                products={products as Product[]}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button & Sort */}
            <div className="flex items-center justify-between mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {filters.categories.length +
                      filters.brands.length +
                      filters.shipping.length +
                      filters.availability.length >
                      0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {filters.categories.length +
                          filters.brands.length +
                          filters.shipping.length +
                          filters.availability.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Filters</h2>
                    </div>
                    <SearchFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={handleClearFilters}
                      products={products as Product[]}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <SearchSort
                value={sortBy}
                onValueChange={setSortBy}
                resultCount={filteredAndSortedProducts.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* Search Results */}
            <SearchResults
              products={displayedProducts}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </PageShell>
  )
}
