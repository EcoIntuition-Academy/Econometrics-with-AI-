const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '..', 'assets', 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

for (const file of jsFiles) {
  const fullPath = path.join(jsDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    if (line.includes('<rect')) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}
