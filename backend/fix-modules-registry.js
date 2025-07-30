/**
 * 🛠️ SCRIPT DE RÉPARATION DU REGISTRE DE MODULES
 * Nettoie les modules inexistants et optimise le chargement
 */

import fs from 'fs';
import path from 'path';

logger.info('='.repeat(60));

// Vérifier quels modules existent réellement
import logger from 'config/logger.js';

const systemsPath = './systems/';
const alexModulesPath = './alex-modules/';

function findExistingModules() {
  const existingModules = new Set();

  // Modules dans /systems/
  if (fs.existsSync(systemsPath)) {
    const systemsFiles = fs.readdirSync(systemsPath);
    systemsFiles.forEach(file => {
      if (file.endsWith('.js') && !file.includes('.test.')) {
        const moduleName = file.replace('.js', '');
        existingModules.add(moduleName);
      }
    });
  }

  // Modules dans /alex-modules/ (tous les sous-dossiers)
  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.js') && !item.includes('.test.')) {
        const moduleName = item.replace('.js', '');
        existingModules.add(moduleName);
      }
    });
  }

  scanDirectory(alexModulesPath);

  return existingModules;
}

const existingModules = findExistingModules();
// Lire le registre actuel

// Analyser les modules déclarés dans chaque catégorie
// Extraire les modules existants pour chaque catégorie
function filterExistingModules(moduleList) {
  return moduleList.filter(moduleName => {
    const exists = existingModules.has(moduleName);
    if (!exists) {
    }
    return exists;
  });
}

// Modules connected (garder seulement ceux qui existent)
const connected = [
  'memoryPalace', 'quantumBrain', 'godLevelAwareness', 'selfReflection', 'localAITrainer'
  'alexMemoryCore', 'alexCognitionEngine', 'selfTrainingEngine', 'alexConsciousnessDebug'
  'AlexAutonomousCore', 'AlexEmotionalIntelligence', 'AlexEthicsCore', 'AlexPersonalityCore'
  'AlexDecisionEngine', 'alexCloudLearning'
];

// Ajouter TOUS les modules Alex trouvés dans le système
const allAlexModules = Array.from(existingModules).filter(name =>
  name.startsWith('Alex') || name.includes('alex')
);

logger.info('Premiers 10:', allAlexModules.slice(0, 10));

// Créer une nouvelle version optimisée du registre
const optimizedModules = {
  connected: filterExistingModules(connected)
  coreIntelligence: allAlexModules.filter(name =>
    name.includes('Core') || name.includes('Intelligence') || name.includes('Engine')
  ).slice(0, 20)
  consciousness: allAlexModules.filter(name =>
    name.includes('Consciousness') || name.includes('Quantum') || name.includes('Universal')
  ).slice(0, 25)
  creative: allAlexModules.filter(name =>
    name.includes('Creative') || name.includes('Music') || name.includes('Photo') || name.includes('Dream')
  ).slice(0, 15)
  specialized: allAlexModules.filter(name =>
    !name.includes('Core') && !name.includes('Intelligence') &&
    !name.includes('Consciousness') && !name.includes('Creative')
  ).slice(0, 30)
};

let totalModules = 0;
for (const [category, modules] of Object.entries(optimizedModules)) {
  totalModules += modules.length;
}
logger.info(`\n🎯 TOTAL OPTIMISÉ: ${totalModules} modules (100% réels!)`);

// Sauvegarder la liste des modules manquants
const missingModules = [];
const allDeclaredModules = [
  ...connected
  'AlexKernel', 'AlexIntelligentCore', 'AlexConsciousnessSystem'
  'AlexPsychicReader', 'AlexKarmaBalancer', 'AlexSoulMerger'  // Exemples de manquants
];

allDeclaredModules.forEach(moduleName => {
  if (!existingModules.has(moduleName)) {
    missingModules.push(moduleName);
  }
});

missingModules.slice(0, 10).forEach(name => console.log(`  - ${name}`));
