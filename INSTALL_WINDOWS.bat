@echo off
title RIZ-PROLOG - Install Dependencies (Windows)
color 0A
cls
echo ======================================================================
echo    RIZ-PROLOG : INSTALASI DEPENDENCIES (WINDOWS)
echo ======================================================================
echo.
cd /d "%~dp0"

echo [*] Mengecek Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terinstall di komputer ini!
    echo Silakan unduh dan install Node.js dari: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js terdeteksi.
echo [*] Memulai instalasi dependensi (npm install)...
call npm install

echo.
echo ======================================================================
echo    Instalasi Selesai!
echo    Silakan klik ganda 'START_WINDOWS.bat' untuk menyalakan aplikasi.
echo ======================================================================
echo.
pause
