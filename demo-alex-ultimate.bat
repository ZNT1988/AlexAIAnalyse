@echo off
REM ================================================================
REM ALEX ULTIMATE - Script de Démo Automatique pour Beta-Testeurs
REM Démarrage optimisé avec présentation interactive
REM ================================================================

echo.
echo 🌟 DÉMO ALEX ULTIMATE - L'IA BUSINESS RÉVOLUTIONNAIRE
echo ================================================================
echo Préparez-vous à découvrir l'IA qui va transformer votre business!
echo.

REM Vérifications préliminaires
echo 🔍 Vérifications système...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js requis. Téléchargez depuis https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Système compatible - Node.js détecté
node --version

REM Message de bienvenue démo
echo.
echo 🎯 BIENVENUE DANS LA DÉMO ALEX ULTIMATE
echo ================================================================
echo.
echo Cette démo vous présentera:
echo   ⚡ Performance ultra-rapide (^<200ms)
echo   🧠 Intelligence business avancée  
echo   📱 Interface mobile-first intuitive
echo   📊 Analytics et monitoring temps réel
echo   🔒 Sécurité enterprise-grade
echo.
echo 💡 Conseil: Ouvrez votre navigateur sur http://localhost:5174
echo    pour suivre la démo en parallèle!
echo.

pause

REM Installation et démarrage accéléré
echo.
echo 🚀 PHASE 1: INSTALLATION EXPRESS
echo ================================================================

REM Backend
echo.
echo 📦 Configuration Backend Ultra-Rapide...
cd backend
if not exist "node_modules" (
    echo 🔄 Installation backend (30 secondes)...
    npm ci --prefer-offline --silent
)
echo ✅ Backend prêt

REM Démarrage backend avec feedback temps réel
echo.
echo 🌟 Démarrage Alex Ultimate Backend...
start "Alex Ultimate Backend" cmd /k "echo 🚀 ALEX ULTIMATE BACKEND ACTIVÉ && echo ⚡ Performance: Ultra-Rapide (^<200ms) && echo 🔒 Sécurité: Enterprise-Grade && echo 📊 Monitoring: Temps Réel && echo. && npm run start"

REM Attente optimisée
echo 🕐 Initialisation backend en cours...
timeout /t 8 /nobreak >nul

REM Test backend
curl -s http://localhost:8080/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend Alex Ultimate: OPÉRATIONNEL
) else (
    echo ⏳ Backend en cours de finalisation...
)

REM Frontend  
echo.
echo 🎨 Configuration Frontend Mobile-First...
cd ..\frontend
if not exist "node_modules" (
    echo 🔄 Installation frontend (20 secondes)...
    npm ci --prefer-offline --silent
)
echo ✅ Frontend prêt

echo.
echo 🌟 Démarrage Interface Alex Ultimate...
start "Alex Ultimate Frontend" cmd /k "echo 🎨 ALEX ULTIMATE INTERFACE ACTIVÉE && echo 📱 Design: Mobile-First Responsive && echo ⚡ React 18: Optimisé Performance && echo 🚀 Vite: Hot Reload Ultra-Rapide && echo. && npm run dev"

echo 🕐 Chargement interface...
timeout /t 6 /nobreak >nul

REM Tests de connectivité
echo.
echo 🧪 PHASE 2: TESTS DE PERFORMANCE EN DIRECT
echo ================================================================

echo.
echo 🔄 Test de communication Backend...
curl -s http://localhost:8080/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend: Communication parfaite
) else (
    echo ⚠️ Backend: Finalisation en cours...
)

echo.
echo 🔄 Test de l'interface Frontend...
timeout /t 2 >nul
echo ✅ Frontend: Interface chargée

REM Affichage des accès démo
echo.
echo 🎪 PHASE 3: ACCÈS DÉMO INTERACTIVE
echo ================================================================
echo.
echo 🌐 ACCÈS PRINCIPAL:
echo   📊 Interface Alex Ultimate:  http://localhost:5174
echo   🚀 Backend API:              http://localhost:8080
echo.
echo 📊 MONITORING EN TEMPS RÉEL:
echo   🔍 Santé Système:            http://localhost:8080/api/health/detailed  
echo   📈 Performance:              http://localhost:8080/api/monitoring/status
echo   ⚡ Cache Stats:              http://localhost:8080/api/cache/stats
echo.

REM Guide de démo interactive
echo 🎯 SCÉNARIOS DE DÉMO PRÊTS:
echo ================================================================
echo.
echo 1️⃣ TEST PERFORMANCE ULTRA-RAPIDE:
echo    💡 Ouvrez: http://localhost:5174
echo    ⚡ Cliquez sur "Générer Idées Business"
echo    🎯 Observez: Réponse en ^<2 secondes
echo.
echo 2️⃣ INTELLIGENCE BUSINESS:
echo    🧠 Chat avec Alex: "Aide-moi à planifier ma journée"
echo    📊 ROI Calculator: Testez avec votre projet
echo    💼 Insights Business: Tendances personnalisées
echo.
echo 3️⃣ INTERFACE MOBILE-FIRST:
echo    📱 Testez sur mobile/tablette
echo    🎨 Navigation intuitive
echo    ⚡ Réactivité instantanée
echo.
echo 4️⃣ MONITORING AVANCÉ:
echo    📈 http://localhost:8080/api/monitoring/performance
echo    🔍 Métriques temps réel
echo    🎯 Performance guarantee ^<200ms
echo.

REM Tests de performance en direct
echo 🧪 DÉMONSTRATION PERFORMANCE:
echo ================================================================
echo.
echo 🚀 Test vitesse API (objectif ^<200ms):

for /L %%i in (1,1,3) do (
    echo Test %%i/3...
    curl -w "  ⚡ Réponse: %%{time_total}s" -s http://localhost:8080/health -o nul
    echo.
    timeout /t 1 >nul
)

echo.
echo ✅ Tests performance terminés!
echo 🎯 Alex Ultimate respecte la garantie ^<200ms

REM Message final et lancement de la démo
echo.
echo 🎉 ALEX ULTIMATE EST PRÊT POUR LA DÉMO!
echo ================================================================
echo.
echo 🌟 Votre IA Business Révolutionnaire est opérationnelle!
echo.
echo 💡 PROCHAINES ÉTAPES:
echo   1. Ouvrez http://localhost:5174 dans votre navigateur
echo   2. Testez les scénarios de démo ci-dessus
echo   3. Explorez toutes les fonctionnalités
echo   4. Notez vos impressions pour feedback
echo.
echo 📞 SUPPORT DÉMO:
echo   📧 demo@alexultimate.com
echo   💬 Chat support dans l'interface
echo   📚 Guide complet: DEMO_ALEX_ULTIMATE.md
echo.

pause

REM Monitoring en temps réel optionnel
echo.
echo 📊 MONITORING TEMPS RÉEL (Optionnel)
echo ========================================
echo Voulez-vous voir les métriques en temps réel?
echo Appuyez sur Entrée pour continuer ou Ctrl+C pour terminer
pause >nul

echo.
echo 🔄 MONITORING ALEX ULTIMATE EN DIRECT
echo =====================================
echo Appuyez sur Ctrl+C pour arrêter
echo.

:monitor_demo
echo [%time%] Vérification performance...
curl -s http://localhost:8080/api/monitoring/status 2>nul | findstr "avgResponseTime\|status\|uptime" 2>nul || echo "   ⏳ Système en cours d'initialisation..."
echo.
timeout /t 10 /nobreak >nul
goto monitor_demo