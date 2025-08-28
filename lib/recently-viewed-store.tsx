"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RecentlyViewedItem {
  id: string
  title: string
  brand: string
  price: number
  image: string
  viewedAt: number
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[]
  addItem: (item: Omit<RecentlyViewedItem, "viewedAt">) => void
  getItems: () => RecentlyViewedItem[]
  clearHistory: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id)
          const newItem = { ...item, viewedAt: Date.now() }

          if (existingIndex >= 0) {
            // Update existing item's timestamp and move to front
            const updatedItems = [...state.items]
            updatedItems[existingIndex] = newItem
            return {
              items: [newItem, ...updatedItems.filter((_, i) => i !== existingIndex)],
            }
          } else {
            // Add new item to front, keep only last 20 items
            return {
              items: [newItem, ...state.items].slice(0, 20),
            }
          }
        }),
      getItems: () => get().items,
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed-storage",
    },
  ),
)
