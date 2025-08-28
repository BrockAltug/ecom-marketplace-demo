"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useEffect, useState } from "react"
import type React from "react"

interface CartItem {
  id: string
  title: string
  brand: string
  image: string
  price: number
  quantity: number
  variants?: Record<string, string>
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
            }
          } else {
            return { items: [...state.items, item] }
          }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
    },
  ),
)

export function useCart() {
  const [isHydrated, setIsHydrated] = useState(false)
  const store = useCartStore()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Return empty state during SSR/before hydration
  if (!isHydrated) {
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getItemCount: () => 0,
      getTotal: () => 0,
    }
  }

  return store
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
