#!/usr/bin/env bash
set -euo pipefail

: "${KEEPALIVE_URL:?Set KEEPALIVE_URL to your deployed Render health endpoint, for example https://your-app.onrender.com/api/health}"

curl -fsS "$KEEPALIVE_URL" >/dev/null
echo "Pinged $KEEPALIVE_URL"