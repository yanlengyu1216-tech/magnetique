const express = require("express")
const cors = require("cors")
const path = require("path")
const { initDatabase } = require("./database")

const app = express()
const PORT = process.env.PORT || 9000

app.use(cors({ origin: process.env.STORE_CORS?.split(",") || "http://localhost:3000", credentials: true }))
app.use(express.json())

// Initialize database
const db = initDatabase()

// Auto-seed if database is empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count
if (productCount === 0) {
  console.log("🌱 Database is empty, running seed...")
  require("./seeders/seed")
} else {
  console.log(`✓ Database has ${productCount} products`)
}

// Make db accessible to routes
app.use((req, res, next) => {
  req.db = db
  next()
})

// Routes
app.use("/store/products", require("./routes/products"))
app.use("/store/product-categories", require("./routes/categories"))
app.use("/store/collections", require("./routes/collections"))
app.use("/store/regions", require("./routes/regions"))
app.use("/store/carts", require("./routes/carts"))
app.use("/store/orders", require("./routes/orders"))
app.use("/store/customers", require("./routes/customers"))
app.use("/store/auth", require("./routes/auth"))
app.use("/store/reviews", require("./routes/reviews"))
app.use("/store/leads", require("./routes/leads"))
app.use("/admin", require("./routes/admin"))

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║     Magnetique Backend Server        ║
  ║──────────────────────────────────────║
  ║  API:     http://localhost:${PORT}/store ║
  ║  Admin:   http://localhost:${PORT}/admin ║
  ║  Health:  http://localhost:${PORT}/health ║
  ╚══════════════════════════════════════╝
  `)
})
