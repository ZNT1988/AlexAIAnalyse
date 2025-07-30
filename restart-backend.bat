@echo off
echo Arrêt des processus Node.js...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul
echo Démarrage du backend sur port 8081...
cd backend
node index.js