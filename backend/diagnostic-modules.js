/**
 * 🔍 DIAGNOSTIC EXHAUSTIF DES MODULES ALEX ULTIMATE
 * Analyse complète pour identifier les modules manquants
 */
import logger from 'config/logger.js';

logger.info('='.repeat(60));

try {
  const alexMaster = await import('./systems/AlexMasterSystem.js');
  await alexMaster.default.initialize();

  const moduleStatus = alexMaster.default.getModuleStatus();
  logger.info('- Total enregistrés:', moduleStatus.registry.systemState.totalRegistered);
  logger.info('- Total échoués:', moduleStatus.registry.systemState.totalFailed);
  logger.info('- Ratio d\'activation:', Math.round((moduleStatus.registry.systemState.totalLoaded / moduleStatus.registry.systemState.totalRegistered) * 100) + '%');
  // Analyse détaillée des modules par catégorie
  const categories = moduleStatus.registry.systemState.categories || {};
  for(const [catName, catData] of Object.entries(categories)) {
    const loaded = catData.loaded || 0;
    const total = catData.total || 0;
    const failed = catData.failed || 0;
    logger.info(`- ${catName}: ${loaded}/${total} actifs (${Math.round((loaded/total)*100)}%) - ${failed} échecs`);
  }
  // Liste des modules défaillants
  const failedModules = moduleStatus.registry.systemState.failedModules || [];
  if (failedModules.length > 0) {
    failedModules.forEach((moduleName, index) => {
    });
  } else {
  }
  // Modules chargés avec succès
  const loadedModules = moduleStatus.registry.systemState.loadedModules || [];
  loadedModules.slice(0, 10).forEach((moduleName, index) => {
  });
  if (loadedModules.length > 10) {
  }

  logger.info('🎯 OBJECTIF: Passer de', moduleStatus.registry.systemState.totalLoaded, 'à 140+ modules actifs (90%+)');

} catch (error) {
      // Logger fallback - ignore error
    }