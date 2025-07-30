const { execSync } = require('child_process');
const path = require('path');

function getESLintCount(dir) {
  try {
    const result = execSync(`npx eslint .`, { 
      cwd: dir, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // If no errors, return 0 problems
    return "✅ 0 problems found";
  } catch (error) {
    const output = error.stdout || error.stderr || '';
    
    // Extract problem count from output
    const problemMatch = output.match(/(\d+,?\d*)\s+problems?/);
    if (problemMatch) {
      return `❌ ${problemMatch[1].replace(',', '')} problems found`;
    }
    
    // Count individual lines with errors/warnings
    const lines = output.split('\n').filter(line => 
      line.includes('error') || line.includes('warning')
    ).length;
    
    return lines > 0 ? `❌ ~${lines} problems found` : "❓ Unable to parse count";
  }
}

console.log('=== ESLINT STATUS POST-EMERGENCY FIX ===');
console.log(`Backend: ${getESLintCount('C:\\dev\\HustleFinderIA\\backend')}`);
console.log(`Frontend: ${getESLintCount('C:\\dev\\HustleFinderIA\\frontend')}`);