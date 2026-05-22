const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  const collections = req.db.prepare("SELECT * FROM collections ORDER BY title").all()
  res.json({ collections })
})

module.exports = router
