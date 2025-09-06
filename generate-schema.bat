@echo off
echo Generating Prisma client...
npx prisma generate
echo.
echo If successful, you can now run:
echo npx prisma db push
echo npx prisma db seed
pause
