@echo off
rem TradeCraft Akademia inditasa: helyi szerver + bongeszo.
rem Az oldal ES modulokbol all, ezert fajlkent megnyitva nem mukodik.
cd /d "%~dp0day-trading-akademia"
where node >nul 2>nul || (echo A Node.js nincs telepitve: https://nodejs.org & pause & exit /b 1)
start "" http://127.0.0.1:4173/
echo A TradeCraft Akademia fut: http://127.0.0.1:4173
echo Az ablak bezarasa leallitja a szervert.
node preview-server.mjs
