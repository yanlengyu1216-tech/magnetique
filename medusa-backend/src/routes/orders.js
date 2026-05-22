const express = require("express")
const router = express.Router()

// Get order by id
router.get("/:id", (req, res) => {
  const order = req.db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id)
  if (!order) return res.status(404).json({ message: "Order not found" })

  res.json({
    order: {
      id: order.id,
      cart_id: order.cart_id,
      email: order.email,
      items: JSON.parse(order.items || "[]"),
      shipping_address: order.shipping_address ? JSON.parse(order.shipping_address) : null,
      shipping_method: order.shipping_method ? JSON.parse(order.shipping_method) : null,
      payment_method: order.payment_method,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      status: order.status,
      tracking_number: order.tracking_number,
      created_at: order.created_at,
    }
  })
})

// Get customer orders
router.get("/customer/:customerId", (req, res) => {
  const orders = req.db.prepare("SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC").all(req.params.customerId)

  res.json({
    orders: orders.map(order => ({
      id: order.id,
      email: order.email,
      items: JSON.parse(order.items || "[]"),
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
    }))
  })
})

module.exports = router
