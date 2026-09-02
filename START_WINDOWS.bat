@echo off
title RIZ-PROLOG - Warehouse Log-Book Launcher
color 0B
cls
echo ======================================================================
echo    RIZ-PROLOG : WAREHOUSE LOG-BOOK ^& DAILY TASK
echo    Multi-Divisi: Audio, Lighting, Videotron, Multimedia, Gudang, Admin
echo ======================================================================
echo.
cd /d "%~dp0"

echo [*] Membuka aplikasi di browser default...
start http://localhost:3000/

echo [*] Menjalankan server aplikasi (Port 3000)...
echo [*] Jangan tutup jendela ini selama menggunakan aplikasi.
echo.
call npm run dev

pause
