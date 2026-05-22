const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || "magnet-jwt-secret-key-2024"

// POST /store/auth - Login
router.post("/", (req, res) => {
  const db = req.db
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  const customer = db.prepare("SELECT * FROM customers WHERE email = ?").get(email)
  if (!customer) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const valid = bcrypt.compareSync(password, customer.password_hash)
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = jwt.sign(
    { customer_id: customer.id, email: customer.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.json({
    customer: {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
    },
    token,
  })
})

module.exports = router
