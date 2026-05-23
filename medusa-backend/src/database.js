const Database = require("better-sqlite3")
const path = require("path")

const DB_PATH = process.env.DATABASE_URL || path.join(__dirname, "..", "magnet-store.sqlite")

function inferCategoryHandle(product) {
  const haystack = [
    product.title,
    product.subtitle,
    product.description,
    product.handle,
    product.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (haystack.includes("3d")) return "3d-magnets"
  if (haystack.includes("animal") || haystack.includes("panda")) return "animal-series"
  if (haystack.includes("custom") || haystack.includes("personalized")) return "custom-design"
  if (haystack.includes("food") || haystack.includes("pizza")) return "food-series"
  if (haystack.includes("gift") || haystack.includes("set")) return "gift-sets"
  if (haystack.includes("minimalist") || haystack.includes("moon")) return "minimalist"
  if (haystack.includes("seasonal") || haystack.includes("christmas") || haystack.includes("holiday")) return "seasonal"
  if (
    haystack.includes("travel") ||
    haystack.includes("paris") ||
    haystack.includes("rome") ||
    haystack.includes("london") ||
    haystack.includes("japan") ||
    haystack.includes("landmark")
  ) {
    return "travel-magnets"
  }

  return null
}

function getCategoryHandles(product) {
  const haystack = [
    product.title,
    product.subtitle,
    product.description,
    product.handle,
    product.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  const handles = new Set()

  if (haystack.includes("3d")) handles.add("3d-magnets")
  if (haystack.includes("animal") || haystack.includes("panda")) handles.add("animal-series")
  if (haystack.includes("custom") || haystack.includes("personalized")) handles.add("custom-design")
  if (haystack.includes("food") || haystack.includes("pizza")) handles.add("food-series")
  if (haystack.includes("gift") || haystack.includes("set")) handles.add("gift-sets")
  if (haystack.includes("minimalist") || haystack.includes("moon")) handles.add("minimalist")
  if (haystack.includes("seasonal") || haystack.includes("christmas") || haystack.includes("holiday")) handles.add("seasonal")
  if (
    haystack.includes("travel") ||
    haystack.includes("paris") ||
    haystack.includes("rome") ||
    haystack.includes("london") ||
    haystack.includes("japan") ||
    haystack.includes("landmark")
  ) {
    handles.add("travel-magnets")
  }

  return [...handles]
}

function backfillProductCategories(db) {
  const categoryRows = db
    .prepare("SELECT id, handle FROM product_categories WHERE is_active = 1")
    .all()

  const categoryMap = new Map(categoryRows.map((row) => [row.handle, row.id]))
  const uncategorizedProducts = db
    .prepare("SELECT id, title, subtitle, description, handle, tags FROM products WHERE category_id IS NULL OR category_id = ''")
    .all()

  const updateCategory = db.prepare("UPDATE products SET category_id = ?, updated_at = datetime('now') WHERE id = ?")

  let updatedCount = 0
  for (const product of uncategorizedProducts) {
    const inferredHandle = inferCategoryHandle(product)
    const categoryId = inferredHandle ? categoryMap.get(inferredHandle) : null
    if (!categoryId) continue
    updateCategory.run(categoryId, product.id)
    updatedCount += 1
  }

  if (updatedCount > 0) {
    console.log(`✓ Backfilled categories for ${updatedCount} products`)
  }
}

function syncProductCategoryLinks(db) {
  const categoryRows = db
    .prepare("SELECT id, handle FROM product_categories WHERE is_active = 1")
    .all()

  const categoryMap = new Map(categoryRows.map((row) => [row.handle, row.id]))
  const products = db
    .prepare("SELECT id, title, subtitle, description, handle, tags, category_id FROM products")
    .all()

  const upsertLink = db.prepare(`
    INSERT OR IGNORE INTO product_category_links (product_id, category_id, created_at)
    VALUES (?, ?, datetime('now'))
  `)

  let linkedCount = 0
  for (const product of products) {
    const handles = new Set(getCategoryHandles(product))

    if (product.category_id) {
      const primaryCategory = categoryRows.find((row) => row.id === product.category_id)
      if (primaryCategory?.handle) {
        handles.add(primaryCategory.handle)
      }
    }

    for (const handle of handles) {
      const categoryId = categoryMap.get(handle)
      if (!categoryId) continue
      const result = upsertLink.run(product.id, categoryId)
      if (result.changes > 0) linkedCount += 1
    }
  }

  if (linkedCount > 0) {
    console.log(`✓ Synced ${linkedCount} product-category links`)
  }
}

function initDatabase() {
  const db = new Database(DB_PATH)

  // Enable WAL mode for better performance
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")

  // Create schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS regions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      currency_code TEXT NOT NULL,
      tax_rate REAL DEFAULT 0,
      countries TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS product_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT UNIQUE NOT NULL,
      parent_category_id TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      handle TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      handle TEXT UNIQUE NOT NULL,
      material TEXT,
      weight REAL,
      length REAL,
      width REAL,
      height REAL,
      origin_country TEXT,
      hs_code TEXT,
      discountable INTEGER DEFAULT 1,
      thumbnail TEXT,
      images TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      category_id TEXT,
      collection_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      title TEXT NOT NULL,
      prices TEXT DEFAULT '[]',
      inventory_quantity INTEGER DEFAULT 0,
      manage_inventory INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_category_links (
      product_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (product_id, category_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      name TEXT,
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT,
      zip TEXT,
      country TEXT NOT NULL,
      phone TEXT,
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      region_id TEXT,
      email TEXT,
      items TEXT DEFAULT '[]',
      shipping_method TEXT,
      payment_session TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      cart_id TEXT,
      customer_id TEXT,
      email TEXT,
      items TEXT DEFAULT '[]',
      shipping_address TEXT,
      shipping_method TEXT,
      payment_method TEXT,
      subtotal REAL DEFAULT 0,
      shipping_cost REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      tracking_number TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      customer_id TEXT,
      author TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      text TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_order_amount REAL,
      usage_limit INTEGER,
      used_count INTEGER DEFAULT 0,
      expires_at TEXT,
      is_active INTEGER DEFAULT 1
    );
  `)

  console.log("✓ Database initialized (SQLite)")
  backfillProductCategories(db)
  syncProductCategoryLinks(db)
  return db
}

module.exports = { initDatabase }
