const express = require("express")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")
const router = express.Router()

// Register
router.post("/", (req, res) => {
  const db = req.db
  const { email, password, first_name, last_name } = req.body

  if (!email || !password) return res.status(400).json({ message: "Email and password are required" })

  const existing = db.prepare("SELECT id FROM customers WHERE email = ?").get(email)
  if (existing) return res.status(409).json({ message: "Email already registered" })

  const id = uuidv4()
  const passwordHash = bcrypt.hashSync(password, 10)

  db.prepare("INSERT INTO customers (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)")
    .run(id, email, passwordHash, first_name || "", last_name || "")

  const customer = db.prepare("SELECT id, email, first_name, last_name, phone, created_at FROM customers WHERE id = ?").get(id)

  const jwt = require("jsonwebtoken")
  const token = jwt.sign(
    { customer_id: customer.id, email: customer.email },
    process.env.JWT_SECRET || "magnet-jwt-secret-key-2024",
    { expiresIn: "7d" }
  )

  res.json({ customer, token })
})

// Get current customer (requires token in header)
router.get("/me", (req, res) => {
  const db = req.db
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" })

  try {
    const jwt = require("jsonwebtoken")
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "magnet-jwt-secret-key-2024")

    const customer = db.prepare("SELECT id, email, first_name, last_name, phone, created_at FROM customers WHERE id = ?").get(decoded.customer_id)
    if (!customer) return res.status(404).json({ message: "Customer not found" })

    const addresses = db.prepare("SELECT * FROM addresses WHERE customer_id = ?").all(customer.id)

    res.json({
      customer: {
        ...customer,
        addresses,
      }
    })
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
})

// Update current customer
router.put("/me", (req, res) => {
  const db = req.db
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" })

  try {
    const jwt = require("jsonwebtoken")
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "magnet-jwt-secret-key-2024")

    const { first_name, last_name, phone } = req.body
    db.prepare("UPDATE customers SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), phone = COALESCE(?, phone), updated_at = datetime('now') WHERE id = ?")
      .run(first_name, last_name, phone, decoded.customer_id)

    const customer = db.prepare("SELECT id, email, first_name, last_name, phone, created_at FROM customers WHERE id = ?").get(decoded.customer_id)

    res.json({ customer })
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
})

// Addresses
router.get("/me/addresses", (req, res) => {
  const db = req.db
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" })

  try {
    const jwt = require("jsonwebtoken")
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "magnet-jwt-secret-key-2024")

    const addresses = db.prepare("SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC").all(decoded.customer_id)
    res.json({ addresses })
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
})

router.post("/me/addresses", (req, res) => {
  const db = req.db
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" })

  try {
    const jwt = require("jsonwebtoken")
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "magnet-jwt-secret-key-2024")

    const { name, street, city, state, zip, country, phone } = req.body
    const id = uuidv4()

    db.prepare("INSERT INTO addresses (id, customer_id, name, street, city, state, zip, country, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(id, decoded.customer_id, name, street, city, state, zip, country, phone)

    const address = db.prepare("SELECT * FROM addresses WHERE id = ?").get(id)
    res.json({ address })
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
})

router.delete("/me/addresses/:addressId", (req, res) => {
  const db = req.db
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" })
  try {
    const jwt = require("jsonwebtoken")
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "magnet-jwt-secret-key-2024")
    db.prepare("DELETE FROM addresses WHERE id = ? AND customer_id = ?").run(req.params.addressId, decoded.customer_id)
    res.json({ success: true })
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
})

router.put("/me/addresses/:addressId/default", (req, res) => {
  const db = req.db
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" })
  try {
    const jwt = require("jsonwebtoken")
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "magnet-jwt-secret-key-2024")
    db.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").run(decoded.customer_id)
    db.prepare("UPDATE addresses SET is_default = 1 WHERE id = ? AND customer_id = ?").run(req.params.addressId, decoded.customer_id)
    res.json({ success: true })
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
})

module.exports = router
