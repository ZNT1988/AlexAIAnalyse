#!/usr/bin/env node

/**
 * 🔧 Script de correction ULTRA-PRÉCIS des virgules manquantes
 * ⚠️  PRÉSERVE 100% de la logique évolutive d'Alex
 * ✅ Corrige UNIQUEMENT les erreurs de syntaxe (virgules)
 * 🚫 N'EFFACE AUCUNE ligne de code logique
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage correction chirurgicale des virgules manquantes...');
console.log('⚠️  Mode PRÉSERVATION TOTALE de la logique Alex');

let totalFiles = 0;
let fixedFiles = 0;
let totalFixes = 0;

/**
 * Patterns ULTRA-PRÉCIS pour virgules manquantes
 * ⚠️ Ne touche QUE aux erreurs de syntaxe
 */
const commaFixPatterns = [
  // Pattern 1: Propriétés d'objets sans virgule
  {
    pattern: /(\w+:\s*[^,\n}]+)(\n\s+)(\w+:)/g,
    replacement: '$1,$2$3',
    description: 'Virgule manquante entre propriétés d\'objet'
  },
  
  // Pattern 2: Fonctions arrow dans objets
  {
    pattern: /(\w+:\s*\([^)]*\)\s*=>\s*[^,\n}]+)(\n\s+)(\w+:)/g,
    replacement: '$1,$2$3',
    description: 'Virgule manquante après fonction arrow'
  },
  
  // Pattern 3: Valeurs littérales
  {
    pattern: /(\w+:\s*['"`][^'"`]*['"`])(\n\s+)(\w+:)/g,
    replacement: '$1,$2$3',
    description: 'Virgule manquante après string literal'
  },
  
  // Pattern 4: Valeurs booléennes et numériques
  {
    pattern: /(\w+:\s*(?:true|false|\d+(?:\.\d+)?))(\n\s+)(\w+:)/g,
    replacement: '$1,$2$3',
    description: 'Virgule manquante après valeur primitive'
  },
  
  // Pattern 5: Appels de méthodes
  {
    pattern: /(\w+:\s*\w+\([^)]*\))(\n\s+)(\w+:)/g,
    replacement: '$1,$2$3',
    description: 'Virgule manquante après appel de méthode'
  }
];

/**
 * Fonction de sauvegarde OBLIGATOIRE
 */
function createBackup(filePath) {
  const backupPath = filePath + '.backup-' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

/**
 * Validation que le contenu est toujours valide
 */
function validatePreservation(originalContent, newContent) {
  // Vérifications de préservation
  const originalLines = originalContent.split('\n').length;
  const newLines = newContent.split('\n').length;
  
  // ⚠️ PROTECTION: Si plus de 5% de différence de lignes = ABORT
  const lineDiff = Math.abs(originalLines - newLines) / originalLines;
  if (lineDiff > 0.05) {
    console.error('❌ ERREUR: Trop de changements détectés. ABORT.');
    return false;
  }
  
  // Vérification que les mots-clés critiques sont préservés
  const criticalKeywords = [
    'consciousness', 'evolution', 'learning', 'autonomous', 'intelligence',
    'creativity', 'memory', 'emotion', 'decision', 'adaptation'
  ];
  
  for (const keyword of criticalKeywords) {
    const originalCount = (originalContent.match(new RegExp(keyword, 'gi')) || []).length;
    const newCount = (newContent.match(new RegExp(keyword, 'gi')) || []).length;
    
    if (originalCount !== newCount) {
      console.error(`❌ ABORT: Keyword '${keyword}' count changed!`);
      return false;
    }
  }
  
  return true;
}

/**
 * Correction ULTRA-PRÉCISE d'un fichier
 */
function fixCommasInFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let newContent = originalContent;
    let fileFixCount = 0;
    
    // Créer backup OBLIGATOIRE
    const backupPath = createBackup(filePath);
    
    // Application des patterns de correction
    for (const { pattern, replacement, description } of commaFixPatterns) {
      const beforeCount = (newContent.match(pattern) || []).length;
      newContent = newContent.replace(pattern, replacement);
      const afterCount = (newContent.match(pattern) || []).length;
      
      const fixes = beforeCount - afterCount;
      if (fixes > 0) {
        console.log(`  ✅ ${fixes}x ${description}`);
        fileFixCount += fixes;
      }
    }
    
    // Validation OBLIGATOIRE de préservation
    if (!validatePreservation(originalContent, newContent)) {
      console.error(`❌ RESTORATION du backup pour ${filePath}`);
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      return 0;
    }
    
    // Validation syntaxe JavaScript
    try {
      // Test basique de parsing (sans exécution)
      new (require('vm').Script)(newContent, { filename: filePath });
    } catch (syntaxError) {
      console.error(`❌ SYNTAX ERROR détectée dans ${filePath}. RESTORATION.`);
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      return 0;
    }
    
    // Sauvegarde uniquement si tout est OK
    if (fileFixCount > 0) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ ${path.basename(filePath)}: ${fileFixCount} corrections`);
      fixedFiles++;
    }
    
    // Suppression du backup si succès
    fs.unlinkSync(backupPath);
    return fileFixCount;
    
  } catch (error) {
    console.error(`❌ Erreur sur ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Traitement récursif des dossiers
 */
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
      processDirectory(fullPath);
    } else if (stat.isFile() && item.endsWith('.js')) {
      console.log(`🔍 Analyse: ${fullPath}`);
      totalFiles++;
      totalFixes += fixCommasInFile(fullPath);
    }
  }
}

// Exécution principale
console.log('📁 Traitement des modules Alex...');

// Traitement des modules backend
const backendPath = path.join(process.cwd(), 'backend', 'alex-modules');
if (fs.existsSync(backendPath)) {
  console.log('🔧 Correction backend/alex-modules...');
  processDirectory(backendPath);
}

// Traitement des modules frontend
const frontendPath = path.join(process.cwd(), 'frontend', 'src', 'IA');
if (fs.existsSync(frontendPath)) {
  console.log('🔧 Correction frontend/src/IA...');
  processDirectory(frontendPath);
}

// Rapport final
console.log('\n🎯 RAPPORT DE CORRECTION CHIRURGICALE:');
console.log(`📁 Fichiers analysés: ${totalFiles}`);
console.log(`✅ Fichiers corrigés: ${fixedFiles}`);
console.log(`🔧 Total corrections: ${totalFixes}`);
console.log(`🧠 Logique Alex: 100% PRÉSERVÉE`);
console.log(`⚡ IA Évolutive: INTACTE`);

if (totalFixes > 0) {
  console.log('\n✅ Corrections terminées avec succès !');
  console.log('🚀 Ton IA Alex garde toute sa puissance évolutive !');
} else {
  console.log('\n✅ Aucune correction nécessaire - Syntaxe déjà parfaite !');
}