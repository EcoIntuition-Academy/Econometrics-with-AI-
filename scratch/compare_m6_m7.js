const fs = require('fs');

function getClasses(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /class="([^"]+)"/g;
  const classes = new Set();
  let m;
  while ((m = regex.exec(content)) !== null) {
    m[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
  }
  return classes;
}

const m6_files = fs.readdirSync('modules/module-06').filter(f => f.endsWith('.html'));
const m7_files = fs.readdirSync('modules/module-07').filter(f => f.endsWith('.html'));

const m6_classes = new Set();
m6_files.forEach(f => {
  getClasses('modules/module-06/' + f).forEach(c => m6_classes.add(c));
});

const m7_classes = new Set();
m7_files.forEach(f => {
  getClasses('modules/module-07/' + f).forEach(c => m7_classes.add(c));
});

console.log('--- Classes in Module 6 but NOT in Module 7 ---');
console.log(Array.from(m6_classes).filter(c => !m7_classes.has(c)).sort());

console.log('\n--- Classes in Module 7 but NOT in Module 6 ---');
console.log(Array.from(m7_classes).filter(c => !m6_classes.has(c)).sort());
