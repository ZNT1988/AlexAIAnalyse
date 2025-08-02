#!/usr/bin/env node
/**
 * Script pour corriger les erreurs de syntaxe détectées
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns spécifiques pour corriger les erreurs syntaxiques
const syntaxFixes = [
  // Corriger "};    ];" en "}];"
  {
    pattern: /\};\s*\n?\s*\];/g,
    replacement: '}];',
    description: 'Correction syntax array closing'
  },
  // Corriger les doubles points-virgules
  {
    pattern: /;;/g,
    replacement: ';',
    description: 'Remove double semicolons'
  },
  // Corriger les exports cassés "export // const"
  {
    pattern: /export\s*\/\/\s*const\s+/g,
    replacement: 'export const ',
    description: 'Fix broken exports'
  }
];

function testSyntax(filePath) {
  try {
    execSync(`node -c "${filePath}"`, { stdio: 'pipe' });
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.stderr.toString() };
  }
}

function fixSyntaxInFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let content = originalContent;
    let changed = false;
    
    // Test syntaxe initiale
    const initialTest = testSyntax(filePath);
    if (initialTest.valid) {
      return { fixed: false, message: 'Already valid' };
    }
    
    // Appliquer les corrections
    syntaxFixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        changed = true;
        console.log(`  ✅ Applied: ${fix.description}`);
      }
    });
    
    if (changed) {
      // Sauvegarder les modifications
      fs.writeFileSync(filePath, content, 'utf8');
      
      // Tester la nouvelle syntaxe
      const finalTest = testSyntax(filePath);
      if (finalTest.valid) {
        return { fixed: true, message: 'Fixed successfully' };
      } else {
        // Restaurer l'original si toujours cassé
        fs.writeFileSync(filePath, originalContent, 'utf8');
        return { fixed: false, message: `Still broken: ${finalTest.error}` };
      }
    }
    
    return { fixed: false, message: `No patterns matched for: ${initialTest.error}` };
    
  } catch (error) {
    return { fixed: false, message: `Error: ${error.message}` };
  }
}

function findJSFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    try {
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
    } catch (error) {
      console.warn(`Cannot scan ${currentDir}: ${error.message}`);
    }
  }
  
  scan(dir);
  return files;
}

// Main execution
console.log('🔧 Correction des erreurs de syntaxe JavaScript...\n');

const targetDirs = [
  'backend/alex-modules',
  'frontend/src/IA'
];

let totalFiles = 0;
let validFiles = 0;
let fixedFiles = 0;
let brokenFiles = [];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📁 Traitement: ${dir}`);
    const files = findJSFiles(dir);
    
    files.forEach(file => {
      totalFiles++;
      console.log(`  🔍 ${path.basename(file)}`);
      
      const result = fixSyntaxInFile(file);
      
      if (result.fixed) {
        fixedFiles++;
        console.log(`    ✅ ${result.message}`);
      } else if (result.message === 'Already valid') {
        validFiles++;
        console.log(`    ✓ ${result.message}`);
      } else {
        brokenFiles.push({ file, message: result.message });
        console.log(`    ❌ ${result.message}`);
      }
    });
    
    console.log('');
  }
});

// Rapport final
console.log('🎯 RÉSUMÉ:');
console.log(`   📁 ${totalFiles} fichiers analysés`);
console.log(`   ✅ ${fixedFiles} fichiers corrigés`);
console.log(`   ✓  ${validFiles} fichiers déjà valides`);
console.log(`   ❌ ${brokenFiles.length} fichiers encore problématiques`);

if (brokenFiles.length > 0) {
  console.log('\n❌ Fichiers encore problématiques:');
  brokenFiles.slice(0, 5).forEach(({ file, message }) => {
    console.log(`   ${path.basename(file)}: ${message.substring(0, 100)}...`);
  });
  if (brokenFiles.length > 5) {
    console.log(`   ... et ${brokenFiles.length - 5} autres`);
  }
}

console.log('\n✨ Correction syntaxique terminée !');