const express = require("express")
const { v4: uuidv4 } = require("uuid")

const router = express.Router()

router.post("/contact", (req, res) => {
  const db = req.db
  const { first_name, last_name, email, subject, message } = req.body

  if (!first_name || !last_name || !email || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const id = uuidv4()
  db.prepare(`
    INSERT INTO contact_inquiries (id, first_name, last_name, email, subject, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, first_name, last_name, email, subject, message)

  res.json({
    inquiry: {
      id,
      first_name,
      last_name,
      email,
      subject,
      message,
      status: "new",
    },
  })
})

router.post("/custom-requests", (req, res) => {
  const db = req.db
  const {
    name,
    email,
    material,
    size,
    quantity,
    notes,
    image_name,
    image_data,
  } = req.body

  if (!name || !email || !material || !size || !quantity) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const id = uuidv4()
  db.prepare(`
    INSERT INTO custom_requests (id, name, email, material, size, quantity, notes, image_name, image_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    name,
    email,
    material,
    size,
    quantity,
    notes || "",
    image_name || null,
    image_data || null
  )

  res.json({
    request: {
      id,
      name,
      email,
      material,
      size,
      quantity,
      notes: notes || "",
      image_name: image_name || null,
      status: "new",
    },
  })
})

module.exports = router
