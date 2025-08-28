"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistItem {
  id: string
  title: string
  brand: string
  price: number
  image: string
  addedAt: number
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "addedAt">) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, addedAt: Date.now() }],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      isInWishlist: (id) => get().items.some((item) => item.id === id),
      clearWishlist: () => set({ items: [] }),
      getItemCount: () => get().items.length,
    }),
    {
      name: "wishlist-storage",
    },
  ),
)
