const express = require("express")
const { v4: uuidv4 } = require("uuid")
const router = express.Router()

// POST /store/reviews - Submit a review
router.post("/", (req, res) => {
  const db = req.db
  const { product_id, rating, text, customer_id, author } = req.body

  if (!product_id || !rating) {
    return res.status(400).json({ message: "Product ID and rating are required" })
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" })
  }

  // Check product exists
  const product = db.prepare("SELECT id FROM products WHERE id = ?").get(product_id)
  if (!product) return res.status(404).json({ message: "Product not found" })

  const id = uuidv4()
  const reviewAuthor = author || "Anonymous"

  db.prepare(`
    INSERT INTO reviews (id, product_id, customer_id, author, rating, text)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, product_id, customer_id || null, reviewAuthor, rating, text || "")

  const review = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id)
  res.json({ review })
})

module.exports = router
