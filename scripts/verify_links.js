const fs = require('fs');
const path = require('path');

let errors = 0;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  
  // Find href and src attributes
  const regex = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const target = m[1];
    if (target.startsWith('http') || target.startsWith('//') || target.startsWith('#') || target.startsWith('mailto')) continue;
    const cleanTarget = target.split('#')[0].split('?')[0];
    if (!cleanTarget) continue;
    const resolved = path.resolve(dir, cleanTarget);
    if (!fs.existsSync(resolved)) {
      console.error(`BROKEN LINK in ${filePath} --> ${target} (resolved to ${resolved})`);
      errors++;
    }
  }
}

function scan(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name !== '.git' && ent.name !== 'node_modules') scan(full);
    } else if (ent.name.endsWith('.html')) {
      checkFile(full);
    }
  });
}

scan(path.resolve('.'));
if (errors === 0) {
  console.log('SUCCESS: All internal links and asset references resolved correctly!');
} else {
  console.error(`Found ${errors} broken link(s).`);
  process.exit(1);
}
