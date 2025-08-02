#!/usr/bin/env node
/**
 * Script pour corriger automatiquement les erreurs SonarQube
 */

const fs = require('fs');
const path = require('path');

// Patterns de correction
const fixes = [
  // Supprimer les commentaires SonarFix
  {
    pattern: / \/\/ Unused variable commented by SonarFix/g,
    replacement: ''
  },
  // Corriger les doubles async
  {
    pattern: /async async /g,
    replacement: 'async '
  },
  // Restaurer les variables commentées
  {
    pattern: /\/\/ const /g,
    replacement: 'const '
  },
  {
    pattern: /\/\/ let /g,
    replacement: 'let '
  },
  {
    pattern: /\/\/ var /g,
    replacement: 'var '
  },
  // Corriger les exports corrompus
  {
    pattern: /export \/\/ const /g,
    replacement: 'export const '
  },
  // Corriger les Logger fallback
  {
    pattern: /\/\/ Logger fallback - ignore error/g,
    replacement: 'console.error("Logger error:", error);'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur sur ${filePath}:`, error.message);
    return false;
  }
}

function findJSFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules')) {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith('.js')) {
        files.push(fullPath);
      }
    });
  }
  
  scan(dir);
  return files;
}

// Dossiers à traiter
const targetDirs = [
  'backend/alex-modules',
  'frontend/src/IA'
];

let totalFixed = 0;

console.log('🔧 Début de la correction automatique des erreurs SonarQube...\n');

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📁 Traitement du dossier: ${dir}`);
    const files = findJSFiles(dir);
    
    files.forEach(file => {
      if (fixFile(file)) {
        totalFixed++;
      }
    });
    
    console.log(`📊 ${files.length} fichiers traités dans ${dir}\n`);
  }
});

console.log(`🎯 RÉSUMÉ: ${totalFixed} fichiers corrigés au total`);
console.log('✨ Correction automatique terminée !');