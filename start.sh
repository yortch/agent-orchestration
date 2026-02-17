#!/usr/bin/env sh

echo "Starting Valentine's Space Invaders..."
echo
echo "Opening index.html directly can fail because browser CORS rules block ES module imports."
echo "This script starts a local web server instead."
echo

if command -v npx >/dev/null 2>&1; then
  echo "Using npx serve..."
  echo "Open http://localhost:3000 in your browser."
  exec npx serve .
fi

if command -v python3 >/dev/null 2>&1; then
  echo "npx not found. Using Python 3..."
  echo "Open http://localhost:5500 in your browser."
  exec python3 -m http.server 5500
fi

if command -v python >/dev/null 2>&1; then
  echo "npx not found. Using Python..."
  echo "Open http://localhost:5500 in your browser."
  exec python -m http.server 5500
fi

echo "Could not find npx or Python on your system."
echo "Install Node.js (includes npm/npx) or Python, then run this script again."
exit 1
