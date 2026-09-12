#!/usr/bin/env bash
set -euo pipefail
CERTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ ! -f "$CERTS_DIR/cert.pem" ] || [ ! -f "$CERTS_DIR/key.pem" ]; then
    echo "[INFO] Generating self-signed development SSL certificate for Workflow SDK via OpenSSL..."
    openssl req -x509 -newkey rsa:2048 -keyout "$CERTS_DIR/key.pem" -out "$CERTS_DIR/cert.pem" -days 365 -nodes -subj "/CN=localhost"
    echo "[SUCCESS] SSL certificate and private key generated in certs/"
else
    echo "[INFO] SSL certificate already exists in certs/"
fi
