@echo off
setlocal
set CERTS_DIR=%~dp0
if not exist "%CERTS_DIR%cert.pem" (
    echo [INFO] Generating self-signed development SSL certificate for Workflow SDK via OpenSSL...
    openssl req -x509 -newkey rsa:2048 -keyout "%CERTS_DIR%key.pem" -out "%CERTS_DIR%cert.pem" -days 365 -nodes -subj "/CN=localhost"
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] SSL certificate and private key generated in certs/
    ) else (
        echo [WARN] OpenSSL command failed. Please ensure openssl is installed and in your PATH.
    )
) else (
    echo [INFO] SSL certificate already exists in certs/
)
