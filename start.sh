#!/bin/bash

echo "========================================"
echo "  CipherSQLStudio - Starting Application"
echo "========================================"
echo ""

echo "Checking setup..."
cd backend
node scripts/auto-setup.js
echo ""

echo "Starting servers..."
cd ..
npm run dev

