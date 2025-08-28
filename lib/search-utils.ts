export interface Product {
  id: string
  title: string
  brand: string
  category: string
  subcategory?: string
  images: string[]
  price: number
  listPrice: number
  rating: number
  reviews: number
  badges: string[]
  shipping: string
  stock: number
  variants?: Array<{ type: string; options: string[] }>
  seller: string
  specs?: Record<string, string>
  description: string
  features?: string[]
  tags?: string[]
}

export interface FilterState {
  categories: string[]
  subcategories: string[]
  brands: string[]
  priceRange: [number, number]
  rating: number
  shipping: string[]
  availability: string[]
  features: string[]
}

export type SortOption =
  | "relevance"
  | "price-low"
  | "price-high"
  | "rating"
  | "popularity"
  | "newest"
  | "discount"
  | "alphabetical"

// Fuzzy search implementation
export function fuzzySearch(query: string, text: string): number {
  if (!query) return 1

  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return textLower.indexOf(queryLower) === 0 ? 1 : 0.8
  }

  // Character matching with position weighting
  let score = 0
  let queryIndex = 0

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 1 / (i + 1) // Earlier matches get higher scores
      queryIndex++
    }
  }

  return queryIndex === queryLower.length ? score / queryLower.length : 0
}

// Advanced product filtering
export function filterProducts(products: Product[], query: string, filters: FilterState): Product[] {
  let results = [...products]

  // Advanced text search with fuzzy matching
  if (query) {
    results = results
      .map((product) => {
        const titleScore = fuzzySearch(query, product.title) * 3
        const brandScore = fuzzySearch(query, product.brand) * 2
        const categoryScore = fuzzySearch(query, product.category) * 1.5
        const subcategoryScore = fuzzySearch(query, product.subcategory || "") * 1.2
        const descriptionScore = fuzzySearch(query, product.description) * 0.5
        const tagsScore = product.tags ? Math.max(...product.tags.map((tag) => fuzzySearch(query, tag))) * 1.5 : 0
        const featuresScore = product.features
          ? Math.max(...product.features.map((feature) => fuzzySearch(query, feature))) * 1.2
          : 0

        const totalScore =
          titleScore + brandScore + categoryScore + subcategoryScore + descriptionScore + tagsScore + featuresScore

        return { ...product, searchScore: totalScore }
      })
      .filter((product) => product.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
  }

  // Category filter
  if (filters.categories.length > 0) {
    results = results.filter((product) => filters.categories.includes(product.category))
  }

  // Subcategory filter
  if (filters.subcategories.length > 0) {
    results = results.filter((product) => product.subcategory && filters.subcategories.includes(product.subcategory))
  }

  // Brand filter (exact and partial matching)
  if (filters.brands.length > 0) {
    results = results.filter((product) =>
      filters.brands.some(
        (brand) =>
          product.brand.toLowerCase() === brand.toLowerCase() ||
          product.brand.toLowerCase().includes(brand.toLowerCase()),
      ),
    )
  }

  // Price range filter
  results = results.filter(
    (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
  )

  // Rating filter
  if (filters.rating > 0) {
    results = results.filter((product) => product.rating >= filters.rating)
  }

  // Shipping filter
  if (filters.shipping.length > 0) {
    results = results.filter((product) => {
      return filters.shipping.some((shippingType) => {
        switch (shippingType) {
          case "free":
            return product.shipping === "Free" || product.badges.includes("Free Shipping")
          case "prime":
            return product.shipping === "Prime" || product.badges.includes("Prime")
          case "fast":
            return product.shipping === "Same Day" || product.badges.includes("Fast Shipping")
          default:
            return false
        }
      })
    })
  }

  // Availability filter
  if (filters.availability.length > 0) {
    results = results.filter((product) => {
      return filters.availability.some((availability) => {
        switch (availability) {
          case "in-stock":
            return product.stock > 0
          case "on-sale":
            return product.listPrice > product.price
          case "new":
            return product.badges.includes("New") || product.badges.includes("New Arrivals")
          case "bestseller":
            return product.badges.includes("Best Seller") || product.badges.includes("Bestseller")
          default:
            return false
        }
      })
    })
  }

  // Features filter
  if (filters.features.length > 0) {
    results = results.filter((product) => {
      if (!product.features) return false
      return filters.features.some((feature) =>
        product.features!.some((productFeature) => productFeature.toLowerCase().includes(feature.toLowerCase())),
      )
    })
  }

  return results
}

// Advanced sorting
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price)
    case "rating":
      return sorted.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating
        return b.reviews - a.reviews // Secondary sort by review count
      })
    case "popularity":
      return sorted.sort((a, b) => b.reviews - a.reviews)
    case "discount":
      return sorted.sort((a, b) => {
        const discountA = ((a.listPrice - a.price) / a.listPrice) * 100
        const discountB = ((b.listPrice - b.price) / b.listPrice) * 100
        return discountB - discountA
      })
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case "newest":
      // Simulate newest by ID (higher ID = newer)
      return sorted.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
    case "relevance":
    default:
      // If we have search scores, use them; otherwise keep original order
      if (sorted.some((p) => "searchScore" in p)) {
        return sorted.sort((a, b) => (b as any).searchScore - (a as any).searchScore)
      }
      return sorted
  }
}

// Get unique values for filter options
export function getFilterOptions(products: Product[]) {
  const categories = [...new Set(products.map((p) => p.category))]
  const subcategories = [...new Set(products.map((p) => p.subcategory).filter(Boolean))]
  const brands = [...new Set(products.map((p) => p.brand))]
  const features = [...new Set(products.flatMap((p) => p.features || []))]

  return {
    categories: categories.map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: products.filter((p) => p.category === cat).length,
    })),
    subcategories: subcategories.map((sub) => ({
      id: sub!,
      name: sub!,
      count: products.filter((p) => p.subcategory === sub).length,
    })),
    brands: brands.map((brand) => ({
      id: brand.toLowerCase().replace(/\s+/g, "-"),
      name: brand,
      count: products.filter((p) => p.brand === brand).length,
    })),
    features: features.slice(0, 20).map((feature) => ({
      // Limit to top 20 features
      id: feature.toLowerCase().replace(/\s+/g, "-"),
      name: feature,
      count: products.filter((p) => p.features?.includes(feature)).length,
    })),
  }
}

// Search suggestions
export function getSearchSuggestions(query: string, products: Product[]): string[] {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  products.forEach((product) => {
    // Add matching titles
    if (product.title.toLowerCase().includes(queryLower)) {
      suggestions.add(product.title)
    }

    // Add matching brands
    if (product.brand.toLowerCase().includes(queryLower)) {
      suggestions.add(product.brand)
    }

    // Add matching categories
    if (product.category.toLowerCase().includes(queryLower)) {
      suggestions.add(product.category)
    }

    // Add matching tags
    product.tags?.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 8) // Limit to 8 suggestions
}
