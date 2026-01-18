#!/usr/bin/env node
/**
 * ADD DOTENV TO ALL SEEDING SCRIPTS
 * Ensures they can run standalone without orchestrator
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const seedFiles = glob.sync('seed-*.mjs');

const dotenvImport = `import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

`;

for (const file of seedFiles) {
  const content = readFileSync(file, 'utf-8');

  // Skip if already has dotenv
  if (content.includes('import dotenv')) {
    console.log(`✅ ${file} - already has dotenv`);
    continue;
  }

  // Add dotenv after the first import
  const lines = content.split('\n');
  const firstImportIndex = lines.findIndex(line => line.startsWith('import '));

  if (firstImportIndex === -1) {
    console.log(`❌ ${file} - no imports found`);
    continue;
  }

  // Find end of import block
  let lastImportIndex = firstImportIndex;
  for (let i = firstImportIndex + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue; // skip blank lines
    if (lines[i].startsWith('import ')) {
      lastImportIndex = i;
    } else {
      break;
    }
  }

  // Insert dotenv block after imports
  lines.splice(lastImportIndex + 1, 0, '', dotenvImport);

  writeFileSync(file, lines.join('\n'));
  console.log(`✅ ${file} - added dotenv`);
}

console.log('\n✅ All seeding scripts updated!');
