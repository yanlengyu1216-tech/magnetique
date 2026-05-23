import { API } from "@/lib/api"
const MEDUSA_BACKEND_URL = API

class MedusaClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/store${endpoint}`
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!res.ok) {
      throw new Error(`Medusa API error: ${res.statusText}`)
    }

    return res.json()
  }

  // Products
  async getProducts(params?: {
    limit?: number
    offset?: number
    category_id?: string
    collection_id?: string
    q?: string
    order?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.offset) searchParams.set("offset", params.offset.toString())
    if (params?.category_id) searchParams.set("category_id", params.category_id)
    if (params?.collection_id) searchParams.set("collection_id", params.collection_id)
    if (params?.q) searchParams.set("q", params.q)
    if (params?.order) searchParams.set("order", params.order)

    return this.request<{ products: any[] }>(`/products?${searchParams.toString()}`)
  }

  async getProduct(handle: string) {
    return this.request<{ product: any }>(`/products?handle=${handle}`)
  }

  // Categories
  async getCategories() {
    return this.request<{ product_categories: any[] }>("/product-categories")
  }

  // Collections
  async getCollections() {
    return this.request<{ collections: any[] }>("/collections")
  }

  // Cart
  async createCart() {
    return this.request<{ cart: any }>("/carts", { method: "POST" })
  }

  async getCart(cartId: string) {
    return this.request<{ cart: any }>(`/carts/${cartId}`)
  }

  async addToCart(cartId: string, variantId: string, quantity: number) {
    return this.request<{ cart: any }>(`/carts/${cartId}/line-items`, {
      method: "POST",
      body: JSON.stringify({ variant_id: variantId, quantity }),
    })
  }

  async updateCartItem(cartId: string, lineId: string, quantity: number) {
    return this.request<{ cart: any }>(`/carts/${cartId}/line-items/${lineId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    })
  }

  async removeCartItem(cartId: string, lineId: string) {
    return this.request<{ cart: any }>(`/carts/${cartId}/line-items/${lineId}`, {
      method: "DELETE",
    })
  }

  // Regions (for multi-currency)
  async getRegions() {
    return this.request<{ regions: any[] }>("/regions")
  }

  // Shipping
  async getShippingOptions(cartId: string) {
    return this.request<{ shipping_options: any[] }>(`/carts/${cartId}/shipping-options`)
  }

  async setShippingMethod(cartId: string, optionId: string) {
    return this.request<{ cart: any }>(`/carts/${cartId}/shipping-methods`, {
      method: "POST",
      body: JSON.stringify({ option_id: optionId }),
    })
  }

  // Payment
  async initiatePayment(cartId: string) {
    return this.request<{ payment: any }>(`/carts/${cartId}/payment-sessions`, {
      method: "POST",
    })
  }

  async completeCart(cartId: string) {
    return this.request<{ order: any }>(`/carts/${cartId}/complete`, {
      method: "POST",
    })
  }

  // Orders
  async getOrder(orderId: string) {
    return this.request<{ order: any }>(`/orders/${orderId}`)
  }

  async getCustomerOrders(customerId: string) {
    return this.request<{ orders: any[] }>(`/customers/${customerId}/orders`)
  }

  // Search
  async search(query: string) {
    return this.request<{ hits: any[] }>(`/products/search?q=${encodeURIComponent(query)}`)
  }

  // Auth
  async register(email: string, password: string, firstName: string, lastName: string) {
    return this.request<{ customer: any }>("/customers", {
      method: "POST",
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    })
  }

  async login(email: string, password: string) {
    return this.request<{ customer: any; token: string }>("/auth", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async getCustomer(token: string) {
    return this.request<{ customer: any }>("/customers/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  async updateCustomer(token: string, data: Record<string, any>) {
    return this.request<{ customer: any }>("/customers/me", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
  }
}

export const medusaClient = new MedusaClient(MEDUSA_BACKEND_URL)
