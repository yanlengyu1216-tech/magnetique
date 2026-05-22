const { v4: uuidv4 } = require("uuid")

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (req.method === "OPTIONS") return next()

  // Some endpoints are public
  const publicPrefixes = ["/store/products", "/store/product-categories", "/store/collections", "/store/regions", "/store/auth", "/store/carts"]
  const isPublic = publicPrefixes.some(p => req.path.startsWith(p))

  if (isPublic && !req.path.includes("/customers/me")) {
    return next()
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    try {
      const jwt = require("jsonwebtoken")
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "magnet-jwt-secret-key-2024")
      req.customer_id = decoded.customer_id
      req.customer_email = decoded.email
    } catch (err) {
      // Token invalid, continue without auth
    }
  }

  next()
}
