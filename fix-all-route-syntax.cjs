#!/usr/bin/env node

/**
 * Comprehensive script to fix syntax errors in all route files
 * Targeting common patterns: missing commas, malformed try-catch, etc.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const routesDir = path.join(__dirname, 'backend', 'routes');

const routeFiles = [
  'ai.js',
  'aiSystem.js', 
  'aiSystemSpecialized.js',
  'alex-test.js',
  'alex-ultimate.js',
  'assistant.js',
  'auth.js',
  'ideas.js',
  'monitoring.js',
  'projects.js',
  'roi.js'
];

function fixCommonSyntaxErrors(content) {
  console.log('  - Fixing missing commas in object literals...');
  
  // Fix object properties missing commas (most common pattern)
  // Pattern: property: value\n  property:
  content = content.replace(/^(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*:\s*[^,\n}]+)\n(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*\s*:)/gm, '$1$2,\n$3$4');
  
  // Fix object shorthand properties missing commas
  // Pattern: property\n  property:
  content = content.replace(/^(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\n(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*\s*:)/gm, '$1$2,\n$3$4');
  
  // Fix function arguments missing commas
  // Pattern: argument\n  argument
  content = content.replace(/(\([^)]*)\n(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\n(\s+)([a-zA-Z_$])/gm, '$1,\n$2$3,\n$4$5');
  
  // Fix array elements missing commas
  content = content.replace(/^(\s+)'([^']+)'\n(\s+)'([^']+)'/gm, "$1'$2',\n$3'$4'");
  
  // Fix malformed string literals
  content = content.replace(/const STR_[A-Z_]* = '\s*\n\s*';/g, '');
  
  // Fix broken property access across lines
  content = content.replace(/\?\s*\n\s*\./g, '?.');
  
  // Fix duplicate catch blocks
  content = content.replace(/}\s*catch\s*\([^)]*\)\s*{\s*\/\/[^}]*}\s*catch\s*\([^)]*\)\s*{[^}]*}\s*}/g, '} catch (error) {\n    // Logger fallback - ignore error\n  }\n}');
  
  // Fix broken object syntax in Joi validation
  content = content.replace(/^(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*:\s*Joi\.[^,\n}]+)\n(\s+)([a-zA-Z_$])/gm, '$1$2,\n$3$4');
  
  console.log('  - Fixed common syntax patterns');
  return content;
}

function fixSpecificPatterns(content, filename) {
  console.log(`  - Applying specific fixes for ${filename}...`);
  
  // Fix specific patterns based on error messages we saw
  if (filename === 'ai.js' || filename === 'aiSystemSpecialized.js') {
    // Remove malformed constants
    content = content.replace(/const STR_[A-Z_]* = '\s*\n\s*';\n?/g, '');
  }
  
  // Fix logger object properties
  content = content.replace(/logger\.info\([^,]+,\s*{\s*\n(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\n(\s+)([a-zA-Z_$])/gm, 
    (match, indent1, prop1, indent2, prop2) => {
      return match.replace(`${prop1}\n${indent2}${prop2}`, `${prop1},\n${indent2}${prop2}`);
    });
  
  // Fix res.json objects
  content = content.replace(/res\.json\(\s*{\s*\n(\s+)(success:\s*[^,\n}]+)\n(\s+)([a-zA-Z_$])/gm, 
    'res.json({\n$1$2,\n$3$4');
  
  return content;
}

async function testSyntax(filePath) {
  return new Promise((resolve) => {
    exec(`node -c "${filePath}"`, (error, stdout, stderr) => {
      resolve(!error);
    });
  });
}

async function fixFile(filename) {
  const filePath = path.join(routesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return false;
  }
  
  console.log(`\n🔧 Fixing ${filename}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply fixes
    content = fixCommonSyntaxErrors(content);
    content = fixSpecificPatterns(content, filename);
    
    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    
    // Test syntax
    const isValid = await testSyntax(filePath);
    
    if (isValid) {
      console.log(`✅ ${filename} - syntax fixed successfully`);
      return true;
    } else {
      console.log(`⚠️  ${filename} - still has syntax errors (may need manual fixes)`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting comprehensive route syntax fixes...\n');
  
  let fixedCount = 0;
  let totalCount = routeFiles.length;
  
  for (const filename of routeFiles) {
    const success = await fixFile(filename);
    if (success) fixedCount++;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Fixed: ${fixedCount}/${totalCount} files`);
  console.log(`⚠️  Still need manual fixes: ${totalCount - fixedCount} files`);
  
  if (fixedCount === totalCount) {
    console.log('\n🎉 All route files have valid syntax!');
  } else {
    console.log('\n🔧 Some files still need manual attention.');
  }
}

main().catch(console.error);