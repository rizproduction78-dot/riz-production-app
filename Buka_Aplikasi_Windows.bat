@echo off
:: ==============================================================================
:: RIZ-PROLOG — PINTASAN OTOMATIS BUKA APLIKASI DI WINDOWS
:: PT. RIZ PRODUCTION MULTI KREASI
:: ==============================================================================
title RIZ-PROLOG Launcher (Windows)
echo =======================================================
echo    MEMBUKA APLIKASI RIZ-PROLOG DI BROWSER WINDOWS...   
echo =======================================================

set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"

where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo Menjalankan Local Web Server di Port 4173...
    start http://localhost:4173
    npx vite preview --port 4173 --host
) else (
    echo Membuka file aplikasi secara langsung di browser default...
    if exist "%CURRENT_DIR%dist\index.html" (
        start "" "%CURRENT_DIR%dist\index.html"
    ) else (
        start "" "%CURRENT_DIR%public\index.html"
    )
)
pause
