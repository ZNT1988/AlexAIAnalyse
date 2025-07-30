@echo off
echo 🧹 === NETTOYAGE PORTS ALEX ULTIMATE ===
echo.

echo Arrêt des processus sur ports 3001, 5000, 5173...

REM Tuer les processus sur port 3001 (ancien backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001"') do (
    echo Arrêt processus port 3001: %%a
    taskkill /f /pid %%a 2>nul
)

REM Tuer les processus sur port 5000 (nouveau backend)  
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do (
    echo Arrêt processus port 5000: %%a
    taskkill /f /pid %%a 2>nul
)

REM Tuer les processus sur port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do (
    echo Arrêt processus port 5173: %%a
    taskkill /f /pid %%a 2>nul
)

REM Tuer les processus sur port 5177 (frontend alternatif)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5177"') do (
    echo Arrêt processus port 5177: %%a
    taskkill /f /pid %%a 2>nul
)

echo.
echo ✅ Nettoyage des ports terminé !
echo.
echo 🚀 Vous pouvez maintenant redémarrer Alex Ultimate
echo.
pause