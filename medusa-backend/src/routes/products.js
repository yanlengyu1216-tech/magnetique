const express = require("express")
const router = express.Router()

// GET /store/products
router.get("/", (req, res) => {
  const db = req.db
  const requestedCategoryId = req.query.category_id
  let requestedCategoryHandle = req.query.category_handle || null

  if (requestedCategoryId && !requestedCategoryHandle) {
    const category = db.prepare("SELECT handle FROM product_categories WHERE id = ?").get(requestedCategoryId)
    requestedCategoryHandle = category?.handle || null
  }

  let query = `SELECT p.*, pc.name as category_name, pc.handle as category_handle
    FROM products p
    LEFT JOIN product_categories pc ON p.category_id = pc.id
    WHERE 1=1`
  const params = []

  if (req.query.q) {
    query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`
    params.push(`%${req.query.q}%`, `%${req.query.q}%`, `%${req.query.q}%`)
  }
  if (req.query.handle) {
    query += ` AND p.handle = ?`
    params.push(req.query.handle)
  }
  if (req.query.category_id) {
    query += ` AND p.category_id = ?`
    params.push(req.query.category_id)
  }
  if (req.query.category_handle) {
    query += ` AND pc.handle = ?`
    params.push(req.query.category_handle)
  }
  if (req.query.on_sale === "true") {
    query += ` AND EXISTS (
      SELECT 1
      FROM product_variants pv
      WHERE pv.product_id = p.id
      AND EXISTS (
        SELECT 1
        FROM json_each(pv.prices)
        WHERE CAST(json_extract(json_each.value, '$.original_amount') AS INTEGER) >
              CAST(COALESCE(json_extract(json_each.value, '$.a'), json_extract(json_each.value, '$.amount'), 0) AS INTEGER)
      )
    )`
  }

  const orderMap = {
    price_asc: `COALESCE((
      SELECT MIN(CAST(COALESCE(json_extract(json_each.value, '$.a'), json_extract(json_each.value, '$.amount'), 0) AS INTEGER))
      FROM product_variants pv
      JOIN json_each(pv.prices)
      WHERE pv.product_id = p.id
    ), 0) ASC`,
    price_desc: `COALESCE((
      SELECT MAX(CAST(COALESCE(json_extract(json_each.value, '$.a'), json_extract(json_each.value, '$.amount'), 0) AS INTEGER))
      FROM product_variants pv
      JOIN json_each(pv.prices)
      WHERE pv.product_id = p.id
    ), 0) DESC`,
    top_rated: `COALESCE((
      SELECT AVG(r.rating)
      FROM reviews r
      WHERE r.product_id = p.id
    ), 0) DESC, p.created_at DESC`,
    newest: `p.created_at DESC`,
  }

  const sortKey = req.query.order || req.query.sort || "newest"
  query += ` ORDER BY ${orderMap[sortKey] || orderMap.newest}`

  if (req.query.limit) {
    query += ` LIMIT ?`
    params.push(parseInt(req.query.limit))
  }
  if (req.query.offset) {
    query += ` OFFSET ?`
    params.push(parseInt(req.query.offset))
  }

  const products = db.prepare(query).all(...params)

  // Attach variants to each product
  const getVariants = db.prepare("SELECT * FROM product_variants WHERE product_id = ?")
  const getReviews = db.prepare("SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ?")

  let result = products.map(p => {
    const variants = getVariants.all(p.id)
    const reviewStats = getReviews.get(p.id)
    const images = JSON.parse(p.images || "[]")
    const tags = JSON.parse(p.tags || "[]")

    return {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      handle: p.handle,
      material: p.material,
      weight: p.weight,
      length: p.length,
      width: p.width,
      height: p.height,
      origin_country: p.origin_country,
      hs_code: p.hs_code,
      discountable: !!p.discountable,
      thumbnail: p.thumbnail,
      images,
      tags: tags.map((t, i) => ({ id: `${p.id}-tag-${i}`, value: t })),
      variants: variants.map(v => ({
        id: v.id,
        title: v.title,
        prices: JSON.parse(v.prices),
        inventory_quantity: v.inventory_quantity,
        manage_inventory: !!v.manage_inventory,
      })),
      category: p.category_name ? { id: p.category_id, name: p.category_name, handle: p.category_handle } : null,
      rating: reviewStats.avg_rating ? Math.round(reviewStats.avg_rating * 10) / 10 : 0,
      review_count: reviewStats.count || 0,
      created_at: p.created_at,
    }
  })

  if (requestedCategoryHandle) {
    result = result.filter((product) => db.filterProductsByCategory(product, requestedCategoryHandle))
  }

  res.json({ products: result, count: result.length })
})

// GET /store/products/:id
router.get("/:id", (req, res) => {
  const db = req.db
  const product = db.prepare(`
    SELECT p.*, pc.name as category_name, pc.handle as category_handle
    FROM products p
    LEFT JOIN product_categories pc ON p.category_id = pc.id
    WHERE p.id = ? OR p.handle = ?
  `).get(req.params.id, req.params.id)

  if (!product) return res.status(404).json({ message: "Product not found" })

  const variants = db.prepare("SELECT * FROM product_variants WHERE product_id = ?").all(product.id)
  const reviews = db.prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC").all(product.id)
  const reviewStats = db.prepare("SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ?").get(product.id)

  const images = JSON.parse(product.images || "[]")
  const tags = JSON.parse(product.tags || "[]")

  res.json({
    product: {
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      handle: product.handle,
      material: product.material,
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
      origin_country: product.origin_country,
      hs_code: product.hs_code,
      discountable: !!product.discountable,
      thumbnail: product.thumbnail,
      images,
      tags: tags.map((t, i) => ({ id: `${product.id}-tag-${i}`, value: t })),
      variants: variants.map(v => ({
        id: v.id,
        title: v.title,
        prices: JSON.parse(v.prices),
        inventory_quantity: v.inventory_quantity,
        manage_inventory: !!v.manage_inventory,
      })),
      category: product.category_name ? { id: product.category_id, name: product.category_name, handle: product.category_handle } : null,
      rating: reviewStats.avg_rating ? Math.round(reviewStats.avg_rating * 10) / 10 : 0,
      review_count: reviewStats.count || 0,
      reviews: reviews.map(r => ({
        id: r.id,
        author: r.author,
        rating: r.rating,
        text: r.text,
        created_at: r.created_at,
      })),
      created_at: product.created_at,
    }
  })
})

module.exports = router
