const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  const regions = req.db.prepare("SELECT * FROM regions").all()
  res.json({
    regions: regions.map(r => ({
      ...r,
      countries: JSON.parse(r.countries),
    }))
  })
})

module.exports = router
