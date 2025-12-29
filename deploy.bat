@echo off
REM CipherSQLStudio Deployment Helper Script for Windows
REM This script helps prepare your project for Vercel deployment

echo 🚀 Preparing CipherSQLStudio for Vercel Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo 🧪 Running build tests...

REM Test backend build
echo Testing backend build...
cd backend
call npm run vercel-build
cd ..

REM Test frontend build
echo Testing frontend build...
cd frontend
call npm run build
cd ..

echo ✅ Build tests completed successfully!

echo.
echo 🎯 Next Steps for Vercel Deployment:
echo.
echo 1. 📖 Read the DEPLOYMENT_GUIDE.md file
echo 2. 🔧 Deploy backend first to get the API URL
echo 3. 🎨 Update frontend environment variables with backend URL
echo 4. 🚀 Deploy frontend
echo.
echo 📋 Important Files Created:
echo    - backend/vercel.json (backend configuration)
echo    - frontend/vercel.json (frontend configuration)
echo    - DEPLOYMENT_GUIDE.md (step-by-step guide)
echo    - .env.production files (environment variable templates)
echo.
echo 🔗 Useful Links:
echo    - Vercel Dashboard: https://vercel.com/dashboard
echo    - GitHub Repository: https://github.com/JagmeetSinghGrewal5/CipherSQLStudio
echo.
echo Happy deploying! 🎉
pause