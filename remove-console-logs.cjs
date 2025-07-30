#!/usr/bin/env node

/**
 * Script de suppression automatique des console.log en production
 * Supprime tous les console.log tout en préservant les console.error et console.warn
 */

const fs = require('fs');
const path = require('path');

console.log('🚫 ======================================');
console.log('   SUPPRESSION CONSOLE.LOG PRODUCTION');
console.log('🚫 ======================================');

// Compteurs globaux
let totalFilesProcessed = 0;
let totalConsoleLogsRemoved = 0;
let totalLinesRemoved = 0;

// Patterns pour identifier les console.log à supprimer
const consolePatterns = [
  // console.log simple
  {
    pattern: /^\s*console\.log\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.log',
    preserve: false
  },
  
  // console.debug (aussi à supprimer en prod)
  {
    pattern: /^\s*console\.debug\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.debug',
    preserve: false
  },
  
  // console.info (peut être gardé selon le contexte)
  {
    pattern: /^\s*console\.info\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.info',
    preserve: false // On supprime aussi pour performance
  },
  
  // console.trace (debug uniquement)
  {
    pattern: /^\s*console\.trace\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.trace',
    preserve: false
  },
  
  // console.time et console.timeEnd (debug performance)
  {
    pattern: /^\s*console\.(time|timeEnd)\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.time*',
    preserve: false
  },
  
  // console.table (debug uniquement)
  {
    pattern: /^\s*console\.table\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.table',
    preserve: false
  },
  
  // console.dir (debug uniquement)
  {
    pattern: /^\s*console\.dir\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.dir',
    preserve: false
  },
  
  // console.count (debug uniquement)
  {
    pattern: /^\s*console\.count\s*\([^)]*\)\s*;?\s*$/gm,
    type: 'console.count',
    preserve: false
  }
];

// Patterns à PRÉSERVER (ne pas supprimer)
const preservePatterns = [
  /console\.error/,
  /console\.warn/,
  /console\.assert/,
  // Commentaires contenant console
  /\/\/.*console/,
  /\/\*.*console.*\*\//
];

// Fonction pour vérifier si une ligne doit être préservée
function shouldPreserveLine(line) {
  return preservePatterns.some(pattern => pattern.test(line));
}

// Fonction pour nettoyer un fichier
function cleanConsoleFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLines = content.split('\n');
    let consolesRemoved = 0;
    let linesRemoved = 0;

    // Traiter ligne par ligne pour plus de précision
    const cleanedLines = [];
    let skipNextEmptyLine = false;

    for (let i = 0; i < originalLines.length; i++) {
      const line = originalLines[i];
      let shouldRemoveLine = false;

      // Vérifier si la ligne doit être préservée
      if (shouldPreserveLine(line)) {
        cleanedLines.push(line);
        continue;
      }

      // Vérifier chaque pattern de console
      for (const pattern of consolePatterns) {
        if (pattern.pattern.test(line) && !pattern.preserve) {
          shouldRemoveLine = true;
          consolesRemoved++;
          linesRemoved++;
          skipNextEmptyLine = true;
          break;
        }
        // Reset regex
        pattern.pattern.lastIndex = 0;
      }

      if (!shouldRemoveLine) {
        // Si la ligne précédente était un console.log et cette ligne est vide, on peut la supprimer aussi
        if (skipNextEmptyLine && line.trim() === '') {
          skipNextEmptyLine = false;
          linesRemoved++;
          continue;
        }
        skipNextEmptyLine = false;
        cleanedLines.push(line);
      }
    }

    // Rejoindre les lignes et nettoyer les espaces multiples
    let cleanedContent = cleanedLines.join('\n');
    
    // Supprimer les lignes vides multiples
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Supprimer les espaces en fin de ligne
    cleanedContent = cleanedContent.replace(/[ \t]+$/gm, '');

    // Sauvegarder si modifié
    if (cleanedContent !== content) {
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      console.log(`✅ ${filePath}: ${consolesRemoved} console.log supprimés (${linesRemoved} lignes)`);
      return { consolesRemoved, linesRemoved };
    }

    return { consolesRemoved: 0, linesRemoved: 0 };
  } catch (error) {
    console.error(`❌ Erreur lors du nettoyage de ${filePath}:`, error.message);
    return { consolesRemoved: 0, linesRemoved: 0 };
  }
}

// Fonction pour parcourir les répertoires
function cleanConsoleFromDirectory(dirPath, extensions = ['.js', '.ts', '.jsx', '.tsx']) {
  function walkDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Ignorer les répertoires système et tests
        if (!['node_modules', '.git', 'dist', 'build', 'coverage', 'logs', 'test', '__tests__'].includes(item)) {
          walkDirectory(itemPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext) && !item.includes('.test.') && !item.includes('.spec.')) {
          const result = cleanConsoleFromFile(itemPath);
          totalConsoleLogsRemoved += result.consolesRemoved;
          totalLinesRemoved += result.linesRemoved;
          totalFilesProcessed++;
        }
      }
    }
  }

  walkDirectory(dirPath);
}

// Traitement principal
console.log('🔍 Recherche des console.log en production...\n');
console.log('ℹ️  PRÉSERVÉS: console.error, console.warn, console.assert');
console.log('🗑️  SUPPRIMÉS: console.log, console.debug, console.info, console.trace, etc.\n');

const startTime = Date.now();

// Nettoyer le backend (sauf tests)
console.log('📁 Backend (production):');
cleanConsoleFromDirectory('./backend');

// Nettoyer le frontend (sauf tests)
console.log('\n📁 Frontend (production):');
cleanConsoleFromDirectory('./frontend');

const endTime = Date.now();
const processingTime = ((endTime - startTime) / 1000).toFixed(2);

// Résultats finaux
console.log('\n🎯 ======== RÉSULTATS ========');
console.log(`📊 Fichiers traités: ${totalFilesProcessed}`);
console.log(`🚫 Console.log supprimés: ${totalConsoleLogsRemoved}`);
console.log(`📝 Lignes supprimées: ${totalLinesRemoved}`);
console.log(`⏱️ Temps de traitement: ${processingTime}s`);

if (totalConsoleLogsRemoved > 0) {
  console.log('\n✅ SUCCESS: Console.log de production supprimés !');
  console.log('\n📈 BÉNÉFICES PERFORMANCE:');
  console.log(`   • Réduction bundle: ~${(totalLinesRemoved * 25).toLocaleString()} bytes`);
  console.log(`   • Runtime performance: Élimination I/O console`);
  console.log(`   • Memory usage: Réduction string allocation`);
  console.log(`   • Security: Pas de leak d'infos debug`);
  
  console.log('\n🚀 IMPACT SUR ALEX ULTIMATE:');
  console.log('   • Startup plus rapide (pas de console I/O)');
  console.log('   • Memory footprint réduit');
  console.log('   • Production-ready code');
  console.log('   • Better user experience');
  
  console.log('\n📋 RECOMMANDATIONS:');
  console.log('   • Utilisez un logger professionnel (Winston, Pino)');
  console.log('   • Configurez les logs par environnement');
  console.log('   • Gardez console.error/warn pour debugging');
} else {
  console.log('\n✅ Code déjà optimisé ! Pas de console.log trouvés.');
}

console.log('\n🚫 Suppression des console.log terminée !');