"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Clock, TrendingUp, X } from "lucide-react"
import { getSearchSuggestions } from "@/lib/search-utils"
import type { Product } from "@/lib/search-utils"

interface SearchAutocompleteProps {
  products: Product[]
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function SearchAutocomplete({
  products,
  onSearch,
  placeholder = "Search products...",
  className,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [popularSearches] = useState([
    "iPhone",
    "Nike shoes",
    "MacBook",
    "Headphones",
    "Coffee",
    "Jeans",
    "Watch",
    "Camera",
  ])

  const debouncedQuery = useDebounce(query, 300)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse recent searches:", error)
        localStorage.removeItem("recentSearches")
      }
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true)
      // Simulate async operation for better UX
      const timeoutId = setTimeout(() => {
        const newSuggestions = getSearchSuggestions(debouncedQuery, products)
        setSuggestions(newSuggestions)
        setIsLoading(false)
        setSelectedIndex(-1)
      }, 100)

      return () => clearTimeout(timeoutId)
    } else {
      setSuggestions([])
      setIsLoading(false)
      setSelectedIndex(-1)
    }
  }, [debouncedQuery, products])

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions) return

      const allSuggestions = [...suggestions, ...recentSearches, ...(query.length === 0 ? popularSearches : [])]

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, allSuggestions.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
            handleSearch(allSuggestions[selectedIndex])
          } else {
            handleSearch(query)
          }
          break
        case "Escape":
          setShowSuggestions(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    },
    [showSuggestions, suggestions, recentSearches, popularSearches, query, selectedIndex],
  )

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return

      // Add to recent searches with deduplication
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s.toLowerCase() !== searchQuery.toLowerCase()),
      ].slice(0, 8) // Increased to 8 recent searches

      setRecentSearches(newRecentSearches)
      try {
        localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
      } catch (error) {
        console.error("Failed to save recent searches:", error)
      }

      setQuery(searchQuery)
      setShowSuggestions(false)
      setSelectedIndex(-1)
      onSearch(searchQuery)
    },
    [recentSearches, onSearch],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }, [])

  const clearQuery = useCallback(() => {
    setQuery("")
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20 h-12 text-base"
          autoComplete="off"
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearQuery}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10">
          Search
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2"
        >
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-accent rounded-full animate-spin" />
                Searching...
              </div>
            </div>
          )}

          {/* Query Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSearch(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2 transition-colors ${
                    selectedIndex === index ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{suggestion}</span>
                  <span className="text-xs text-muted-foreground">in products</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && recentSearches.length > 0 && (
            <div className="p-2 border-t">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="text-xs font-medium text-muted-foreground">Recent Searches</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              </div>
              {recentSearches.map((search, index) => {
                const adjustedIndex = suggestions.length + index
                return (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleSearch(search)}
                    className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2 transition-colors ${
                      selectedIndex === adjustedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{search}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        const newRecent = recentSearches.filter((_, i) => i !== index)
                        setRecentSearches(newRecent)
                        localStorage.setItem("recentSearches", JSON.stringify(newRecent))
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </button>
                )
              })}
            </div>
          )}

          {/* Popular Searches */}
          {!isLoading && query.length === 0 && (
            <div className="p-2 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Popular Searches</div>
              {popularSearches.map((search, index) => {
                const adjustedIndex = suggestions.length + recentSearches.length + index
                return (
                  <button
                    key={`popular-${index}`}
                    onClick={() => handleSearch(search)}
                    className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2 transition-colors ${
                      selectedIndex === adjustedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{search}</span>
                    <span className="text-xs text-muted-foreground">trending</span>
                  </button>
                )
              })}
            </div>
          )}

          {!isLoading && query.length >= 2 && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">No suggestions found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  )
}
