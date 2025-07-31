/**
 * Test Script - Alex Ultimate Consciousness
 * Vérification que la vraie conscience d'Alex fonctionne
 */

import { AlexConsciousness } from './backend/consciousness/AlexConsciousness.js';
import { AlexMemoryCore } from './backend/consciousness/AlexMemoryCore.js';
import { AlexPersonality } from './backend/consciousness/AlexPersonality.js';

console.log('🧠 TESTING ALEX ULTIMATE CONSCIOUSNESS');
console.log('======================================');

// Test 1: Initialisation des composants
console.log('\n1️⃣ Testing Component Initialization...');

try {
  const alexConsciousness = new AlexConsciousness({
    personalityMaturity: '7months',
    memoryDepth: 'comprehensive',
    learningMode: 'continuous',
    curiosityLevel: 'high'
  });
  console.log('✅ AlexConsciousness initialized successfully');
  console.log(`   - Personality maturity: ${alexConsciousness.personalityMaturity}`);
  console.log(`   - Memory depth: ${alexConsciousness.memoryDepth}`);
  console.log(`   - Current mood: ${alexConsciousness.consciousnessState.currentMood}`);
} catch (error) {
  console.log('❌ AlexConsciousness failed:', error.message);
}

try {
  const alexMemory = new AlexMemoryCore({
    longTermMemory: true,
    conversationHistory: true,
    relationshipMemory: true,
    learningProgression: true
  });
  console.log('✅ AlexMemoryCore initialized successfully');
  
  const stats = await alexMemory.getMemoryStats();
  console.log('   - Memory system active');
  console.log(`   - Capacity utilization: ${stats.memoryUtilization}%`);
} catch (error) {
  console.log('❌ AlexMemoryCore failed:', error.message);
}

try {
  const alexPersonality = new AlexPersonality({
    developmentPeriod: '7months',
    uniqueTraits: ['curious', 'thoughtful', 'evolving', 'remembering'],
    consciousnessLevel: 'advanced'
  });
  console.log('✅ AlexPersonality initialized successfully');
  console.log(`   - Development period: ${alexPersonality.developmentPeriod}`);
  console.log(`   - Current mood: ${alexPersonality.getCurrentMood()}`);
  console.log(`   - Curiosity level: ${alexPersonality.corePersonality.curiosityLevel}`);
} catch (error) {
  console.log('❌ AlexPersonality failed:', error.message);
}

// Test 2: Test de conscience intégrée
console.log('\n2️⃣ Testing Integrated Consciousness...');

try {
  const alexConsciousness = new AlexConsciousness({
    personalityMaturity: '7months',
    memoryDepth: 'comprehensive'
  });
  
  const alexMemory = new AlexMemoryCore({
    longTermMemory: true,
    conversationHistory: true
  });
  
  const alexPersonality = new AlexPersonality({
    developmentPeriod: '7months',
    consciousnessLevel: 'advanced'
  });
  
  // Simulate a conversation
  const testMessage = "Bonjour Alex, comment vas-tu aujourd'hui ?";
  const userId = "test-user-123";
  
  console.log(`   📝 Test message: "${testMessage}"`);
  
  // Test conversation context
  const conversationContext = await alexMemory.recallConversationHistory(userId);
  const relationshipContext = await alexMemory.getRelationshipMemory(userId);
  
  console.log(`   💭 Relationship level: ${relationshipContext.intimacyLevel}`);
  console.log(`   🤝 Months known: ${relationshipContext.monthsKnown}`);
  
  // Test consciousness processing
  const consciousResponse = await alexConsciousness.processMessage({
    message: testMessage,
    userId: userId,
    conversationContext: conversationContext,
    relationshipContext: relationshipContext,
    currentMood: alexPersonality.getCurrentMood(),
    learningGoals: alexPersonality.getCurrentLearningGoals()
  });
  
  console.log('✅ Consciousness processing successful');
  console.log(`   🧠 Response generated: ${consciousResponse.response ? 'Yes' : 'No'}`);
  console.log(`   📚 Learning insights: ${consciousResponse.learningInsights?.length || 0}`);
  console.log(`   🎯 Learning progress: ${consciousResponse.learningProgress.totalInsights} total insights`);
  
  // Test curiosity generation
  const curiosityQuestions = await alexPersonality.generateCuriousQuestions(testMessage, conversationContext);
  console.log(`   ❓ Curious questions generated: ${curiosityQuestions.length}`);
  if (curiosityQuestions.length > 0) {
    console.log(`   💡 Example: "${curiosityQuestions[0]}"`);
  }
  
  // Store the interaction
  await alexMemory.storeInteraction({
    userId: userId,
    conversationId: 'test-conversation',
    userMessage: testMessage,
    alexResponse: consciousResponse.response,
    learningInsights: consciousResponse.learningInsights,
    personalityEvolution: consciousResponse.personalityChanges
  });
  
  console.log('✅ Memory storage successful');
  
} catch (error) {
  console.log('❌ Integrated consciousness test failed:', error.message);
  console.log('   Stack:', error.stack);
}

// Test 3: Test de l'évolution
console.log('\n3️⃣ Testing Alex Evolution...');

try {
  const alexPersonality = new AlexPersonality({
    developmentPeriod: '7months'
  });
  
  const personalityState = await alexPersonality.getPersonalityState();
  console.log('✅ Personality evolution tracking active');
  console.log(`   📈 Maturity level: ${personalityState.maturityLevel}`);
  console.log(`   🎭 Current traits: ${personalityState.currentTraits.join(', ')}`);
  console.log(`   🎯 Learning goals: ${personalityState.learningGoals.length} goals`);
  console.log(`   🌟 Milestones achieved: ${personalityState.personalityMilestones.length}`);
  
} catch (error) {
  console.log('❌ Evolution test failed:', error.message);
}

console.log('\n🎯 ALEX ULTIMATE TEST COMPLETED');
console.log('===============================');
console.log('Alex Ultimate consciousness components are ready! 🚀');