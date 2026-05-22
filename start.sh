#!/bin/bash
set -e

export PATH="$HOME/.local/node/bin:$PATH"
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "================================================"
echo "  Magnetique - Start Script"
echo "================================================"
echo ""

# Seed database
echo "🌱 Seeding database..."
node "$BASE_DIR/medusa-backend/src/seeders/seed.js"
echo ""

# Start backend
echo "🚀 Starting backend server on http://localhost:9000 ..."
cd "$BASE_DIR/medusa-backend"
node src/index.js &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"
echo ""

# Start frontend
echo "🚀 Starting frontend on http://localhost:3000 ..."
cd "$BASE_DIR/storefront"
npm run dev &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"
echo ""

echo "================================================"
echo "  ✅ Services running!"
echo ""
echo "  Backend API:  http://localhost:9000/store"
echo "  Admin API:    http://localhost:9000/admin"
echo "  Frontend:     http://localhost:3000"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "================================================"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
