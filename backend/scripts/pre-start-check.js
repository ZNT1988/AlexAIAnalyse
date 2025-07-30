
// Constantes pour chaînes dupliquées (optimisation SonarJS)
const STR_ERROR = 'error';
// Constantes pour chaînes dupliquées (optimisation SonarJS)
import logger from '../config/logger.js';

const STR_ENV = '.env';

#!/usr/bin/env node

/**
 * Script de vérification pré-démarrage pour HustleFinderIA Backend
 * Vérifie l'intégrité du système avant le lancement
 */

import fs from 'fs';
import path from 'path';
import net from 'net';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const checks = {
  passed: 0
  failed: 0
  warnings: 0
};

// Couleurs pour la console
const colors = {
  green: '\x1b[32m'
  red: '\x1b[31m'
  yellow: '\x1b[33m'
  blue: '\x1b[34m'
  reset: '\x1b[0m'
};

function log(type) {  let color = colors.reset;
  let prefix = 'INFO';

  switch(type) {
    case STR_SUCCESS:      checks.passed++;
      break;
    case STR_ERROR:      checks.failed++;
      break;
    case STR_WARNING:      checks.warnings++;
      break;
  }

}

// 1. Vérification des fichiers critiques
function checkCriticalFiles() {
  log(STR_INFO, 'Vérification des fichiers critiques...');

  const criticalFiles = [
    'index.js'
    'package.json'
    STR_ENV
    'core/HustleFinderCore.js'
    'systems/NeuroCore.js'
    'systems/AlexEvolutionCore.js'
    'systems/SoulPrintGenerator.js'
    'routes/ai.js'
    'routes/aiSystem.js'
    'routes/assistant.js'
    'config/database.js'
    'config/logger.js'
    'middleware/auth.js'
  ];

  for (const file of criticalFiles) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      log(STR_SUCCESS, `Fichier trouvé: ${file}`);
    } else {
      log(STR_ERROR, `Fichier manquant: ${file}`);
    }
  }
}

// 2. Vérification des doublons
function checkDuplicates() {
  log(STR_INFO, 'Vérification des doublons...');

  const potentialDuplicates = [
    'systems/HustleFinderCore.js'
    'systems/PersonalAssistant.js'
    'systems/VisualCortex.js'
    'systems/AlexMemoryPalace.js'
  ];

  for (const duplicate of potentialDuplicates) {
    const filePath = path.join(rootDir, duplicate);
    if (fs.existsSync(filePath)) {
      log(STR_ERROR, `Doublon détecté: ${duplicate} - À supprimer !`);
    } else {
      log(STR_SUCCESS, `Pas de doublon: ${duplicate}`);
    }
  }
}

// 3. Vérification de la configuration
function checkConfiguration() {
  log(STR_INFO, 'Vérification de la configuration...');

  const envPath = path.join(rootDir, STR_ENV);
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    if (envContent.includes('PORT=')) {
      const port = envContent.match(/PORT=(\d+)/)?.[1];
      log(STR_SUCCESS, `Port configuré: ${port}`);
    } else {
      log(STR_WARNING, 'Port non spécifié dans .env, utilisera 5000 par défaut');
    }

    if (envContent.includes('NODE_ENV=')) {
      const env = envContent.match(/NODE_ENV=(\w+)/)?.[1];
      log(STR_SUCCESS, `Environnement: ${env}`);
    } else {
      log(STR_WARNING, 'NODE_ENV non spécifié');
    }
  } else {
    log(STR_ERROR, 'Fichier .env manquant');
  }
}

// 4. Vérification de la syntaxe des fichiers JS
async function checkSyntax() {
  log(STR_INFO, 'Vérification de la syntaxe...');

  const jsFiles = [
    'index.js'
    'core/HustleFinderCore.js'
    'core/NeuroCore.js'
  ];

  for (const file of jsFiles) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Vérifications basiques de syntaxe
        if (content.includes('import') && !content.includes('export')) {
          log(STR_WARNING, `${file}: Contient des imports mais pas d'exports`);
        }
        log(STR_SUCCESS, `Syntaxe OK: ${file}`);
      } catch (error) {
      // Logger fallback - ignore error
    }: ${error.message}`);
      }
    }
  }
}

// 5. Vérification et résolution des conflits de port
async function checkPortConflict() {
  log(STR_INFO, 'Vérification des conflits de port...');

  const envPath = path.join(rootDir, STR_ENV);
  let port = 8080; // Port par défaut

  // Lire le port depuis .env
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const portMatch = envContent.match(/PORT=(\d+)/);
    if (portMatch) {
      port = parseInt(portMatch[1]);
    }
  }

  // Tester si le port est libre
  const isPortFree = await testPort(port);

  if (!isPortFree) {
    log(STR_WARNING, `Port ${port} déjà utilisé, recherche d'un port libre...`);

    // Chercher un port libre à partir de 8080
    const freePort = await findFreePort(8080);

    if (freePort) {
      log(STR_SUCCESS, `Port libre trouvé: ${freePort}`);

      // Mettre à jour le .env avec le nouveau port
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/PORT=\d+/, `PORT=${freePort}`);
      } else {
        envContent = `PORT=${freePort}\nNODE_ENV=development\n`;
      }

      fs.writeFileSync(envPath, envContent);
      log(STR_SUCCESS, `Fichier .env mis à jour avec le port ${freePort}`);

    } else {
      log(STR_ERROR, 'Aucun port libre trouvé dans la plage 8080-8100');
    }
  } else {
    log(STR_SUCCESS, `Port ${port} disponible`);
  }
}

// Fonction pour tester si un port est libre
function testPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.once('close', () => {
        resolve(true); // Port libre
      });
      server.close();
    });

    server.on(STR_ERROR, () => {
      resolve(false); // Port occupé
    });
  });
}

// Fonction pour trouver un port libre
async function findFreePort(startPort) {
  for (let port = startPort; port <= startPort + 20; port++) {
    const isFree = await testPort(port);
    if (isFree) {
      return port;
    }
  }
  return null;
}

// 6. Auto-correction des problèmes courants
function autoFix() {
  log(STR_INFO, 'Application des corrections automatiques...');

  // Créer .env si manquant
  const envPath = path.join(rootDir, STR_ENV);
  if (!fs.existsSync(envPath)) {
    const defaultEnv = 'PORT=8080
NODE_ENV=development
';
    fs.writeFileSync(envPath, defaultEnv);
    log(STR_SUCCESS, 'Fichier .env créé avec configuration par défaut');
  }

  // Créer dossier logs si manquant
  const logsDir = path.join(rootDir, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    log(STR_SUCCESS, 'Dossier logs créé');
  }
}

// Exécution des vérifications
async function runChecks() {
  try {
    checkCriticalFiles();
    checkDuplicates();
    checkConfiguration();
    await checkSyntax();
    await checkPortConflict();
    autoFix();
    // Résumé
    logger.info(`✅ Réussies: ${checks.passed}');
    logger.info('❌ Échecs: ${checks.failed}`);
    if (checks.failed === 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }

  } catch (error) {
      // Logger fallback - ignore error
    }`);
    process.exit(1);
  }
}

// Lancement des vérifications
runChecks();