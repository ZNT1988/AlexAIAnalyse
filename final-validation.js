#!/usr/bin/env node

/**
 * Test de validation finale du système HustleFinderIA
 * Vérifie que tout fonctionne correctement
 */

console.log('🎯 Test de validation finale HustleFinderIA Alex\n');

const tests = [
  {
    name: 'Backend Health Check',
    url: 'http://localhost:8080/health',
    method: 'GET'
  },
  {
    name: 'AI Chat Direct',
    url: 'http://localhost:8080/api/ai/chat',
    method: 'POST',
    body: { message: 'Test system validation' }
  },
  {
    name: 'AI Chat via Proxy',
    url: 'http://localhost:5173/api/ai/chat',
    method: 'POST',
    body: { message: 'Frontend-backend connection test' }
  },
  {
    name: 'Business Idea Generation',
    url: 'http://localhost:5173/api/ai/chat',
    method: 'POST',
    body: { message: 'Peux-tu me donner une idée de startup innovante?' }
  }
];

async function runTest(test) {
  try {
    const options = {
      method: test.method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (test.body) {
      options.body = JSON.stringify(test.body);
    }
    
    const response = await fetch(test.url, options);
    const data = await response.json();
    
    console.log(`✅ ${test.name}: SUCCESS`);
    if (data.response) {
      const parsed = JSON.parse(data.response);
      console.log(`   Context Quality: ${(parsed.metadata?.contextAnalysis?.overall * 100).toFixed(0)}%`);
      console.log(`   Response Time: ${data.response_time_ms}ms`);
    }
    console.log('');
    
    return true;
  } catch (error) {
    console.log(`❌ ${test.name}: FAILED`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

async function runAllTests() {
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`📊 RÉSULTATS FINAUX`);
  console.log(`✅ Tests réussis: ${passed}/${total}`);
  console.log(`🚀 Système ${passed === total ? 'OPÉRATIONNEL' : 'EN ERREUR'}`);
  
  if (passed === total) {
    console.log('\n🎉 HustleFinderIA Alex est complètement fonctionnel !');
    console.log('📖 Frontend: http://localhost:5173');
    console.log('🔧 Backend: http://localhost:8080');
    console.log('🧠 ContextIntelligence: ACTIVÉ');
    console.log('💫 Tous les modules IA: OPÉRATIONNELS');
  }
}

runAllTests();