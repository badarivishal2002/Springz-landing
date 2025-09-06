@echo off
echo ================================
echo    Springz Nutrition Setup
echo    Updated with New Products
echo ================================
echo.

echo 🧹 Clearing existing database...
if exist "prisma\dev.db" del "prisma\dev.db"
if exist "prisma\dev.db-journal" del "prisma\dev.db-journal"

echo 📊 Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo 🗃️ Pushing database schema...
call npx prisma db push --force-reset
if errorlevel 1 (
    echo ❌ Failed to push database schema
    pause
    exit /b 1
)

echo 🌱 Seeding database with new products...
call npx prisma db seed
if errorlevel 1 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

echo.
echo ✅ Setup completed successfully!
echo.
echo 📋 Your new product catalog includes:
echo.
echo 🥤 Premium Plant Proteins:
echo   - Elite Protein (₹2,499)
echo   - Native Protein Classic (₹1,999)  
echo   - Native Protein Chocolate (₹2,199)
echo.
echo 🍽️ Functional Foods:
echo   - Nuchhi-Nunde (₹899)
echo   - Native Protein Peanut Butter Powder Sweetened (₹799)
echo   - Native Protein Peanut Butter Powder Hot and Spicy (₹849)
echo.
echo 🍪 Guilt-Free Snacks:
echo   - Kodubale (₹299)
echo.
echo 🔑 Admin Login: admin@springz.com / admin123
echo 👤 Demo User: demo@springz.com / demo123
echo.
echo 🎯 Admin Features Available:
echo   - Product Management
echo   - Media Library
echo   - Analytics Dashboard
echo   - Settings Configuration
echo   - Order Management
echo.
echo 💰 Currency: All prices now in INR (₹)
echo 🚚 Free shipping on orders over ₹2,000
echo.
echo Ready to start? Run: npm run dev
echo.
pause