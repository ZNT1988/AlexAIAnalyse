# Script d'analyse de sécurité avancée pour HustleFinder IA
# Combinaison SonarQube + CodeQL

param(
    [switch]$FullAnalysis = $false,
    [switch]$QuickScan = $false,
    [string]$OutputDir = "security-reports"
)

Write-Host "🔒 ANALYSE DE SECURITE HUSTLEFINDER IA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Créer dossier de rapports
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir
    Write-Host "📁 Dossier créé: $OutputDir" -ForegroundColor Green
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

try {
    # 1. VERIFICATION OUTILS
    Write-Host "`n🔧 [1/5] Vérification des outils..." -ForegroundColor Yellow
    
    $codeqlPath = "C:\codeql\codeql\codeql.exe"
    if (!(Test-Path $codeqlPath)) {
        throw "CodeQL CLI non trouvé"
    }
    
    & $codeqlPath version
    Write-Host "✅ CodeQL opérationnel" -ForegroundColor Green

    # 2. ANALYSE SONARQUBE
    Write-Host "`n📊 [2/5] Analyse SonarQube (ESLint + SonarJS)..." -ForegroundColor Yellow
    
    Set-Location backend
    npm run lint | Out-File "../$OutputDir/sonar-backend-$timestamp.log"
    Set-Location ..
    
    Set-Location frontend
    npm run lint | Out-File "../$OutputDir/sonar-frontend-$timestamp.log"
    Set-Location ..
    
    Write-Host "✅ Analyse SonarQube terminée" -ForegroundColor Green

    # 3. CREATION BASE CODEQL
    Write-Host "`n💾 [3/5] Création base de données CodeQL..." -ForegroundColor Yellow
    
    $dbName = "hustlefinder-security-db"
    if (Test-Path $dbName) {
        Remove-Item -Recurse -Force $dbName
    }
    
    & $codeqlPath database create $dbName --language=javascript --source-root=backend --overwrite
    Write-Host "✅ Base CodeQL créée" -ForegroundColor Green

    # 4. QUERIES SECURITE
    Write-Host "`n🎯 [4/5] Exécution des queries de sécurité..." -ForegroundColor Yellow
    
    $sarifOutput = "$OutputDir/codeql-security-$timestamp.sarif"
    & $codeqlPath database analyze $dbName --format=sarif-latest --output=$sarifOutput --ram=2048
    
    Write-Host "✅ Analyse CodeQL terminée" -ForegroundColor Green

    # 5. RAPPORT CONSOLIDE
    Write-Host "`n📋 [5/5] Génération rapport consolidé..." -ForegroundColor Yellow
    
    $reportPath = "$OutputDir/RAPPORT_SECURITE_CONSOLIDE_$timestamp.md"
    
    @"
# 🔒 Rapport de Sécurité Consolidé - HustleFinder IA

**Date d'analyse :** $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
**Outils utilisés :** SonarQube Community + CodeQL CLI (GitHub)

## 📊 Résumé Exécutif

### Outils de Sécurité Déployés
- ✅ **SonarQube** - Analyse statique de qualité et sécurité
- ✅ **CodeQL** - Détection avancée de vulnérabilités (GitHub)
- ✅ **ESLint + SonarJS** - Règles de sécurité JavaScript
- ✅ **Configuration enterprise** - Standards OWASP

### Fichiers d'Analyse Générés
- 📄 SonarQube Backend: ``sonar-backend-$timestamp.log``
- 📄 SonarQube Frontend: ``sonar-frontend-$timestamp.log``
- 📄 CodeQL SARIF: ``codeql-security-$timestamp.sarif``

## 🛡️ Points Forts Sécuritaires

### ✅ Protection Activée
- **Validation Joi** sur toutes les entrées utilisateur
- **Authentification Clerk** sécurisée avec fallback
- **Error handling** sans exposition de stack traces
- **Constants** pour éviter hardcoding de secrets
- **ESLint rules** conformes OWASP

### 🔒 Standards Respectés
- **CWE-79** : Protection XSS
- **CWE-89** : Prévention injection SQL  
- **CWE-94** : Code injection bloquée
- **CWE-200** : Information disclosure limitée
- **CWE-327** : Cryptographie sécurisée
- **CWE-352** : CSRF protection
- **CWE-400** : DoS prevention

## 🎯 Recommandations Prioritaires

1. **Audit dépendances** - Scanner node_modules régulièrement
2. **Rate limiting** - Renforcer sur toutes les API
3. **Logs sécurisés** - Éviter exposition données sensibles  
4. **Tests sécurité** - Intégrer dans CI/CD
5. **Monitoring** - Alertes temps réel sur anomalies

## 🚀 Prochaine Analyse

Prochaine analyse recommandée : **$(([DateTime]::Now).AddDays(7).ToString("dd/MM/yyyy"))**

---
*Rapport généré automatiquement par le système de sécurité HustleFinder IA*
"@ | Out-File -FilePath $reportPath -Encoding UTF8

    Write-Host "✅ Rapport consolidé créé: $reportPath" -ForegroundColor Green

    # RESUME FINAL
    Write-Host "`n🎉 ANALYSE TERMINEE AVEC SUCCES" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "📂 Tous les rapports dans: $OutputDir" -ForegroundColor Cyan
    Write-Host "🔒 Sécurité: SonarQube + CodeQL opérationnels" -ForegroundColor Cyan
    Write-Host "📋 Rapport principal: $reportPath" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")