"use client"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/product/rating-stars"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"
import { useState } from "react"
import { getFilterOptions } from "@/lib/search-utils"
import type { FilterState, Product } from "@/lib/search-utils"

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  products: Product[]
  className?: string
}

export function SearchFilters({ filters, onFiltersChange, onClearFilters, products, className }: SearchFiltersProps) {
  const filterOptions = getFilterOptions(products)
  const [brandSearch, setBrandSearch] = useState("")
  const [featureSearch, setFeatureSearch] = useState("")

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000 ||
    filters.rating > 0 ||
    filters.shipping.length > 0 ||
    filters.availability.length > 0 ||
    filters.features.length > 0

  const filteredBrands = filterOptions.brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase()),
  )

  const filteredFeatures = filterOptions.features.filter((feature) =>
    feature.name.toLowerCase().includes(featureSearch.toLowerCase()),
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Filters</span>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => toggleArrayFilter("categories", category)}
            >
              {category} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.subcategories.map((subcategory) => (
            <Badge
              key={subcategory}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => toggleArrayFilter("subcategories", subcategory)}
            >
              {subcategory} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.brands.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => toggleArrayFilter("brands", brand)}
            >
              {filterOptions.brands.find((b) => b.id === brand)?.name || brand} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.features.map((feature) => (
            <Badge
              key={feature}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => toggleArrayFilter("features", feature)}
            >
              {filterOptions.features.find((f) => f.id === feature)?.name || feature} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filterOptions.categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => toggleArrayFilter("categories", category.id)}
              />
              <label htmlFor={category.id} className="text-sm flex-1 cursor-pointer">
                {category.name}
              </label>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subcategories - only show if categories are selected */}
      {filters.categories.length > 0 && filterOptions.subcategories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Subcategories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filterOptions.subcategories.slice(0, 10).map((subcategory) => (
              <div key={subcategory.id} className="flex items-center space-x-2">
                <Checkbox
                  id={subcategory.id}
                  checked={filters.subcategories.includes(subcategory.id)}
                  onCheckedChange={() => toggleArrayFilter("subcategories", subcategory.id)}
                />
                <label htmlFor={subcategory.id} className="text-sm flex-1 cursor-pointer">
                  {subcategory.name}
                </label>
                <span className="text-xs text-muted-foreground">({subcategory.count})</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
            max={5000}
            min={0}
            step={25}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1] === 5000 ? "5000+" : filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-3">
            {filteredBrands.slice(0, 15).map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={filters.brands.includes(brand.id)}
                  onCheckedChange={() => toggleArrayFilter("brands", brand.id)}
                />
                <label htmlFor={brand.id} className="text-sm flex-1 cursor-pointer">
                  {brand.name}
                </label>
                <span className="text-xs text-muted-foreground">({brand.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Customer Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={() => updateFilter("rating", filters.rating === rating ? 0 : rating)}
              />
              <label htmlFor={`rating-${rating}`} className="flex items-center gap-2 cursor-pointer">
                <RatingStars rating={rating} size="sm" />
                <span className="text-sm">& Up</span>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Shipping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: "free", label: "Free Shipping" },
            { id: "prime", label: "Prime Shipping" },
            { id: "fast", label: "Same Day Delivery" },
          ].map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={filters.shipping.includes(option.id)}
                onCheckedChange={() => toggleArrayFilter("shipping", option.id)}
              />
              <label htmlFor={option.id} className="text-sm cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: "in-stock", label: "In Stock" },
            { id: "on-sale", label: "On Sale" },
            { id: "new", label: "New Arrivals" },
            { id: "bestseller", label: "Best Sellers" },
          ].map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={filters.availability.includes(option.id)}
                onCheckedChange={() => toggleArrayFilter("availability", option.id)}
              />
              <label htmlFor={option.id} className="text-sm cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Features */}
      {filterOptions.features.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search features..."
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-3">
              {filteredFeatures.slice(0, 10).map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.id}
                    checked={filters.features.includes(feature.id)}
                    onCheckedChange={() => toggleArrayFilter("features", feature.id)}
                  />
                  <label htmlFor={feature.id} className="text-sm flex-1 cursor-pointer">
                    {feature.name}
                  </label>
                  <span className="text-xs text-muted-foreground">({feature.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
