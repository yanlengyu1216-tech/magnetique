const path = require("path")
const Database = require("better-sqlite3")
const { v4: uuidv4 } = require("uuid")

const DB_PATH = process.env.DATABASE_URL || path.join(__dirname, "..", "..", "magnet-store.sqlite")
const db = new Database(DB_PATH)

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

db.exec(`
  CREATE TABLE IF NOT EXISTS regions (id TEXT PRIMARY KEY, name TEXT NOT NULL, currency_code TEXT NOT NULL, tax_rate REAL DEFAULT 0, countries TEXT DEFAULT '[]', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS product_categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, handle TEXT UNIQUE NOT NULL, parent_category_id TEXT, is_active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS collections (id TEXT PRIMARY KEY, title TEXT NOT NULL, handle TEXT UNIQUE NOT NULL, created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT, description TEXT, handle TEXT UNIQUE NOT NULL, material TEXT, weight REAL, length REAL, width REAL, height REAL, origin_country TEXT, hs_code TEXT, discountable INTEGER DEFAULT 1, thumbnail TEXT, images TEXT DEFAULT '[]', tags TEXT DEFAULT '[]', category_id TEXT, collection_id TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS product_variants (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, title TEXT NOT NULL, prices TEXT DEFAULT '[]', inventory_quantity INTEGER DEFAULT 0, manage_inventory INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE);
  CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, first_name TEXT, last_name TEXT, phone TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS addresses (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, name TEXT, street TEXT NOT NULL, city TEXT NOT NULL, state TEXT, zip TEXT, country TEXT NOT NULL, phone TEXT, is_default INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE);
  CREATE TABLE IF NOT EXISTS carts (id TEXT PRIMARY KEY, customer_id TEXT, region_id TEXT, email TEXT, items TEXT DEFAULT '[]', shipping_method TEXT, payment_session TEXT, completed INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, cart_id TEXT, customer_id TEXT, email TEXT, items TEXT DEFAULT '[]', shipping_address TEXT, shipping_method TEXT, payment_method TEXT, subtotal REAL DEFAULT 0, shipping_cost REAL DEFAULT 0, tax REAL DEFAULT 0, total REAL DEFAULT 0, status TEXT DEFAULT 'pending', tracking_number TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, customer_id TEXT, author TEXT NOT NULL, rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5), text TEXT, created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS coupons (id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, discount_type TEXT NOT NULL, discount_value REAL NOT NULL, min_order_amount REAL, usage_limit INTEGER, used_count INTEGER DEFAULT 0, expires_at TEXT, is_active INTEGER DEFAULT 1);
`)

console.log("🌱 Seeding Magnetique store...\n")

db.exec(`DELETE FROM reviews; DELETE FROM orders; DELETE FROM carts; DELETE FROM addresses; DELETE FROM customers; DELETE FROM product_variants; DELETE FROM products; DELETE FROM collections; DELETE FROM product_categories; DELETE FROM regions; DELETE FROM coupons;`)

const regionIds = []
for (const r of [{name:"EU",currency:"eur",tax:19,countries:JSON.stringify(["DE","FR","ES","IT","NL","BE"])},{name:"US",currency:"usd",tax:0,countries:JSON.stringify(["US","CA"])},{name:"UK",currency:"gbp",tax:20,countries:JSON.stringify(["GB"])}]) {
  const id=uuidv4(); regionIds.push(id)
  db.prepare("INSERT INTO regions (id,name,currency_code,tax_rate,countries) VALUES (?,?,?,?,?)").run(id,r.name,r.currency,r.tax,r.countries)
}
console.log(`  ✓ ${regionIds.length} regions created`)

const catIds={}
for (const c of [{n:"Travel Magnets",h:"travel-magnets"},{n:"Custom Design",h:"custom-design"},{n:"Seasonal",h:"seasonal"},{n:"Animal Series",h:"animal-series"},{n:"Food Series",h:"food-series"},{n:"Minimalist",h:"minimalist"},{n:"3D Magnets",h:"3d-magnets"},{n:"Gift Sets",h:"gift-sets"}]) {
  const id=uuidv4(); catIds[c.h]=id
  db.prepare("INSERT INTO product_categories (id,name,handle) VALUES (?,?,?)").run(id,c.n,c.h)
}
console.log(`  ✓ ${Object.keys(catIds).length} categories created`)

const colIds={}
for (const c of [{t:"Best Sellers",h:"best-sellers"},{t:"New Arrivals",h:"new-arrivals"},{t:"Gift Ideas",h:"gift-ideas"}]) {
  const id=uuidv4(); colIds[c.h]=id
  db.prepare("INSERT INTO collections (id,title,handle) VALUES (?,?,?)").run(id,c.t,c.h)
}
console.log(`  ✓ 3 collections created`)

const products = [
  {id:uuidv4(),t:"Eiffel Tower Paris Magnet",s:"Handcrafted ceramic refrigerator magnet",h:"eiffel-tower-paris-magnet",d:"Beautiful hand-painted ceramic magnet featuring the iconic Eiffel Tower.",m:"Ceramic",w:50,l:6,wd:4,ht:0.5,oc:"CN",hs:"6914.10",th:"https://images.unsplash.com/photo-1549144511-f099e773c147?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1549144511-f099e773c147?w=800","https://images.unsplash.com/photo-1543348751-2c0c8e39f6b6?w=800"]),tg:JSON.stringify(["paris","france","travel","landmark"]),vs:[{t:"Standard",p:[{a:899,c:"usd"},{a:799,c:"eur"},{a:699,c:"gbp"}],q:150},{t:"Large",p:[{a:1299,c:"usd"},{a:1199,c:"eur"},{a:999,c:"gbp"}],q:80}]},
  {id:uuidv4(),t:"Colosseum Rome Magnet",s:"Rustic stone-finish refrigerator magnet",h:"colosseum-rome-magnet",d:"Intricately detailed magnet of the Roman Colosseum.",m:"Resin",w:45,l:5.5,wd:4,ht:0.6,oc:"CN",hs:"3926.40",th:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800"]),tg:JSON.stringify(["rome","italy","travel","history"]),vs:[{t:"Standard",p:[{a:799,c:"usd"},{a:699,c:"eur"},{a:599,c:"gbp"}],q:200}]},
  {id:uuidv4(),t:"Custom Family Portrait Magnet",s:"Personalized ceramic magnet with your family photo",h:"custom-family-portrait-magnet",d:"Turn your favorite family photo into a beautiful ceramic magnet.",m:"Ceramic",w:60,l:8,wd:6,ht:0.5,oc:"CN",hs:"6914.10",th:"https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800"]),tg:JSON.stringify(["custom","personalized","family","gift"]),vs:[{t:"Small (6x4 inch)",p:[{a:1999,c:"usd"},{a:1799,c:"eur"},{a:1599,c:"gbp"}],q:50},{t:"Large (8x6 inch)",p:[{a:2999,c:"usd"},{a:2699,c:"eur"},{a:2499,c:"gbp"}],q:30}],disc:0},
  {id:uuidv4(),t:"Christmas Reindeer Magnet Set",s:"Set of 4 festive reindeer magnets",h:"christmas-reindeer-magnet-set",d:"Bring holiday cheer with this charming set of 4 hand-painted reindeer magnets.",m:"Wood",w:80,l:5,wd:3,ht:1,oc:"CN",hs:"4420.10",th:"https://images.unsplash.com/photo-1579038773867-044c48829161?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1579038773867-044c48829161?w=800"]),tg:JSON.stringify(["christmas","reindeer","holiday","set"]),vs:[{t:"Set of 4",p:[{a:1599,c:"usd"},{a:1399,c:"eur"},{a:1199,c:"gbp"}],q:100},{t:"Set of 6",p:[{a:2199,c:"usd"},{a:1999,c:"eur"},{a:1799,c:"gbp"}],q:60}]},
  {id:uuidv4(),t:"Sakura Cherry Blossom Magnet",s:"Elegant Japanese cherry blossom design",h:"sakura-cherry-blossom-magnet",d:"Delicately crafted magnet featuring cherry blossoms on a porcelain base.",m:"Porcelain",w:35,l:4.5,wd:4.5,ht:0.4,oc:"CN",hs:"6911.10",th:"https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800"]),tg:JSON.stringify(["sakura","japan","cherry-blossom","floral"]),vs:[{t:"Standard",p:[{a:699,c:"usd"},{a:599,c:"eur"},{a:499,c:"gbp"}],q:300}]},
  {id:uuidv4(),t:"Panda 3D Magnet",s:"Cute 3D sculpted panda refrigerator magnet",h:"panda-3d-magnet",d:"Adorable 3D panda magnet from high-quality resin with detailed hand-painting.",m:"Resin",w:40,l:4,wd:3,ht:2.5,oc:"CN",hs:"3926.40",th:"https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800"]),tg:JSON.stringify(["panda","animal","3d","cute","china"]),vs:[{t:"Small",p:[{a:599,c:"usd"},{a:499,c:"eur"},{a:399,c:"gbp"}],q:250},{t:"Large",p:[{a:999,c:"usd"},{a:899,c:"eur"},{a:799,c:"gbp"}],q:120}]},
  {id:uuidv4(),t:"Pizza Italy Magnet",s:"Colorful enamel pizza magnet from Naples",h:"pizza-italy-magnet",d:"Vibrant enamel pizza magnet capturing the essence of authentic Italian pizza.",m:"Enamel",w:30,l:5,wd:5,ht:0.4,oc:"CN",hs:"7326.90",th:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"]),tg:JSON.stringify(["pizza","italy","food","enamel"]),vs:[{t:"Standard",p:[{a:499,c:"usd"},{a:399,c:"eur"},{a:349,c:"gbp"}],q:400}]},
  {id:uuidv4(),t:"London Bus Magnet",s:"Classic red double-decker bus magnet",h:"london-bus-magnet",d:"Iconic red double-decker bus magnet capturing the spirit of London.",m:"Metal",w:55,l:6,wd:2.5,ht:3,oc:"CN",hs:"8306.29",th:"https://images.unsplash.com/photo-1574279606130-5d2bc9e36c6d?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1574279606130-5d2bc9e36c6d?w=800"]),tg:JSON.stringify(["london","uk","bus","travel"]),vs:[{t:"Standard",p:[{a:899,c:"usd"},{a:799,c:"eur"},{a:699,c:"gbp"}],q:180}]},
  {id:uuidv4(),t:"Minimalist Moon Phase Magnet",s:"Modern moon phase design in black and white",h:"minimalist-moon-phase-magnet",d:"Sleek minimalist magnet featuring all 8 moon phases on matte black ceramic.",m:"Ceramic",w:40,l:5,wd:5,ht:0.3,oc:"CN",hs:"6914.10",th:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=400",im:JSON.stringify(["https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800"]),tg:JSON.stringify(["moon","minimalist","astronomy","modern"]),vs:[{t:"Standard",p:[{a:799,c:"usd"},{a:699,c:"eur"},{a:599,c:"gbp"}],q:200},{t:"Set of 8",p:[{a:4999,c:"usd"},{a:4499,c:"eur"},{a:3999,c:"gbp"}],q:40}]},
]

const insertP = db.prepare("INSERT INTO products (id,title,subtitle,description,handle,material,weight,length,width,height,origin_country,hs_code,discountable,thumbnail,images,tags) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
const insertV = db.prepare("INSERT INTO product_variants (id,product_id,title,prices,inventory_quantity) VALUES (?,?,?,?,?)")

const tx = db.transaction(() => {
  for (const p of products) {
    insertP.run(p.id,p.t,p.s,p.d,p.h,p.m,p.w,p.l,p.wd,p.ht,p.oc,p.hs,p.disc??1,p.th,p.im,p.tg)
    for (const v of p.vs) insertV.run(uuidv4(),p.id,v.t,JSON.stringify(v.p),v.q)
  }
})
tx()
console.log(`  ✓ ${products.length} products created with ${products.reduce((s,p)=>s+p.vs.length,0)} variants`)

const revs = [
  [products[0].id,"Sarah M.",5,"Absolutely beautiful! The detail is incredible."],
  [products[0].id,"James K.",4,"Great quality magnet. Perfect souvenir."],
  [products[0].id,"Maria G.",5,"Bought as a gift and they loved it!"],
  [products[1].id,"Alex P.",5,"Wonderful detail on the Colosseum."],
  [products[1].id,"Chiara R.",4,"Brings back memories of Rome!"],
  [products[4].id,"Yuki T.",5,"Exquisite cherry blossom design."],
  [products[4].id,"Lisa W.",5,"So delicate and pretty."],
  [products[5].id,"Tom B.",4,"My kids love this panda. Great quality."],
]
const insertR = db.prepare("INSERT INTO reviews (id,product_id,author,rating,text) VALUES (?,?,?,?,?)")
for (const r of revs) insertR.run(uuidv4(),r[0],r[1],r[2],r[3])
console.log(`  ✓ ${revs.length} reviews created`)

const coupons = [
  ["MERRY20","percentage",20,3000,100,"2025-01-31"],
  ["WELCOME10","percentage",10,0,500,"2025-06-30"],
  ["FREESHIP","shipping",100,5000,200,"2025-03-31"],
  ["SAVE5","fixed",500,2500,100,"2025-02-28"],
]
const insertC = db.prepare("INSERT INTO coupons (id,code,discount_type,discount_value,min_order_amount,usage_limit,expires_at) VALUES (?,?,?,?,?,?,?)")
for (const c of coupons) insertC.run(uuidv4(),c[0],c[1],c[2],c[3],c[4],c[5])
console.log(`  ✓ ${coupons.length} coupons created`)

console.log("\n✅ Seeding complete!")
db.close()
