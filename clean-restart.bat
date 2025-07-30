@echo off
echo.
echo ========================================
echo   🧹 HustleFinderIA - Redémarrage Propre
echo ========================================
echo.

echo 1️⃣ Nettoyage des processus existants...
taskkill /IM node.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul

echo 2️⃣ Vérification des ports...
netstat -ano | findstr ":8081" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 8081 encore occupé, nettoyage...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081"') do taskkill /PID %%a /F >nul 2>&1
    timeout /t 2 /nobreak >nul
)

echo 3️⃣ Démarrage Backend (Port 8081)...
cd /d "%~dp0backend"
start "HF Backend - Port 8081" cmd /k "npm run dev:force"

echo ⏳ Attente backend...
timeout /t 8 /nobreak >nul

echo 4️⃣ Démarrage Frontend (Port 5173)...
cd /d "%~dp0frontend"
start "HF Frontend - Port 5173" cmd /k "npm run dev"

echo.
echo ✅ HustleFinderIA redémarré proprement !
echo.
echo 📖 Configuration finale:
echo    • Backend API: http://localhost:8081
echo    • Frontend UI: http://localhost:5173
echo    • Tous les modules IA activés
echo    • ContextIntelligence opérationnel
echo.
echo 🌐 Interface: http://localhost:5173
echo.
pause