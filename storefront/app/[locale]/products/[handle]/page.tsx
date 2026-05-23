"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import {
  Minus, Plus, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw,
  Star, ChevronLeft, ChevronRight, Loader2
} from "lucide-react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { ProductCard } from "@/components/product/ProductCard"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { API } from "@/lib/api"

export default function ProductDetailPage() {
  const t = useTranslations("product")
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const cartItems = useCartStore((s) => s.items)
  const wishlistItems = useWishlistStore((s) => s.items)
  const addWishlist = useWishlistStore((s) => s.addItem)
  const removeWishlist = useWishlistStore((s) => s.removeItem)

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description")
  const [addedToCart, setAddedToCart] = useState(false)

  const handle_ = typeof params.handle === "string" ? params.handle : ""

  const isInWishlist = product ? wishlistItems.some((i) => i.id === product.id) : false

  useEffect(() => {
    if (product) document.title = `${product.title} | Magnetique`
  }, [product])

  useEffect(() => {
    async function fetchProduct() {
      if (!handle_) return
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API}/store/products/${handle_}`)
        if (!res.ok) throw new Error("Product not found")
        const data = await res.json()
        setProduct(data.product)

        const relRes = await fetch(`${API}/store/products?limit=4`)
        if (relRes.ok) {
          const relData = await relRes.json()
          setRelatedProducts((relData.products || []).filter((p: any) => p.id !== data.product.id).slice(0, 4))
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [handle_, API])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <button onClick={() => router.back()} className="text-brand-600 font-medium hover:underline">Go Back</button>
      </div>
    )
  }

  const variant = product.variants?.[selectedVariant]
  const usdPrice = variant?.prices?.find((p: any) => p.c === "usd" || p.currency_code === "usd")
  const price = usdPrice ? usdPrice.a / 100 : 0
  const originalUsdPrice = variant?.prices?.find((p: any) => p.original_amount)
  const originalPrice = originalUsdPrice ? originalUsdPrice.original_amount / 100 : undefined
  const hasSale = originalPrice && originalPrice > price

  const currentImages = product.images?.length ? product.images : [product.thumbnail].filter(Boolean)

  const handleAddToCart = () => {
    if (!product || !variant) return
    addItem({
      id: variant.id,
      productId: product.id,
      handle: product.handle,
      title: product.title,
      variant: variant.id,
      variantTitle: variant.title,
      image: product.thumbnail || "",
      price,
      originalPrice: hasSale ? originalPrice : undefined,
      maxQuantity: variant.inventory_quantity || 99,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const toggleWishlist = () => {
    if (!product) return
    if (isInWishlist) {
      removeWishlist(product.id)
    } else {
      addWishlist({
        id: product.id,
        handle: product.handle,
        title: product.title,
        thumbnail: product.thumbnail || "",
        price,
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.title },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative group">
              <img
                src={currentImages[selectedImage] || "/placeholder.png"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {currentImages.length > 1 && (
                <>
                  <button className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    onClick={() => setSelectedImage((prev) => Math.max(0, prev - 1))}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    onClick={() => setSelectedImage((prev) => Math.min(currentImages.length - 1, prev + 1))}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {currentImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {currentImages.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? "border-brand-600 shadow-md" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            {product.category && (
              <span className="inline-block bg-brand-100 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {product.category.name?.toUpperCase()}
              </span>
            )}

            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
              {product.title}
            </h1>
            {product.subtitle && <p className="text-gray-500">{product.subtitle}</p>}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
              {hasSale && (
                <span className="text-xl text-gray-400 line-through">${originalPrice!.toFixed(2)}</span>
              )}
              {hasSale && (
                <span className="text-sm text-green-600 font-medium">
                  -{Math.round((1 - price / originalPrice!) * 100)}%
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.review_count} reviews)</span>
            </div>

            {/* Variants */}
            {product.variants?.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Size</h3>
                <div className="flex gap-2">
                  {product.variants.map((v: any, i: number) => {
                    const vPrice = v.prices?.find((p: any) => p.c === "usd" || p.currency_code === "usd")
                    const vPriceDollars = vPrice ? vPrice.a / 100 : 0
                    return (
                      <button
                        key={v.id}
                        onClick={() => { setSelectedVariant(i); setQuantity(1) }}
                        className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          i === selectedVariant
                            ? "border-brand-600 bg-brand-50 text-brand-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        } ${v.inventory_quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={v.inventory_quantity === 0}
                      >
                        {v.title} - ${vPriceDollars.toFixed(2)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(variant?.inventory_quantity || 99, quantity + 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">{variant?.inventory_quantity || 0} in stock</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white shadow-green-200"
                    : "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200"
                }`}
              >
                {addedToCart ? "✓ Added!" : (
                  <><ShoppingCart className="h-5 w-5" /> Add to Cart</>
                )}
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-3.5 rounded-xl border transition-all ${
                  isInWishlist ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`} />
              </button>
              <button className="p-3.5 rounded-xl border border-gray-200 text-gray-400 hover:text-brand-600 hover:border-brand-200 transition-all">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              {[
                { icon: Truck, text: "Free shipping on orders over $50" },
                { icon: Shield, text: "Secure checkout with SSL encryption" },
                { icon: RotateCcw, text: "30-day easy return policy" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <feature.icon className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* SKU & details */}
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 pt-4 border-t border-gray-100">
              {product.material && <div><span className="text-gray-900 font-medium">Material:</span> {product.material}</div>}
              {product.origin_country && <div><span className="text-gray-900 font-medium">Origin:</span> {product.origin_country}</div>}
              {product.weight && <div><span className="text-gray-900 font-medium">Weight:</span> {product.weight}g</div>}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {["description", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-brand-600 text-brand-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "description" ? "Description" : `Reviews (${product.review_count || 0})`}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === "description" ? (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                {product.tags?.length > 0 && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {tag.value}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-8 max-w-2xl">
                {/* Rating summary */}
                {product.reviews?.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                      <div className="flex justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{product.review_count} reviews</p>
                    </div>
                  </div>
                )}

                {/* Existing reviews */}
                <div className="space-y-4">
                  {product.reviews?.length > 0 ? product.reviews.map((review: any) => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{review.author}</p>
                          <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  )}
                </div>

                {/* Write a review form */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <ReviewForm productId={product.id} onSubmitted={() => {
                    // Refresh product data
                    fetch(`${API}/store/products/${handle_}`).then(r => r.json()).then(d => setProduct(d.product))
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={{
                  id: p.id,
                  handle: p.handle,
                  title: p.title,
                  thumbnail: p.thumbnail || "",
                  price: (p.variants?.[0]?.prices?.find((pr: any) => pr.c === "usd" || pr.currency_code === "usd")?.a || 0) / 100,
                  rating: p.rating || 0,
                  reviewCount: p.review_count || 0,
                  isNew: false,
                  isOnSale: false,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState("")
  const [author, setAuthor] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError("Please select a rating"); return }
    setError("")
    setSubmitting(true)
    try {
      const customerStr = localStorage.getItem("magnet-customer")
      const customer = customerStr ? JSON.parse(customerStr) : null
      const res = await fetch(`${API}/store/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          text,
          author: author || customer ? `${customer.first_name} ${customer.last_name}`.trim() || "Anonymous" : "Anonymous",
          customer_id: customer?.id || null,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit review")
      setSubmitted(true)
      setRating(0)
      setText("")
      setAuthor("")
      setTimeout(() => { setSubmitted(false); onSubmitted() }, 1500)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
      {submitted && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">Review submitted! Refreshing...</div>}

      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
            >
              <Star className={`h-7 w-7 transition-colors ${
                star <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
              }`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Review</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          rows={4} placeholder="Share your thoughts about this product..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none" />
      </div>

      <button type="submit" disabled={submitting}
        className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
}
