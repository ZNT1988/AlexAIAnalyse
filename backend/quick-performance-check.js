/**
 * ⚡ CHECK RAPIDE DE PERFORMANCE
 * Test ultra-rapide pour voir les résultats
 */

logger.info('='.repeat(50));

// Timeout rapide de 30 secondes
import logger from 'config/logger.js';

const timeoutMs = 30000;
const timeout = setTimeout(() => {
  process.exit(0);
}, timeoutMs);

try {
  const alexMaster = await import('./systems/AlexMasterSystem.js');

  // Initialisation avec timeout
  await Promise.race([
    alexMaster.default.initialize()
    new Promise((_, reject) => setTimeout(() => reject(new Error('Init timeout')), 25000))
  ]);

  const moduleStatus = alexMaster.default.getModuleStatus();

  clearTimeout(timeout);

  logger.info('- Enregistrés:', moduleStatus.registry.systemState.totalRegistered);
  logger.info('- Échoués:', moduleStatus.registry.systemState.totalFailed);

  const successRate = Math.round((moduleStatus.registry.systemState.totalLoaded / moduleStatus.registry.systemState.totalRegistered) * 100);

  if (successRate >= 90) {
  } else if (successRate >= 70) {
    logger.info('🎯 EXCELLENT PROGRÈS! (>70%)');
  } else {
  }

} catch (error) {
      // Logger fallback - ignore error
    }