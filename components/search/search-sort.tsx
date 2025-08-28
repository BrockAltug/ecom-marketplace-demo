"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Grid3X3, List } from "lucide-react"
import type { SortOption } from "@/lib/search-utils"

interface SearchSortProps {
  value: SortOption
  onValueChange: (value: SortOption) => void
  resultCount: number
  viewMode?: "grid" | "list"
  onViewModeChange?: (mode: "grid" | "list") => void
}

export function SearchSort({
  value,
  onValueChange,
  resultCount,
  viewMode = "grid",
  onViewModeChange,
}: SearchSortProps) {
  const sortOptions = [
    { value: "relevance", label: "Best Match" },
    { value: "popularity", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "discount", label: "Biggest Discount" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "alphabetical", label: "A to Z" },
  ]

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{resultCount.toLocaleString()}</span> results found
        </p>

        {onViewModeChange && (
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
