@echo off
setlocal enabledelayedexpansion

echo 🌱 Welcome to Springz Nutrition Setup!
echo ======================================

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

echo.
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing additional packages...
call npm install next-auth @auth/prisma-adapter prisma @prisma/client bcryptjs @types/bcryptjs cloudinary multer @types/multer react-hook-form @hookform/resolvers zod react-dropzone @radix-ui/react-toast @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-dialog tsx
if errorlevel 1 (
    echo ❌ Failed to install additional packages
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

:: Create environment file if it doesn't exist
if not exist ".env.local" (
    echo.
    echo 📝 Creating .env.local file...
    copy .env.env.local >nul
    echo ✅ Environment file created
    echo ⚠️  Please update .env.local with your actual configuration
) else (
    echo ⚠️  .env.local already exists
)

echo.
echo 🔧 Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo 🗃️  Setting up database...
set /p setup_db="Do you want to push the database schema? (y/N): "
if /i "!setup_db!"=="y" (
    call npx prisma db push
    if errorlevel 1 (
        echo ❌ Failed to push database schema
        pause
        exit /b 1
    )
    echo ✅ Database schema applied
    
    set /p seed_db="Do you want to seed the database with sample data? (y/N): "
    if /i "!seed_db!"=="y" (
        call npx prisma db seed
        if errorlevel 1 (
            echo ❌ Failed to seed database
            pause
            exit /b 1
        )
        echo ✅ Database seeded with sample data
    )
)

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your actual configuration
echo 2. Set up your database (PostgreSQL recommended)
echo 3. Configure Cloudinary for image uploads
echo 4. Run 'npm run dev' to start the development server
echo.
echo 📖 For detailed setup instructions, see:
echo    - IMPLEMENTATION_GUIDE.md
echo    - FEATURES_SUMMARY.md
echo.
echo 🔐 Default admin credentials:
echo    Email: admin@springz.com
echo    Password: admin123
echo.
echo 🚀 Ready to launch!
echo.

pause
