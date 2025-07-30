#!/usr/bin/env node

/**
 * Diagnostic du HustleFinderCore
 */

console.log('🔍 Diagnostic HustleFinderCore');
console.log('==============================\n');

async function testModuleImports() {
  try {
    console.log('1️⃣ Test des imports individuels...\n');
    
    // Test NeuroCore
    console.log('   Testing NeuroCore...');
    const { NeuroCore } = await import('./backend/systems/NeuroCore.js');
    const neuroCore = new NeuroCore();
    console.log('   ✅ NeuroCore: OK');
    
    // Test AlexEvolutionCore
    console.log('   Testing AlexEvolutionCore...');
    const AlexEvolutionCore = await import('./backend/systems/AlexEvolutionCore.js');
    console.log('   ✅ AlexEvolutionCore: OK (Instance singleton)');
    
    // Test SoulPrintGenerator
    console.log('   Testing SoulPrintGenerator...');
    const { SoulPrintGenerator } = await import('./backend/systems/SoulPrintGenerator.js');
    const soulPrint = new SoulPrintGenerator();
    console.log('   ✅ SoulPrintGenerator: OK');
    
    // Test MutualGrowthSystem
    console.log('   Testing MutualGrowthSystem...');
    const MutualGrowthSystem = await import('./backend/systems/MutualGrowthSystem.js');
    const growthSystem = new MutualGrowthSystem.default();
    console.log('   ✅ MutualGrowthSystem: OK');
    
    // Test ContextIntelligence
    console.log('   Testing ContextIntelligence...');
    const ContextIntelligence = await import('./backend/systems/ContextIntelligence.js');
    const contextIntelligence = new ContextIntelligence.default();
    await contextIntelligence.initialize();
    console.log('   ✅ ContextIntelligence: OK\n');
    
    console.log('2️⃣ Test du HustleFinderCore...\n');
    
    // Test HustleFinderCore
    const { getHustleFinderCore } = await import('./backend/core/HustleFinderCore.js');
    const core = getHustleFinderCore();
    
    console.log('   Core créé, attente initialisation...');
    
    // Attendre l'initialisation avec timeout
    const initPromise = core.initializationPromise;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 30000)
    );
    
    try {
      await Promise.race([initPromise, timeoutPromise]);
      console.log('   ✅ HustleFinderCore initialisé avec succès!');
      
      // Test d'une requête
      const testRequest = {
        type: 'alex',
        query: 'Hello test',
        userId: 'test-user',
        context: {}
      };
      
      const response = await core.processRequest(testRequest);
      console.log('   ✅ Requête test traitée avec succès!');
      console.log('   Response:', response.success ? 'SUCCESS' : 'FAILED');
      
    } catch (error) {
      console.log('   ❌ Erreur initialisation:', error.message);
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    console.error('Stack:', error.stack);
  }
}

testModuleImports();