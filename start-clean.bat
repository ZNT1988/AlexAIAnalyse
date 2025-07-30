@echo off
echo 🧹 NETTOYAGE COMPLET PROFESSIONNEL - HustleFinder IA
echo =====================================================

echo.
echo 🔍 1. Vérification des ports problématiques...
netstat -ano | findstr :8080 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ❌ Port 8080 occupé - Arrêt du processus...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /pid %%a /f >nul 2>&1
)

netstat -ano | findstr :8081 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ❌ Port 8081 occupé - Arrêt du processus...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do taskkill /pid %%a /f >nul 2>&1
)

netstat -ano | findstr :8082 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ❌ Port 8082 occupé - Arrêt du processus...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8082') do taskkill /pid %%a /f >nul 2>&1
)

netstat -ano | findstr :8083 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ❌ Port 8083 occupé - Arrêt du processus...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8083') do taskkill /pid %%a /f >nul 2>&1
)

echo ✅ Ports problématiques nettoyés !

echo.
echo 🔍 2. Vérification des ports définitifs...
netstat -ano | findstr :3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 3000 occupé - Libération...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /pid %%a /f >nul 2>&1
)

netstat -ano | findstr :5173 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Port 5173 occupé - Libération...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /pid %%a /f >nul 2>&1
)

echo.
echo 🚀 3. Démarrage sécurisé...
echo 📡 Backend sur port 3000...
start "HustleFinder Backend" cmd /k "cd backend && npm start"

timeout /t 3 >nul

echo 🌐 Frontend sur port 5173...
start "HustleFinder Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ DÉMARRAGE COMPLET !
echo 🔗 Backend : http://localhost:3000
echo 🔗 Frontend : http://localhost:5173
echo.
pause