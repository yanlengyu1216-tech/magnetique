const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  const categories = req.db.prepare("SELECT * FROM product_categories WHERE is_active = 1 ORDER BY name").all()
  res.json({ product_categories: categories })
})

module.exports = router
