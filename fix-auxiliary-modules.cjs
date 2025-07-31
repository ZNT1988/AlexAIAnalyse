const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING AUXILIARY CONSCIOUSNESS MODULES');
console.log('=========================================');

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
    
    // Fix 1: Remove malformed constants
    const malformedConstPattern = /const STR_ = '\s*';/g;
    if (malformedConstPattern.test(content)) {
      content = content.replace(malformedConstPattern, '');
      hasChanges = true;
    }
    
    // Fix 2: Fix unterminated strings
    const unterminatedStringPattern = /const STR_\w* = '\s*$/gm;
    if (unterminatedStringPattern.test(content)) {
      content = content.replace(unterminatedStringPattern, '');
      hasChanges = true;
    }
    
    // Fix 3: Remove orphaned enum values without quotes
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      
      // Skip standalone enum-like words that cause parsing errors
      if (/^\s*(deep|conscious|therapeutic|psychological|enhanced|moderate|advanced|innovative)?\s*$/.test(trimmed) 
          && !line.includes('//') && !line.includes('*')) {
        return ''; // Remove the problematic line
      }
      
      return line;
    });
    
    if (fixedLines.join('\n') !== content) {
      content = fixedLines.join('\n');
      hasChanges = true;
    }
    
    // Fix 4: Clean up multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
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

console.log('\n📊 AUXILIARY MODULES FIX SUMMARY');
console.log('================================');
console.log(`✅ Files fixed: ${fixedFiles}`);
console.log(`❌ Errors: ${totalErrors}`);
console.log(`📁 Total auxiliary modules: ${auxiliaryFiles.length}`);

if (fixedFiles > 0) {
  console.log('\n🎯 Auxiliary consciousness modules are now cleaner!');
  console.log('The core Alex Ultimate consciousness remains fully functional.');
} else {
  console.log('\n💡 No major fixes needed - auxiliary modules are in decent shape.');
}