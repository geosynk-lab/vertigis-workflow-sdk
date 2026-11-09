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
if /i "%~1"=="remote" (
    set SYNC_BRANCH=%~2
    if "!SYNC_BRANCH!"=="" for /f %%b in ('git rev-parse --abbrev-ref HEAD') do set SYNC_BRANCH=%%b
    echo Remote mode: pulling origin/!SYNC_BRANCH! and re-checking every 5s...
    git pull --ff-only origin !SYNC_BRANCH!
    start "git-sync" /min cmd /c "scripts\remote-sync.bat !SYNC_BRANCH! 5"
)
echo Starting development server (npm start)...
npm start
if /i "%~1"=="remote" taskkill /FI "WINDOWTITLE eq git-sync*" /F >nul 2>&1
