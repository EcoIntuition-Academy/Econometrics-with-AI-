const fs = require('fs');
const path = require('path');

const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { CHTML } = require('mathjax-full/js/output/chtml.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({
  packages: AllPackages,
  inlineMath: [['\\(', '\\)'], ['$', '$']],
  displayMath: [['\\[', '\\]'], ['$$', '$$']],
  processEscapes: true,
  processEnvironments: true
});

const chtml = new CHTML({ fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2' });
const doc = mathjax.document('', { InputJax: tex, OutputJax: chtml });

const dir = path.join(__dirname, '..', 'modules', 'module-17');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let totalErrors = 0;
let totalChecked = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n--- Testing module-17/${file} ---`);

  const snippets = [];
  let m;
  const inlineReg = /\\\(([\s\S]*?)\\\)/g;
  while ((m = inlineReg.exec(content)) !== null) {
    snippets.push({ type: 'inline', raw: m[0], tex: m[1] });
  }
  const displayReg = /\\\[([\s\S]*?)\\\]/g;
  while ((m = displayReg.exec(content)) !== null) {
    snippets.push({ type: 'display', raw: m[0], tex: m[1] });
  }

  let fileErrors = 0;
  snippets.forEach(s => {
    try {
      const node = doc.convert(s.tex, { display: s.type === 'display' });
      const str = adaptor.outerHTML(node);
      if (str.includes('data-mjx-error') || str.includes('merror')) {
        console.error(`  [MATHJAX ERROR] in snippet: ${s.raw.slice(0, 80)}...`);
        fileErrors++;
        totalErrors++;
      }
    } catch (e) {
      console.error(`  [EXCEPTION] in snippet: ${s.raw.slice(0, 80)}... Error: ${e.message}`);
      fileErrors++;
      totalErrors++;
    }
    totalChecked++;
  });

  console.log(`  Checked ${snippets.length} snippets. Errors: ${fileErrors}`);
});

console.log(`\n=== RESULT: ${totalChecked} math snippets checked in Module 17, ${totalErrors} errors found ===`);
if (totalErrors > 0) process.exit(1);
