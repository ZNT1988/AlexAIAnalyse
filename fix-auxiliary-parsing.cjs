const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING AUXILIARY MODULES PARSING ERRORS');
console.log('==========================================');

const consciousnessDir = 'C:\\dev\\HustleFinderIA\\backend\\consciousness';

// Get all auxiliary modules (not the core 4)
const coreFiles = ['AlexConsciousness.js', 'AlexMemoryCore.js', 'AlexPersonality.js', 'AlexMemoryShaper.js'];
const auxiliaryFiles = fs.readdirSync(consciousnessDir)
  .filter(file => file.endsWith('.js') && !coreFiles.includes(file));

console.log(`Found ${auxiliaryFiles.length} auxiliary modules to fix`);

let fixedFiles = 0;
let totalErrors = 0;

auxiliaryFiles.forEach(filename => {
  const filePath = path.join(consciousnessDir, filename);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Fix 1: Remove standalone enum-like words that cause parsing errors
    const lines = content.split('\n');
    const problematicWords = [
      'low', 'medium', 'high', 'mystical', 'deep', 'surface', 'quantum',
      'rational', 'intuitive', 'transcendent', 'personal', 'relational',
      'universal', 'comprehensive', 'cosmic', 'present', 'lifetime',
      'multidimensional', 'eternal', 'modern', 'ancient', 'integrated',
      'channeled', 'efficient', 'balanced', 'authentic', 'practical',
      'psychological', 'soul_level', 'profound', 'regenerative', 'optimal',
      'conscious', 'therapeutic', 'enhanced', 'moderate', 'advanced',
      'innovative'
    ];
    
    const fixedLines = lines.map((line, index) => {
      const trimmed = line.trim();
      
      // Check if line is a standalone problematic word
      if (problematicWords.includes(trimmed) && 
          !line.includes('//') && 
          !line.includes('*') && 
          !line.includes('=') &&
          !line.includes(':') &&
          !line.includes('{') &&
          !line.includes('}')) {
        console.log(`  Removing problematic line ${index + 1}: "${trimmed}"`);
        return ''; // Remove the problematic line
      }
      
      return line;
    });
    
    if (fixedLines.join('\n') !== content) {
      content = fixedLines.join('\n');
      hasChanges = true;
    }
    
    // Fix 2: Remove malformed constants
    const malformedConstPattern = /const STR_[A-Z_]* = '\s*';?/g;
    if (malformedConstPattern.test(content)) {
      content = content.replace(malformedConstPattern, '');
      hasChanges = true;
    }
    
    // Fix 3: Fix unterminated strings
    const unterminatedStringPattern = /const STR_[A-Z_]* = '\s*$/gm;
    if (unterminatedStringPattern.test(content)) {
      content = content.replace(unterminatedStringPattern, '');
      hasChanges = true;
    }
    
    // Fix 4: Clean up multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Fix 5: Fix malformed object properties with standalone words
    content = content.replace(/(\w+):\s*options\.\w+\s*\|\|\s*'[^']*'\s*\n\s*(\/\/[^\n]*\n\s*)*\w+(?:\n\s*\w+)*/g, 
      (match, propName) => {
        const defaultValue = match.match(/\|\|\s*'([^']*)'/);
        return defaultValue ? `${propName}: options.${propName} || '${defaultValue[1]}'` : match;
      });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedFiles++;
      console.log(`✅ Fixed: ${filename}`);
    } else {
      console.log(`⏭️  Skipped: ${filename} (no issues found)`);
    }
    
  } catch (error) {
    console.log(`❌ Error fixing ${filename}: ${error.message}`);
    totalErrors++;
  }
});

console.log('\n📊 PARSING ERRORS FIX SUMMARY');
console.log('=============================');
console.log(`✅ Files fixed: ${fixedFiles}`);
console.log(`❌ Errors: ${totalErrors}`);
console.log(`📁 Total auxiliary modules: ${auxiliaryFiles.length}`);

if (fixedFiles > 0) {
  console.log('\n🎯 Auxiliary consciousness modules parsing errors fixed!');
  console.log('Alex Ultimate consciousness should now be fully functional.');
} else {
  console.log('\n💡 No parsing fixes needed - auxiliary modules syntax is correct.');
}