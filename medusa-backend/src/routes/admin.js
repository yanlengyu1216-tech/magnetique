const express = require("express")
const { v4: uuidv4 } = require("uuid")
const router = express.Router()

// Dashboard stats
router.get("/dashboard", (req, res) => {
  const db = req.db

  const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get().count
  const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get().count
  const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM customers").get().count
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'").get().total

  res.json({
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue,
  })
})

// List orders
router.get("/orders", (req, res) => {
  const db = req.db
  const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all()

  res.json({
    orders: orders.map(o => ({
      ...o,
      items: JSON.parse(o.items || "[]"),
      shipping_method: o.shipping_method ? JSON.parse(o.shipping_method) : null,
    }))
  })
})

// Update order status
router.patch("/orders/:id", (req, res) => {
  const db = req.db
  const { status, tracking_number } = req.body

  const updates = []
  const params = []

  if (status) { updates.push("status = ?"); params.push(status) }
  if (tracking_number) { updates.push("tracking_number = ?"); params.push(tracking_number) }

  if (updates.length === 0) return res.status(400).json({ message: "No updates provided" })

  updates.push("updated_at = datetime('now')")
  params.push(req.params.id)

  db.prepare(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`).run(...params)

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id)
  res.json({ order })
})

// List customers
router.get("/customers", (req, res) => {
  const db = req.db
  const customers = db.prepare("SELECT id, email, first_name, last_name, phone, created_at FROM customers ORDER BY created_at DESC").all()
  res.json({ customers })
})

// List products (admin)
router.get("/products", (req, res) => {
  const db = req.db
  const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all()

  const result = products.map(p => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    tags: JSON.parse(p.tags || "[]"),
    variants: db.prepare("SELECT * FROM product_variants WHERE product_id = ?").all(p.id),
  }))

  res.json({ products: result })
})

// Create product (admin)
router.post("/products", (req, res) => {
  const db = req.db
  const p = req.body
  const id = uuidv4()

  db.prepare(`
    INSERT INTO products (id, title, subtitle, description, handle, material, weight, length, width, height, origin_country, hs_code, discountable, thumbnail, images, tags, category_id, collection_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, p.title, p.subtitle, p.description, p.handle || id, p.material, p.weight, p.length, p.width, p.height, p.origin_country, p.hs_code, p.discountable ?? 1, p.thumbnail, JSON.stringify(p.images || []), JSON.stringify(p.tags || []), p.category_id, p.collection_id)

  if (p.variants) {
    for (const v of p.variants) {
      db.prepare("INSERT INTO product_variants (id, product_id, title, prices, inventory_quantity) VALUES (?, ?, ?, ?, ?)")
        .run(uuidv4(), id, v.title, JSON.stringify(v.prices || []), v.inventory_quantity || 0)
    }
  }

  res.json({ product: db.prepare("SELECT * FROM products WHERE id = ?").get(id) })
})

// Delete product
router.delete("/products/:id", (req, res) => {
  req.db.prepare("DELETE FROM product_variants WHERE product_id = ?").run(req.params.id)
  req.db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id)
  res.json({ success: true })
})

// List coupons
router.get("/coupons", (req, res) => {
  const db = req.db
  const coupons = db.prepare("SELECT * FROM coupons ORDER BY rowid DESC").all()
  res.json({
    coupons: coupons.map(c => ({
      id: c.id,
      code: c.code,
      type: c.discount_type,
      value: c.discount_value,
      min_subtotal: c.min_order_amount ? c.min_order_amount * 100 : null,
      usage_limit: c.usage_limit,
      used_count: c.used_count,
      is_active: !!c.is_active,
      description: c.discount_type === "percentage" ? `Get ${c.discount_value}% off your order` : `Get $${c.discount_value} off your order`,
      expires_at: c.expires_at,
    }))
  })
})

module.exports = router
