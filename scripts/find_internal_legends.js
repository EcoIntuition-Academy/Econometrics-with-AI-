const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '..', 'assets', 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

for (const file of jsFiles) {
  const fullPath = path.join(jsDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  console.log(`\n=== Checking ${file} ===`);
  lines.forEach((line, idx) => {
    // Look for legend mentions or svg groups acting as in-plot legends
    if (/legend/i.test(line)) {
      console.log(`  Line ${idx + 1}: ${line.trim()}`);
    } else if (/<rect[^>]*rx=[^>]*fill=[\"']#(?:ffffff|fff)/i.test(line) || /<rect[^>]*rx=[^>]*fill=[\"']var\(--color-surface/i.test(line)) {
      console.log(`  [Potential in-plot box] Line ${idx + 1}: ${line.trim()}`);
    }
  });
}
