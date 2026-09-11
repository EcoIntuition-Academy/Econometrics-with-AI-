const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '..', 'modules');
const lessons = [];

for (let m = 1; m <= 6; m++) {
  const mFolder = path.join(modulesDir, 'module-' + String(m).padStart(2, '0'));
  if (!fs.existsSync(mFolder)) continue;
  const files = fs.readdirSync(mFolder).filter(f => f.startsWith('lesson-') && f.endsWith('.html'));
  for (const f of files) {
    const fullPath = path.join(mFolder, f);
    const html = fs.readFileSync(fullPath, 'utf8');
    const svgs = [];
    const svgMatches = html.matchAll(/<svg[^>]*id=["']([^"']+)["'][^>]*>/g);
    for (const match of svgMatches) {
      if (!match[1].includes('icon') && !match[1].includes('theme') && !match[1].includes('chevron')) {
        svgs.push(match[1]);
      }
    }
    const canvasMatches = html.matchAll(/<canvas[^>]*id=["']([^"']+)["'][^>]*>/g);
    for (const match of canvasMatches) {
      svgs.push('canvas:' + match[1]);
    }
    if (svgs.length > 0) {
      lessons.push({ module: m, file: f, ids: svgs });
    }
  }
}
console.log('Total lessons with visualizations:', lessons.length);
lessons.forEach(l => {
  console.log(`Module ${l.module} - ${l.file}: ${l.ids.join(', ')}`);
});
