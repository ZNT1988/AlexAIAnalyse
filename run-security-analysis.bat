@echo off
echo ========================================
echo   ANALYSE DE SECURITE HUSTLEFINDER IA
echo ========================================
echo.

echo [1/4] Verification CodeQL...
C:\codeql\codeql\codeql.exe version
if %errorlevel% neq 0 (
    echo ERREUR: CodeQL non installe
    exit /b 1
)

echo.
echo [2/4] Analyse SonarQube...
cd backend
call npm run lint
cd ..
cd frontend  
call npm run lint
cd ..

echo.
echo [3/4] Creation base CodeQL...
if not exist "hustlefinder-security-db" (
    C:\codeql\codeql\codeql.exe database create hustlefinder-security-db --language=javascript --source-root=backend --overwrite
)

echo.
echo [4/4] Execution queries securite...
C:\codeql\codeql\codeql.exe database analyze hustlefinder-security-db --format=sarif-latest --output=security-results.sarif --ram=2048

echo.
echo ========================================
echo   ANALYSE TERMINEE
echo ========================================
echo Resultats dans: security-results.sarif
echo Rapport SonarQube: RAPPORT_ANALYSE_SONARQUBE.md
echo.
pause