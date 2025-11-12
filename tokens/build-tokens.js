#!/usr/bin/env node

/**
 * Build Design Tokens
 *
 * Transforms design tokens from JSON source into multiple formats:
 * - CSS Variables (.css)
 * - JavaScript/TypeScript (.js, .d.ts)
 * - JSON (.json)
 *
 * Usage: npm run build:tokens
 */

const StyleDictionary = require('style-dictionary');
const fs = require('fs');
const path = require('path');

console.log('🎨 Building Ozean Licht Design Tokens...\n');

// Ensure build directories exist
const buildDirs = [
  'tokens/build',
  'tokens/build/css',
  'tokens/build/js',
  'tokens/build/json'
];

buildDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Style Dictionary v4 configuration
const sd = new StyleDictionary({
  source: ['tokens/design-tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'tokens/build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true
          }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'tokens/build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations'
        }
      ]
    },
    json: {
      transformGroup: 'js',
      buildPath: 'tokens/build/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat'
        }
      ]
    }
  }
});

// Build all platforms
console.log('📦 Building tokens for all platforms...\n');
sd.buildAllPlatforms();

console.log('\n✅ Design tokens built successfully!');
console.log('\nGenerated files:');
console.log('  - tokens/build/css/variables.css');
console.log('  - tokens/build/js/tokens.js');
console.log('  - tokens/build/js/tokens.d.ts');
console.log('  - tokens/build/json/tokens.json');
console.log('\n💡 Import tokens in your app:');
console.log('  CSS: @import "./tokens/build/css/variables.css";');
console.log('  JS:  import tokens from "./tokens/build/js/tokens.js";\n');
