const scanner = require('sonarqube-scanner');

console.log('🔍 LAUNCHING REAL SONARQUBE ANALYSIS');
console.log('====================================');
console.log('Project: AlexAI - Advanced AI Assistant');
console.log('Analysis: Complete quality and security scan');

scanner({
  serverUrl: 'https://sonarcloud.io',
  options: {
    'sonar.projectKey': 'alex-ai-consciousness',
    'sonar.projectName': 'AlexAI - Advanced AI Assistant with Consciousness',
    'sonar.projectVersion': '1.0.0',
    'sonar.sources': 'backend,frontend',
    'sonar.exclusions': 'node_modules/**,backend/node_modules/**,frontend/node_modules/**,frontend/dist/**,backend/logs/**,**/*.log,**/*.md,**/*.json',
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.verbose': 'true',
    'sonar.analysis.mode': 'publish',
    // JavaScript/TypeScript settings
    'sonar.javascript.environments': 'browser,node',
    'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info'
  }
}, (result) => {
  console.log('✅ SonarQube analysis completed!');
  console.log('Result:', result);
  
  if (result.status === 'SUCCESS') {
    console.log('🎯 Analysis successful - Check SonarCloud for detailed results');
  } else {
    console.log('❌ Analysis failed:', result.error);
  }
  
  process.exit(0);
});