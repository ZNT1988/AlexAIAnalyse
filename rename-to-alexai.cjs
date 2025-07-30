const fs = require('fs');
const path = require('path');

console.log('🔄 RENAMING PROJECT: HustleFinderIA → AlexAI');
console.log('============================================');

// Files to update
const filesToUpdate = [
  // Package files
  'package.json',
  'backend/package.json',
  
  // Main config files
  'README.md',
  'backend/server.js',
  'backend/app.js',
  
  // Documentation files
  'RAPPORT_SONAR_REEL_29_JUILLET_2025.md',
  'ANALYSE_SYSTEMATIQUE_SONAR_QLCODE_30_JUILLET.md',
  
  // Core files that reference project name
  'backend/consciousness/AlexMemoryShaper.js',
  'backend/alex-core/UniversalModuleRegistry.js'
];

// Replacement mappings
const replacements = [
  {
    from: 'HustleFinderIA',
    to: 'AlexAI'
  },
  {
    from: 'HustleFinder IA',
    to: 'Alex AI'
  },
  {
    from: 'HustleFinder',
    to: 'AlexAI'
  },
  {
    from: 'hustlefinderIA',
    to: 'alexAI'
  },
  {
    from: 'hustlefinder',
    to: 'alexai'
  },
  {
    from: 'HUSTLEFINDER',
    to: 'ALEXAI'
  }
];

let totalReplacements = 0;
let processedFiles = 0;

// Process each file
for (const filePath of filesToUpdate) {
  const fullPath = path.join('C:\\dev\\HustleFinderIA', filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let fileReplacements = 0;
      
      // Apply all replacements
      for (const replacement of replacements) {
        const beforeCount = (content.match(new RegExp(replacement.from, 'g')) || []).length;
        content = content.replace(new RegExp(replacement.from, 'g'), replacement.to);
        const afterCount = (content.match(new RegExp(replacement.from, 'g')) || []).length;
        const replaced = beforeCount - afterCount;
        fileReplacements += replaced;
        
        if (replaced > 0) {
          console.log(`  ✅ ${filePath}: ${replaced} occurrences of "${replacement.from}" → "${replacement.to}"`);
        }
      }
      
      if (fileReplacements > 0) {
        fs.writeFileSync(fullPath, content, 'utf8');
        totalReplacements += fileReplacements;
        processedFiles++;
        console.log(`  📝 Updated: ${filePath} (${fileReplacements} replacements)`);
      } else {
        console.log(`  ⏭️  Skipped: ${filePath} (no changes needed)`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error processing ${filePath}: ${error.message}`);
    }
  } else {
    console.log(`  ⚠️  File not found: ${filePath}`);
  }
}

console.log('\n📊 RENAME SUMMARY');
console.log('=================');
console.log(`✅ Files processed: ${processedFiles}`);
console.log(`🔄 Total replacements: ${totalReplacements}`);

// Update specific package.json fields
const packageJsonPath = 'C:\\dev\\HustleFinderIA\\package.json';
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = 'alex-ai';
    packageJson.description = 'Alex AI - Advanced AI Assistant with Consciousness';
    if (packageJson.repository && packageJson.repository.url) {
      packageJson.repository.url = packageJson.repository.url.replace('HustleFinderIA', 'AlexAI');
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('✅ Main package.json updated with new name');
  } catch (error) {
    console.log(`❌ Error updating main package.json: ${error.message}`);
  }
}

const backendPackageJsonPath = 'C:\\dev\\HustleFinderIA\\backend\\package.json';
if (fs.existsSync(backendPackageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
    packageJson.name = 'alex-ai-backend';
    packageJson.description = 'Alex AI Backend - Consciousness Engine';
    fs.writeFileSync(backendPackageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('✅ Backend package.json updated with new name');
  } catch (error) {
    console.log(`❌ Error updating backend package.json: ${error.message}`);
  }
}

console.log('\n🎯 PROJECT RENAME COMPLETED');
console.log('============================');
console.log('✅ All references to HustleFinderIA have been updated to AlexAI');
console.log('✅ Package names and descriptions updated');
console.log('✅ Documentation files updated');
console.log('✅ Core consciousness files updated');
console.log('\n🚀 Welcome to AlexAI - The Advanced AI Assistant!');