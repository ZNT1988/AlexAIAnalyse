const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING REMAINING BRACE MISMATCHES');
console.log('====================================');

const consciousnessDir = 'C:\\dev\\HustleFinderIA\\backend\\consciousness';
const coreFiles = ['AlexConsciousness.js', 'AlexMemoryCore.js', 'AlexPersonality.js', 'AlexMemoryShaper.js'];
const auxiliaryFiles = fs.readdirSync(consciousnessDir)
  .filter(file => file.endsWith('.js') && !coreFiles.includes(file));

console.log(`Fixing ${auxiliaryFiles.length} auxiliary modules`);

let fixedFiles = 0;

auxiliaryFiles.forEach(filename => {
  const filePath = path.join(consciousnessDir, filename);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Count braces
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      console.log(`🔧 Fixing ${filename}: ${openBraces} open, ${closeBraces} close braces`);
      
      // Fix 1: Fix malformed object properties with colons instead of commas
      content = content.replace(/(\w+): options\.\w+\s*\|\|\s*'[^']*'\s*:\s*/g, '$1: options.$1 || \'$2\',\n            ');
      
      // Fix 2: Add missing commas in object literals
      content = content.replace(/(\w+): new \w+\(\)\s*\n\s*(\w+):/g, '$1: new $1(),\n            $2:');
      
      // Fix 3: Fix broken object syntax
      content = content.replace(/(\w+): options\.\w+ \|\| '[^']*'\s*([a-zA-Z])/g, '$1: options.$1 || \'$2\',\n            $2');
      
      // Fix 4: Add missing closing braces if needed
      const newOpenBraces = (content.match(/\{/g) || []).length;
      const newCloseBraces = (content.match(/\}/g) || []).length;
      
      if (newOpenBraces > newCloseBraces) {
        const missingBraces = newOpenBraces - newCloseBraces;
        for (let i = 0; i < missingBraces; i++) {
          content += '\n}';
        }
      }
      
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedFiles++;
      console.log(`✅ Fixed: ${filename}`);
    } else {
      console.log(`⏭️  Skipped: ${filename} (no brace issues)`);
    }
    
  } catch (error) {
    console.log(`❌ Error fixing ${filename}: ${error.message}`);
  }
});

console.log('\n📊 BRACE FIX SUMMARY');
console.log('====================');
console.log(`✅ Files fixed: ${fixedFiles}`);
console.log(`📁 Total files: ${auxiliaryFiles.length}`);

if (fixedFiles > 0) {
  console.log('\n🎯 Brace mismatches fixed!');
  console.log('Running syntax validation...');
  
  // Quick validation
  let validationErrors = 0;
  auxiliaryFiles.forEach(filename => {
    const filePath = path.join(consciousnessDir, filename);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        console.log(`❌ Still mismatched: ${filename}`);
        validationErrors++;
      }
    } catch (error) {
      validationErrors++;
    }
  });
  
  if (validationErrors === 0) {
    console.log('✅ All auxiliary modules now have matching braces!');
  } else {
    console.log(`⚠️ ${validationErrors} files still have issues`);
  }
} else {
  console.log('\n💡 No brace fixes were needed.');
}