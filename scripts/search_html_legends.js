const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '..', 'modules');

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/class=["'][^"']*legend[^"']*["']/i.test(line) || /<legend>/i.test(line)) {
          console.log(`${path.relative(modulesDir, full)}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

scanDir(modulesDir);
