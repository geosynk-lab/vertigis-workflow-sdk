@echo off
echo Building production activity pack (npm run build)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed with exit code %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] Activity pack output located in dist/
