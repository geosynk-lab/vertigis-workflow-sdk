@echo off
rem Keeps the local checkout in sync with origin/<branch> (fast-forward only).
rem Usage: scripts\remote-sync.bat <branch> [seconds]
setlocal
set BRANCH=%~1
set INTERVAL=%~2
if "%INTERVAL%"=="" set INTERVAL=5
:loop
git fetch --quiet origin %BRANCH% >nul 2>&1
git merge --ff-only origin/%BRANCH% >nul 2>&1 && git log -1 --format="[sync] %%h %%s" 
timeout /t %INTERVAL% /nobreak >nul
goto loop
