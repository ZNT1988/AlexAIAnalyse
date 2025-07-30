/**
 * 🧪 TEST DU SYSTÈME ULTRA-OPTIMISÉ
 * Benchmark des performances après optimisation
 */
import logger from 'config/logger.js';

logger.info('='.repeat(50));

try {
  const alexMaster = await import('./systems/AlexMasterSystem.js');
  await alexMaster.default.initialize();

  const moduleStatus = alexMaster.default.getModuleStatus();

  logger.info('- Modules enregistrés:', moduleStatus.registry.systemState.totalRegistered);
  logger.info('- Modules échoués:', moduleStatus.registry.systemState.totalFailed);
  logger.info('- Ratio de succès:', Math.round((moduleStatus.registry.systemState.totalLoaded / moduleStatus.registry.systemState.totalRegistered) * 100) + '%');
  const categories = moduleStatus.registry.systemState.categories || {};
  let totalExpected = 0;
  let totalActual = 0;

  for(const [catName, catData] of Object.entries(categories)) {
    const loaded = catData.loaded || 0;
    const total = catData.total || 0;
    const failed = catData.failed || 0;
    totalExpected += total;
    totalActual += loaded;

    logger.info(`- ${catName}: ${loaded}/${total} (${ratio}%) - ${failed} échecs`);
  }
  logger.info(`- Amélioration: +${improvement} modules actifs!');
  logger.info('- Objectif 90%+: ${globalRatio >= 90 ? '✅ ATTEINT!' : '⚠️ En cours...'}`);

  // Test de traitement
  try {
      logger.info(`- Modules utilisés: ${response.metadata?
      .modulesUsed || 0}`);

  } catch (error) {
      // Logger fallback - ignore error
    } catch(error) {
  logger.error('Stack :
      ', error.stack.split('\n').slice(0,3).join('\n'));
}