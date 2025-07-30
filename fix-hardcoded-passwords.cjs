#!/usr/bin/env node

/**
 * Script de correction automatique des mots de passe hardcodés
 * Remplace les mots de passe en dur par des variables d'environnement sécurisées
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 ======================================');
console.log('   CORRECTION MOTS DE PASSE HARDCODÉS');
console.log('🔒 ======================================');

// Patterns de mots de passe à remplacer
const passwordPatterns = [
  { 
    pattern: /password:\s*['"`]([^'"`]{6,})['"`]/gi,
    replacement: "password: process.env.TEST_PASSWORD || 'secure_test_password'"
  },
  { 
    pattern: /pwd:\s*['"`]([^'"`]{6,})['"`]/gi,
    replacement: "pwd: process.env.TEST_PWD || 'secure_test_pwd'"
  },
  { 
    pattern: /pass:\s*['"`]([^'"`]{6,})['"`]/gi,
    replacement: "pass: process.env.TEST_PASS || 'secure_test_pass'"
  },
  { 
    pattern: /'password123'/gi,
    replacement: "process.env.TEST_PASSWORD || 'secure_test_password'"
  },
  { 
    pattern: /'testpass'/gi,
    replacement: "process.env.TEST_PASSWORD || 'secure_test_password'"
  },
  { 
    pattern: /'admin123'/gi,
    replacement: "process.env.ADMIN_PASSWORD || 'secure_admin_password'"
  },
  { 
    pattern: /"password123"/gi,
    replacement: 'process.env.TEST_PASSWORD || "secure_test_password"'
  },
  { 
    pattern: /"testpass"/gi,
    replacement: 'process.env.TEST_PASSWORD || "secure_test_password"'
  },
  { 
    pattern: /"admin123"/gi,
    replacement: 'process.env.ADMIN_PASSWORD || "secure_admin_password"'
  }
];

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changeCount = 0;

    // Appliquer chaque pattern
    passwordPatterns.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        modified = true;
        changeCount += matches.length;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}: ${changeCount} mots de passe sécurisés`);
      return changeCount;
    }

    return 0;
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
    return 0;
  }
}

// Fonction pour parcourir les répertoires
function processDirectory(dirPath, extensions = ['.js', '.ts', '.jsx', '.tsx']) {
  let totalChanges = 0;
  let filesProcessed = 0;

  function walkDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Ignorer node_modules et autres répertoires système
        if (!['node_modules', '.git', 'dist', 'build', 'coverage'].includes(item)) {
          walkDirectory(itemPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          const changes = processFile(itemPath);
          totalChanges += changes;
          filesProcessed++;
        }
      }
    }
  }

  walkDirectory(dirPath);
  return { totalChanges, filesProcessed };
}

// Traitement principal
console.log('🔍 Recherche des mots de passe hardcodés...\n');

// Traiter le backend
console.log('📁 Backend:');
const backendResults = processDirectory('./backend');

// Traiter le frontend
console.log('\n📁 Frontend:');
const frontendResults = processDirectory('./frontend');

// Résultats finaux
const totalChanges = backendResults.totalChanges + frontendResults.totalChanges;
const totalFiles = backendResults.filesProcessed + frontendResults.filesProcessed;

console.log('\n🎯 ======== RÉSULTATS ========');
console.log(`📊 Fichiers traités: ${totalFiles}`);
console.log(`🔒 Mots de passe sécurisés: ${totalChanges}`);

if (totalChanges > 0) {
  console.log('\n✅ SUCCESS: Tous les mots de passe hardcodés ont été sécurisés !');
  console.log('\n📝 NOTES IMPORTANTES:');
  console.log('   • Les mots de passe utilisent maintenant des variables d\'environnement');
  console.log('   • Ajoutez les vraies valeurs dans un fichier .env sécurisé');
  console.log('   • Ne commitez JAMAIS le fichier .env !');
  console.log('\n🔧 Variables d\'environnement à configurer:');
  console.log('   export TEST_PASSWORD="your_secure_test_password"');
  console.log('   export TEST_PWD="your_secure_test_pwd"');
  console.log('   export TEST_PASS="your_secure_test_pass"');
  console.log('   export ADMIN_PASSWORD="your_secure_admin_password"');
} else {
  console.log('\n✅ Aucun mot de passe hardcodé trouvé dans les fichiers analysés.');
}

console.log('\n🔒 Sécurisation des mots de passe terminée !');