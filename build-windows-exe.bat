@echo off
chcp 65001 >nul
echo ========================================================
echo   ساخت فایل اجرایی ویندوز بازی «دانشمند کوچولو» (.EXE)
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [خطا] لطفا ابتدا Node.js نسخه 20 یا بالاتر را نصب کنید: https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] در حال نصب پکیج‌ها...
call npm install
if %errorlevel% neq 0 (
    echo [خطا] نصب پکیج‌ها با مشکل مواجه شد.
    pause
    exit /b 1
)

echo [2/3] در حال کامپایل گرافیک و موتور بازی...
call npm run dist:win
if %errorlevel% neq 0 (
    echo [خطا] ساخت فایل EXE با مشکل مواجه شد.
    pause
    exit /b 1
)

echo.
echo [3/3] تبریک! فایل نصبی و فایل پرتابل EXE در پوشه release ساخته شدند!
explorer release
pause
