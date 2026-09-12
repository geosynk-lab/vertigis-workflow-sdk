@echo off
setlocal enabledelayedexpansion
set PORT=5000
echo ========================================================
echo   VertiGIS Studio Workflow SDK Development Server
echo ========================================================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    echo Terminating PID %%a on port %PORT%...
    taskkill /F /PID %%a >nul 2>&1
)
if exist "certs\generate-cert.bat" (
    call "certs\generate-cert.bat"
)
echo Starting development server (npm start)...
npm start
