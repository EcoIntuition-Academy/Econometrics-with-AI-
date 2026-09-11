const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '..', 'assets', 'js');
const files = [
  'interactions.js',
  'module-02-interactions.js',
  'module-03-interactions.js',
  'module-04-interactions.js',
  'module-05-interactions.js',
  'module-06-interactions.js'
];

for (const file of files) {
  const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
  console.log(`\n========================================\nFILE: ${file}\n========================================`);

  // Match all functions or blocks where SVG is constructed
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Check for legend or potential in-plot overlays
    if (line.includes('legend') || line.includes('Legend')) {
      console.log(`Line ${i+1}: ${line.trim()}`);
    }
    if (line.includes('translate(') && (lines[i+1]?.includes('<rect') || lines[i+2]?.includes('<rect'))) {
      console.log(`Line ${i+1} [Group with rect]: ${line.trim()}`);
    }
  });
}
