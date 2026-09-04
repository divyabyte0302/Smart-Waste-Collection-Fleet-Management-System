@echo off
title Smart Waste Collection Management System
color 0A

echo =====================================================================
echo   Smart Waste Collection Management System - Local Launch
echo =====================================================================
echo.

:: Add default Node.js path to current session PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Verify Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in PATH or standard Program Files.
    echo Please ensure Node.js is installed.
    pause
    exit /b 1
)

echo [1/3] Verifying node packages...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm.cmd install
)

echo.
echo [2/3] Checking database seed data...
call node backend/database/seedData.js

echo.
echo [3/3] Starting Smart Waste Express Server on port 5000...
echo.
echo =====================================================================
echo Server starting at: http://localhost:5000
echo Citizen, Admin Command, and Driver portals are live!
echo Press Ctrl+C to terminate.
echo =====================================================================
echo.

start http://localhost:5000
call node backend/server.js
pause
