#!/bin/bash
echo "================================================"
echo "  Magnetique - Setup & Start Script"
echo "  No Docker required! Uses SQLite + in-memory."
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 20+ first."
  echo "   Download from: https://nodejs.org/"
  exit 1
fi

echo "✅ Node.js $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$(dirname "$0")/medusa-backend"
npm install --legacy-peer-deps 2>&1 | tail -5
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
npx medusa migrations run 2>&1 | tail -5
echo ""

# Seed data
echo "🌱 Seeding sample data..."
npx medusa seed --seed-file=src/seeders/seed.js 2>&1 | tail -5
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../storefront
npm install --legacy-peer-deps 2>&1 | tail -5
echo ""

echo "================================================"
echo "  ✅ Setup complete!"
echo ""
echo "  Start the backend:"
echo "    cd medusa-backend && npx medusa develop"
echo ""
echo "  Start the frontend:"
echo "    cd storefront && npm run dev"
echo ""
echo "  Backend:  http://localhost:9000"
echo "  Admin:    http://localhost:7000"
echo "  Store:    http://localhost:3000"
echo "================================================"
