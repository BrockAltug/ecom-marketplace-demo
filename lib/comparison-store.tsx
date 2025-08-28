"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ComparisonItem {
  id: string
  title: string
  brand: string
  price: number
  listPrice: number
  rating: number
  image: string
  category: string
  specs?: Record<string, string>
}

interface ComparisonStore {
  items: ComparisonItem[]
  addItem: (item: ComparisonItem) => void
  removeItem: (id: string) => void
  clearComparison: () => void
  isInComparison: (id: string) => boolean
  getItemCount: () => number
  canAddMore: () => boolean
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.length >= 4) return state // Max 4 items
          if (state.items.some((i) => i.id === item.id)) return state // Already exists
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearComparison: () => set({ items: [] }),
      isInComparison: (id) => get().items.some((item) => item.id === id),
      getItemCount: () => get().items.length,
      canAddMore: () => get().items.length < 4,
    }),
    {
      name: "comparison-storage",
    },
  ),
)
