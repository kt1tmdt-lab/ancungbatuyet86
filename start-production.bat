@echo off
title ACBT Web - Production Server
echo ============================================
echo    AN CUNG BA TUYET - Production Server
echo ============================================
echo.

:: Set environment variables (no trailing spaces!)
set "NODE_ENV=production"
set "PORT=3000"
set "HOSTNAME=0.0.0.0"

:: Detect standalone path (Next.js may nest under project name)
set "STANDALONE_DIR=.next\standalone\acbt-web"
if not exist "%STANDALONE_DIR%\server.js" (
    set "STANDALONE_DIR=.next\standalone"
)

:: Check if standalone build exists
if not exist "%STANDALONE_DIR%\server.js" (
    echo [ERROR] Chua build production! Chay lenh sau truoc:
    echo     npm run build
    echo.
    pause
    exit /b 1
)

echo [INFO] Standalone directory: %STANDALONE_DIR%

:: Copy public and static files to standalone (required for standalone mode)
echo [1/3] Copying public assets...
if exist "public" (
    xcopy /E /I /Y "public" "%STANDALONE_DIR%\public" >nul 2>&1
)

echo [2/3] Copying static files...
if exist ".next\static" (
    xcopy /E /I /Y ".next\static" "%STANDALONE_DIR%\.next\static" >nul 2>&1
)

echo [3/3] Starting server on port %PORT%...
echo.
echo    Local:    http://localhost:%PORT%
echo    Network:  http://0.0.0.0:%PORT%
echo.
echo Press Ctrl+C to stop the server.
echo ============================================

cd "%STANDALONE_DIR%"
node server.js
