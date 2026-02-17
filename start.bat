@echo off
setlocal

echo Starting Valentine's Space Invaders...
echo.
echo Opening this project directly as a file can fail because browser CORS rules block ES module imports.
echo This script starts a local web server instead.
echo.

where npx >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Using npx serve...
  echo Open http://localhost:3000 in your browser.
  npx serve .
  goto :eof
)

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo npx not found. Using Python via py...
  echo Open http://localhost:5500 in your browser.
  py -m http.server 5500
  goto :eof
)

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo npx not found. Using Python...
  echo Open http://localhost:5500 in your browser.
  python -m http.server 5500
  goto :eof
)

echo Could not find npx or Python on your system.
echo Install Node.js (includes npm/npx) or Python, then run this script again.
exit /b 1
