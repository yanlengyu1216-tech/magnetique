const express = require("express")
const { v4: uuidv4 } = require("uuid")
const router = express.Router()

const shippingOptions = [
  { id: "ship_standard", name: "Standard Shipping", price: 499, currency_code: "usd", delivery_days: "5-7 business days" },
  { id: "ship_express", name: "Express Shipping", price: 1299, currency_code: "usd", delivery_days: "2-3 business days" },
  { id: "ship_free", name: "Free Shipping", price: 0, currency_code: "usd", delivery_days: "7-10 business days", min_subtotal: 5000 },
  { id: "ship_standard_eu", name: "Standard Shipping", price: 499, currency_code: "eur", delivery_days: "7-10 business days" },
  { id: "ship_express_eu", name: "Express Shipping", price: 1299, currency_code: "eur", delivery_days: "2-3 business days" },
  { id: "ship_free_eu", name: "Free Shipping", price: 0, currency_code: "eur", delivery_days: "10-14 business days", min_subtotal: 5000 },
  { id: "ship_standard_uk", name: "Standard Shipping", price: 299, currency_code: "gbp", delivery_days: "5-7 business days" },
]

// Create cart
router.post("/", (req, res) => {
  const db = req.db
  const id = uuidv4()
  const regionId = req.body.region_id || null
  const email = req.body.email || null

  db.prepare("INSERT INTO carts (id, region_id, email) VALUES (?, ?, ?)").run(id, regionId, email)

  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(id)
  res.json({
    cart: {
      id: cart.id,
      items: [],
      region_id: cart.region_id,
      email: cart.email,
      shipping_method: null,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    }
  })
})

// Get cart
router.get("/:id", (req, res) => {
  const db = req.db
  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)

  if (!cart) return res.status(404).json({ message: "Cart not found" })

  const items = JSON.parse(cart.items || "[]")
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingPrice = cart.shipping_method ? (JSON.parse(cart.shipping_method).price || 0) : 0
  const shipping = shippingPrice / 100
  const total = subtotal + shipping

  res.json({
    cart: {
      id: cart.id,
      items,
      region_id: cart.region_id,
      email: cart.email,
      shipping_method: cart.shipping_method ? JSON.parse(cart.shipping_method) : null,
      subtotal,
      shipping,
      tax: 0,
      total,
    }
  })
})

// Add to cart
router.post("/:id/line-items", (req, res) => {
  const db = req.db
  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)
  if (!cart) return res.status(404).json({ message: "Cart not found" })

  const { variant_id, quantity } = req.body
  const variant = db.prepare("SELECT * FROM product_variants WHERE id = ?").get(variant_id)
  if (!variant) return res.status(404).json({ message: "Variant not found" })

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(variant.product_id)

  const prices = JSON.parse(variant.prices)
  const price = prices.find(p => (p.currency_code === "usd" || p.c === "usd")) || prices[0]

  let items = JSON.parse(cart.items || "[]")

  const existingIndex = items.findIndex(i => i.variant_id === variant_id)
  if (existingIndex >= 0) {
    items[existingIndex].quantity += quantity
  } else {
    items.push({
      id: uuidv4(),
      variant_id: variant.id,
      product_id: product.id,
      title: product.title,
      variant_title: variant.title,
      thumbnail: product.thumbnail,
      quantity,
      price: (price.amount || price.a) / 100,
      currency_code: price.currency_code || price.c,
    })
  }

  db.prepare("UPDATE carts SET items = ?, updated_at = datetime('now') WHERE id = ?").run(JSON.stringify(items), cart.id)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  res.json({
    cart: {
      id: cart.id,
      items,
      subtotal,
      shipping: 0,
      tax: 0,
      total: subtotal,
    }
  })
})

// Update cart item
router.patch("/:id/line-items/:lineId", (req, res) => {
  const db = req.db
  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)
  if (!cart) return res.status(404).json({ message: "Cart not found" })

  let items = JSON.parse(cart.items || "[]")
  const idx = items.findIndex(i => i.id === req.params.lineId)

  if (idx === -1) return res.status(404).json({ message: "Item not found" })

  items[idx].quantity = req.body.quantity
  db.prepare("UPDATE carts SET items = ?, updated_at = datetime('now') WHERE id = ?").run(JSON.stringify(items), cart.id)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  res.json({ cart: { id: cart.id, items, subtotal, total: subtotal } })
})

// Remove cart item
router.delete("/:id/line-items/:lineId", (req, res) => {
  const db = req.db
  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)
  if (!cart) return res.status(404).json({ message: "Cart not found" })

  let items = JSON.parse(cart.items || "[]")
  items = items.filter(i => i.id !== req.params.lineId)
  db.prepare("UPDATE carts SET items = ?, updated_at = datetime('now') WHERE id = ?").run(JSON.stringify(items), cart.id)

  res.json({ cart: { id: cart.id, items, subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0), total: items.reduce((s, i) => s + i.price * i.quantity, 0) } })
})

// Get shipping options
router.get("/:id/shipping-options", (req, res) => {
  const cart = req.db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)
  if (!cart) return res.status(404).json({ message: "Cart not found" })

  const items = JSON.parse(cart.items || "[]")
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  const options = shippingOptions
    .filter(o => !o.min_subtotal || subtotal >= o.min_subtotal)
    .map(o => ({
      id: o.id,
      name: o.name,
      amount: o.price,
      currency_code: o.currency_code,
      data: { delivery_days: o.delivery_days },
    }))

  res.json({ shipping_options: options })
})

// Set shipping method
router.post("/:id/shipping-methods", (req, res) => {
  const db = req.db
  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)
  if (!cart) return res.status(404).json({ message: "Cart not found" })

  const option = shippingOptions.find(o => o.id === req.body.option_id)
  if (!option) return res.status(404).json({ message: "Shipping option not found" })

  db.prepare("UPDATE carts SET shipping_method = ?, updated_at = datetime('now') WHERE id = ?").run(JSON.stringify(option), cart.id)

  const items = JSON.parse(cart.items || "[]")
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  res.json({
    cart: {
      id: cart.id,
      items,
      shipping_method: option,
      subtotal,
      shipping: option.price / 100,
      total: subtotal + option.price / 100,
    }
  })
})

// Initiate payment
router.post("/:id/payment-sessions", (req, res) => {
  const db = req.db
  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)
  if (!cart) return res.status(404).json({ message: "Cart not found" })

  const session = {
    id: uuidv4(),
    provider_id: req.body.provider_id || "stripe",
    status: "authorized",
    data: {},
  }

  db.prepare("UPDATE carts SET payment_session = ?, updated_at = datetime('now') WHERE id = ?").run(JSON.stringify(session), cart.id)

  res.json({ cart: { ...cart, payment_session: session } })
})

// Complete cart (create order)
router.post("/:id/complete", (req, res) => {
  const db = req.db
  const cart = db.prepare("SELECT * FROM carts WHERE id = ?").get(req.params.id)
  if (!cart) return res.status(404).json({ message: "Cart not found" })

  const items = JSON.parse(cart.items || "[]")
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingMethod = cart.shipping_method ? JSON.parse(cart.shipping_method) : null
  const shipping = shippingMethod?.price ? shippingMethod.price / 100 : 0
  const total = subtotal + shipping

  const orderId = uuidv4()
  const shippingAddress = req.body.shipping_address ? JSON.stringify(req.body.shipping_address) : null
  const customerId = req.body.customer_id || cart.customer_id || null
  db.prepare(`
    INSERT INTO orders (id, cart_id, customer_id, email, items, shipping_address, shipping_method, subtotal, shipping_cost, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
  `).run(orderId, cart.id, customerId, cart.email, JSON.stringify(items), shippingAddress, cart.shipping_method, subtotal, shipping, total)

  // Mark cart as completed
  db.prepare("UPDATE carts SET completed = 1, updated_at = datetime('now') WHERE id = ?").run(cart.id)

  res.json({
    type: "order",
    data: {
      id: orderId,
      items,
      subtotal,
      shipping_cost: shipping,
      total,
      status: "confirmed",
      created_at: new Date().toISOString(),
    }
  })
})

module.exports = router
