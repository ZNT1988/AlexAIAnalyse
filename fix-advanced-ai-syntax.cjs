#!/usr/bin/env node

/**
 * Script to fix syntax errors in advanced-ai.js
 * Specifically targeting missing commas in object literals
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'routes', 'advanced-ai.js');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('Fixing syntax errors in advanced-ai.js...');
  
  // Fix object literal syntax - add missing commas
  // Pattern: property: value followed by newline and spaces/tabs then another property
  content = content.replace(/^(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*:\s*[^,\n]*)\n(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*:)/gm, '$1$2,\n$3$4');
  
  // Fix object shorthand properties followed by another property
  content = content.replace(/^(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\n(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*:)/gm, '$1$2,\n$3$4');
  
  // Fix array elements
  content = content.replace(/^(\s+)'([^']*)'?\n(\s+)'([^']*)/gm, "$1'$2',\n$3'$4");
  
  // Fix specific patterns in this file
  content = content.replace(/type\s*:\s*STR_CONSCIOUSNESS\s*\n\s*query:/g, 'type: STR_CONSCIOUSNESS,\n    query:');
  content = content.replace(/type\s*:\s*STR_ALEX\s*\n\s*query:/g, 'type: "alex",\n    query:');
  content = content.replace(/query:\s*([^\n]+)\n\s*context:/g, 'query: $1,\n    context:');
  content = content.replace(/context:\s*\{\s*\n([\s\S]*?)\s*\}\s*\n\s*userId/g, (match, contextContent) => {
    // Fix commas in context object
    const fixedContext = contextContent.replace(/^(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*:\s*[^,\n]*)\n(\s+)([a-zA-Z_$])/gm, '$1$2,\n$3$4');
    return `context: {\n${fixedContext}\n    },\n    userId`;
  });
  
  // Fix success: result.success followed by other properties
  content = content.replace(/success:\s*result\.success\s*\n(\s+)([a-zA-Z_$])/g, 'success: result.success,\n$1$2');
  
  // Write the fixed content
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✓ Fixed syntax errors in advanced-ai.js');
  
  // Test the syntax
  const { exec } = require('child_process');
  exec(`node -c "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Syntax errors still present:', stderr);
      process.exit(1);
    } else {
      console.log('✅ advanced-ai.js syntax is now valid!');
    }
  });
  
} catch (error) {
  console.error('Error fixing file:', error.message);
  process.exit(1);
}