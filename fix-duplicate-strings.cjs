#!/usr/bin/env node

/**
 * Script de correction automatique des chaînes dupliquées (SonarJS)
 * Extrait les chaînes répétées et les convertit en constantes
 */

const fs = require('fs');
const path = require('path');

console.log('📝 ======================================');
console.log('   CORRECTION CHAÎNES DUPLIQUÉES');
console.log('📝 ======================================');

// Compteurs globaux
let totalFilesProcessed = 0;
let totalStringsDeduplicated = 0;
let totalConstantsCreated = 0;

// Minimum d'occurrences pour créer une constante
const MIN_OCCURRENCES = 3;

// Patterns pour identifier les chaînes dupliquées
const stringPatterns = [
  // Chaînes entre guillemets simples
  /'([^']{4,50})'/g,
  // Chaînes entre guillemets doubles  
  /"([^"]{4,50})"/g,
  // Template literals simples
  /`([^`]{4,50})`/g
];

// Chaînes à ignorer (trop génériques)
const ignoredStrings = new Set([
  'error', 'success', 'warning', 'info', 'debug',
  'true', 'false', 'null', 'undefined',
  'GET', 'POST', 'PUT', 'DELETE', 'PATCH',
  'http', 'https', 'localhost',
  'utf8', 'utf-8', 'application/json',
  'Content-Type', 'Authorization',
  'development', 'production', 'test'
]);

// Fonction pour analyser un fichier et trouver les chaînes dupliquées
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const stringMap = new Map();

    // Extraire toutes les chaînes
    stringPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const str = match[1];
        
        // Ignorer les chaînes trop courtes, trop longues ou génériques
        if (str.length < 4 || str.length > 50 || ignoredStrings.has(str)) {
          continue;
        }

        // Ignorer les chaînes qui semblent être des chemins, URLs ou variables
        if (str.includes('/') || str.includes('\\') || str.includes('$') || 
            str.includes('{') || str.includes('}') || str.includes('<') ||
            str.includes('>') || str.includes('=') || str.includes('&') ||
            str.startsWith('http') || str.startsWith('www') ||
            /^\d+$/.test(str) || /^[A-Z_]+$/.test(str)) {
          continue;
        }

        if (!stringMap.has(str)) {
          stringMap.set(str, []);
        }
        stringMap.get(str).push(match.index);
      }
      
      // Reset regex
      pattern.lastIndex = 0;
    });

    // Retourner seulement les chaînes qui apparaissent assez souvent
    const duplicatedStrings = new Map();
    for (const [str, positions] of stringMap) {
      if (positions.length >= MIN_OCCURRENCES) {
        duplicatedStrings.set(str, positions);
      }
    }

    return duplicatedStrings;
  } catch (error) {
    console.error(`❌ Erreur lors de l'analyse de ${filePath}:`, error.message);
    return new Map();
  }
}

// Fonction pour corriger un fichier
function deduplicateStringsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    const duplicatedStrings = analyzeFile(filePath);
    
    if (duplicatedStrings.size === 0) {
      return { constantsCreated: 0, stringsReplaced: 0 };
    }

    const constants = [];
    let stringsReplaced = 0;

    // Créer des constantes pour chaque chaîne dupliquée
    for (const [str, positions] of duplicatedStrings) {
      const constantName = generateConstantName(str);
      const constantDeclaration = `const ${constantName} = '${str}';`;
      
      constants.push(constantDeclaration);

      // Remplacer toutes les occurrences dans le contenu
      const regex = new RegExp(`'${escapeRegExp(str)}'|"${escapeRegExp(str)}"|\`${escapeRegExp(str)}\``, 'g');
      const beforeCount = (content.match(regex) || []).length;
      content = content.replace(regex, constantName);
      const afterCount = (content.match(new RegExp(constantName, 'g')) || []).length;
      
      stringsReplaced += beforeCount;
    }

    // Ajouter les constantes au début du fichier (après les imports)
    if (constants.length > 0) {
      const lines = content.split('\n');
      let insertIndex = 0;

      // Trouver où insérer les constantes (après les imports/requires)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('import ') || line.startsWith('const ') && line.includes('require(') ||
            line.startsWith('require(') || line.startsWith('//') || line === '') {
          insertIndex = i + 1;
        } else {
          break;
        }
      }

      // Insérer les constantes
      const constantsSection = [
        '',
        '// Constantes pour chaînes dupliquées (optimisation SonarJS)',
        ...constants,
        ''
      ];

      lines.splice(insertIndex, 0, ...constantsSection);
      content = lines.join('\n');
    }

    // Sauvegarder si modifié
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}: ${constants.length} constantes créées, ${stringsReplaced} chaînes remplacées`);
      return { constantsCreated: constants.length, stringsReplaced };
    }

    return { constantsCreated: 0, stringsReplaced: 0 };
  } catch (error) {
    console.error(`❌ Erreur lors de la déduplication de ${filePath}:`, error.message);
    return { constantsCreated: 0, stringsReplaced: 0 };
  }
}

// Fonction pour générer un nom de constante
function generateConstantName(str) {
  // Convertir en UPPER_SNAKE_CASE
  const cleaned = str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, '_')
    .toUpperCase();

  // Limiter la longueur et ajouter un préfixe
  const limited = cleaned.substring(0, 30);
  return `STR_${limited}`;
}

// Fonction pour échapper les caractères spéciaux dans regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Fonction pour parcourir les répertoires
function processDirectory(dirPath, extensions = ['.js', '.ts', '.jsx', '.tsx']) {
  function walkDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Ignorer les répertoires système
        if (!['node_modules', '.git', 'dist', 'build', 'coverage', 'logs'].includes(item)) {
          walkDirectory(itemPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext) && !item.includes('.test.') && !item.includes('.spec.')) {
          const result = deduplicateStringsInFile(itemPath);
          totalConstantsCreated += result.constantsCreated;
          totalStringsDeduplicated += result.stringsReplaced;
          totalFilesProcessed++;
        }
      }
    }
  }

  walkDirectory(dirPath);
}

// Traitement principal
console.log('🔍 Recherche des chaînes dupliquées...\n');
console.log(`📏 Seuil minimum: ${MIN_OCCURRENCES} occurrences par chaîne\n`);

const startTime = Date.now();

// Traiter le backend
console.log('📁 Backend:');
processDirectory('./backend');

// Traiter le frontend
console.log('\n📁 Frontend:');
processDirectory('./frontend');

const endTime = Date.now();
const processingTime = ((endTime - startTime) / 1000).toFixed(2);

// Résultats finaux
console.log('\n🎯 ======== RÉSULTATS ========');
console.log(`📊 Fichiers traités: ${totalFilesProcessed}`);
console.log(`📝 Constantes créées: ${totalConstantsCreated}`);
console.log(`🔄 Chaînes remplacées: ${totalStringsDeduplicated}`);
console.log(`⏱️ Temps de traitement: ${processingTime}s`);

if (totalStringsDeduplicated > 0) {
  console.log('\n✅ SUCCESS: Chaînes dupliquées optimisées !');
  console.log('\n📈 BÉNÉFICES:');
  console.log(`   • Maintenabilité: ${totalConstantsCreated} constantes centralisées`);
  console.log(`   • SonarJS compliance: Règle no-duplicate-string respectée`); 
  console.log(`   • Bundle optimization: Réduction duplication code`);
  console.log(`   • Refactoring safety: Changements centralisés`);
  
  console.log('\n🚀 IMPACT SUR ALEX ULTIMATE:');
  console.log('   • Code maintenability améliorée');
  console.log('   • SonarJS violations réduites');
  console.log('   • Refactoring facilité');
  console.log('   • Standards enterprise respectés');
} else {
  console.log('\n✅ Aucune chaîne dupliquée trouvée nécessitant optimisation.');
}

console.log('\n📝 Correction des chaînes dupliquées terminée !');