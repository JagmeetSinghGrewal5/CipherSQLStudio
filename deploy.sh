#!/bin/bash

# CipherSQLStudio Deployment Helper Script
# This script helps prepare your project for Vercel deployment

echo "🚀 Preparing CipherSQLStudio for Vercel Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "🧪 Running build tests..."

# Test backend build
echo "Testing backend build..."
cd backend
npm run vercel-build
cd ..

# Test frontend build
echo "Testing frontend build..."
cd frontend
npm run build
cd ..

echo "✅ Build tests completed successfully!"

echo ""
echo "🎯 Next Steps for Vercel Deployment:"
echo ""
echo "1. 📖 Read the DEPLOYMENT_GUIDE.md file"
echo "2. 🔧 Deploy backend first to get the API URL"
echo "3. 🎨 Update frontend environment variables with backend URL"
echo "4. 🚀 Deploy frontend"
echo ""
echo "📋 Important Files Created:"
echo "   - backend/vercel.json (backend configuration)"
echo "   - frontend/vercel.json (frontend configuration)"
echo "   - DEPLOYMENT_GUIDE.md (step-by-step guide)"
echo "   - .env.production files (environment variable templates)"
echo ""
echo "🔗 Useful Links:"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - GitHub Repository: https://github.com/JagmeetSinghGrewal5/CipherSQLStudio"
echo ""
echo "Happy deploying! 🎉"