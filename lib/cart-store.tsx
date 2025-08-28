"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
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
      items: [
        {
          id: "1",
          title: "Wireless Bluetooth Headphones",
          brand: "AudioTech",
          image: "/wireless-headphones.png",
          price: 79.99,
          quantity: 1,
          variants: { color: "Black" },
        },
        {
          id: "2",
          title: "Organic Cotton T-Shirt",
          brand: "EcoWear",
          image: "/cotton-t-shirt.png",
          price: 24.99,
          quantity: 2,
          variants: { size: "M", color: "White" },
        },
        {
          id: "3",
          title: "Smart Home Security Camera",
          brand: "SecureHome",
          image: "/outdoor-security-camera.png",
          price: 149.99,
          quantity: 1,
          variants: { color: "White" },
        },
      ],
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export const useCart = useCartStore
