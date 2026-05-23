"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  handle: string
  title: string
  variant: string
  variantTitle: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  maxQuantity: number
}

interface CartStore {
  items: CartItem[]
  couponCode: string
  couponDiscount: number
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (productId: string, variant: string) => void
  updateQuantity: (productId: string, variant: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
  getSubtotal: () => number
  getShipping: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      couponDiscount: 0,

      addItem: (item) =>
        set((state) => {
          const quantityToAdd = Math.max(1, item.quantity || 1)
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variant === item.variant
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variant === item.variant
                  ? { ...i, quantity: Math.min(i.quantity + quantityToAdd, i.maxQuantity) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(quantityToAdd, item.maxQuantity) },
            ],
          }
        }),

      removeItem: (productId, variant) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variant === variant)
          ),
        })),

      updateQuantity: (productId, variant, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variant === variant
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) }
              : i
          ),
        })),

      clearCart: () => set({ items: [], couponCode: "", couponDiscount: 0 }),

      applyCoupon: (code) => {
        const discounts: Record<string, number> = {
          MERRY20: 0.2,
          WELCOME10: 0.1,
          SAVE5: 5,
        }
        const discount = discounts[code.toUpperCase()] || 0
        set({ couponCode: code.toUpperCase(), couponDiscount: discount })
      },

      removeCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= 50 ? 0 : 5.99
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        const { couponDiscount } = get()
        let discount = 0
        if (couponDiscount > 1) {
          discount = couponDiscount
        } else if (couponDiscount > 0) {
          discount = subtotal * couponDiscount
        }
        return Math.max(0, subtotal + shipping - discount)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: "magnet-cart",
    }
  )
)
