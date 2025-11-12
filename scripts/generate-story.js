#!/usr/bin/env node

/**
 * Story Generator Script
 *
 * Generates a new Storybook story file from template.
 *
 * Usage:
 *   npm run generate-story ComponentName [path]
 *
 * Examples:
 *   npm run generate-story Button
 *   npm run generate-story Alert shared
 *   npm run generate-story DataTable admin
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
Story Generator

Usage:
  npm run generate-story <ComponentName> [location]

Arguments:
  ComponentName  Name of the component (PascalCase)
  location       Where to create the story (default: shared)
                 Options: shared, admin, ozean-licht

Examples:
  npm run generate-story Button
  npm run generate-story Alert shared
  npm run generate-story DataTable admin

The script will:
  1. Read the template from .storybook/templates/component.stories.tsx.template
  2. Replace placeholders with your component name
  3. Create a new story file in the appropriate location
  4. Display next steps
`);
  process.exit(0);
}

const componentName = args[0];
const location = args[1] || 'shared';

// Validate component name
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ Error: Component name must be in PascalCase (e.g., Button, DataTable)');
  process.exit(1);
}

// Convert PascalCase to kebab-case for filename
const componentFilename = componentName
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .toLowerCase();

// Determine paths based on location
let targetDir;
let storyPath;

switch (location.toLowerCase()) {
  case 'shared':
    targetDir = path.join(__dirname, '../shared/ui-components/src/components');
    storyPath = 'Shared UI';
    break;
  case 'admin':
    targetDir = path.join(__dirname, '../apps/admin/components/ui');
    storyPath = 'Admin';
    break;
  case 'ozean-licht':
  case 'ol':
    targetDir = path.join(__dirname, '../apps/ozean-licht/components');
    storyPath = 'Ozean Licht';
    break;
  default:
    console.error(`❌ Error: Unknown location "${location}". Use: shared, admin, or ozean-licht`);
    process.exit(1);
}

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  console.error(`❌ Error: Directory not found: ${targetDir}`);
  console.error('   Please create the directory first or check the location.');
  process.exit(1);
}

// Read template
const templatePath = path.join(__dirname, '../.storybook/templates/component.stories.tsx.template');

if (!fs.existsSync(templatePath)) {
  console.error(`❌ Error: Template not found: ${templatePath}`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
const storyContent = template
  .replace(/\{\{COMPONENT_NAME\}\}/g, componentName)
  .replace(/\{\{COMPONENT_FILENAME\}\}/g, componentFilename)
  .replace(/\{\{STORY_PATH\}\}/g, storyPath);

// Determine output filename
const outputPath = path.join(targetDir, `${componentName}.stories.tsx`);

// Check if file already exists
if (fs.existsSync(outputPath)) {
  console.error(`❌ Error: Story file already exists: ${outputPath}`);
  console.error('   Delete the existing file or choose a different name.');
  process.exit(1);
}

// Write story file
try {
  fs.writeFileSync(outputPath, storyContent, 'utf8');
  console.log('✅ Story file created successfully!');
  console.log('');
  console.log('📄 File:', outputPath);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Edit the story file to add your component props');
  console.log('  2. Update the component import path if needed');
  console.log('  3. Add real variants and examples');
  console.log('  4. Start Storybook to view your story:');
  console.log('     npm run storybook');
  console.log('');
  console.log('📚 Documentation:');
  console.log('  - Contributing: STORYBOOK_CONTRIBUTING.md');
  console.log('  - Review Checklist: .storybook/REVIEW_CHECKLIST.md');
  console.log('  - Examples: Look at existing stories in', targetDir);
  console.log('');
} catch (error) {
  console.error('❌ Error writing file:', error.message);
  process.exit(1);
}
