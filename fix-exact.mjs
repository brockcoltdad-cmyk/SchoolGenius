import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Run ESLint and capture output (ignore exit code)
let output;
try {
  output = execSync('npm run lint 2>&1', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
} catch (e) {
  output = e.stdout || e.output?.[1] || '';
}

// Parse the output to get file -> errors map
const lines = output.split('\n');
const fixes = new Map(); // Map<filepath, Array<{line, col, char}>>

let currentFile = null;

for (const line of lines) {
  // Match file path line (starts with ./)
  if (line.startsWith('./')) {
    currentFile = line.trim();
    if (!fixes.has(currentFile)) {
      fixes.set(currentFile, []);
    }
  }
  // Match error line with line:col
  else if (currentFile && line.includes('can be escaped')) {
    const match = line.match(/^\s*(\d+):(\d+)\s+Error:\s+`(['"]+)`/);
    if (match) {
      const [_, lineNum, colNum, char] = match;
      fixes.get(currentFile).push({
        line: parseInt(lineNum),
        col: parseInt(colNum),
        char: char
      });
    }
  }
}

console.log(`Found errors in ${fixes.size} files\n`);

let totalFixed = 0;

for (const [file, errors] of fixes) {
  if (errors.length === 0) continue;

  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  const fileLines = content.split('\n');

  // Sort errors by line desc, col desc to fix from end to start
  errors.sort((a, b) => b.line - a.line || b.col - a.col);

  let fixCount = 0;
  for (const err of errors) {
    const lineIdx = err.line - 1;
    if (lineIdx >= fileLines.length) continue;

    let line = fileLines[lineIdx];
    const colIdx = err.col - 1;

    if (colIdx >= line.length) continue;

    const charAtPos = line[colIdx];

    // Only fix if it's actually the quote we expect
    if (charAtPos === "'" && err.char.includes("'")) {
      line = line.slice(0, colIdx) + '&apos;' + line.slice(colIdx + 1);
      fileLines[lineIdx] = line;
      fixCount++;
    } else if (charAtPos === '"' && err.char.includes('"')) {
      line = line.slice(0, colIdx) + '&quot;' + line.slice(colIdx + 1);
      fileLines[lineIdx] = line;
      fixCount++;
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(filePath, fileLines.join('\n'));
    console.log(`Fixed: ${file} (${fixCount} quotes)`);
    totalFixed += fixCount;
  }
}

console.log(`\nTotal fixed: ${totalFixed}`);
