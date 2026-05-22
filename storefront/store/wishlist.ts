"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistProduct {
  id: string
  handle: string
  title: string
  thumbnail: string
  price: number
}

interface WishlistStore {
  items: WishlistProduct[]
  addItem: (product: WishlistProduct) => void
  removeItem: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state
          return { items: [...state.items, product] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),

      isWishlisted: (productId) => {
        return get().items.some((i) => i.id === productId)
      },

      clear: () => set({ items: [] }),
    }),
    { name: "magnet-wishlist" }
  )
)
