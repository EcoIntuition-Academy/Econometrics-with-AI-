const fs = require('fs');
const path = require('path');

// Initialize MathJax using mathjax-full
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
const html = mathjax.document('', { InputJax: tex, OutputJax: chtml });

const rootDir = path.resolve(__dirname, '..');
const targetDirs = [
  path.join(rootDir, 'modules', 'module-04'),
  path.join(rootDir, 'modules', 'module-05'),
  path.join(rootDir, 'modules', 'module-06'),
  path.join(rootDir, 'modules', 'module-07'),
  path.join(rootDir, 'modules', 'module-08'),
  path.join(rootDir, 'modules', 'module-09'),
  path.join(rootDir, 'modules', 'module-10'),
  path.join(rootDir, 'modules', 'module-11')
];

let totalErrors = 0;
let totalChecked = 0;

targetDirs.forEach(dir => {
  const modName = path.basename(dir);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const rel = `${modName}/${file}`;

    console.log(`\n--- Testing ${rel} ---`);

    // Extract all math snippets
    const snippets = [];

    // Match \( ... \)
    let m;
    const inlineReg = /\\\(([\s\S]*?)\\\)/g;
    while ((m = inlineReg.exec(content)) !== null) {
      snippets.push({ type: 'inline', raw: m[0], tex: m[1], index: m.index });
    }

    // Match \[ ... \]
    const disp1Reg = /\\\[([\s\S]*?)\\\]/g;
    while ((m = disp1Reg.exec(content)) !== null) {
      snippets.push({ type: 'display', raw: m[0], tex: m[1], index: m.index });
    }

    // Match $$ ... $$
    const disp2Reg = /\$\$([\s\S]*?)\$\$/g;
    while ((m = disp2Reg.exec(content)) !== null) {
      snippets.push({ type: 'display', raw: m[0], tex: m[1], index: m.index });
    }

    snippets.forEach(snip => {
      totalChecked++;
      try {
        const mathDoc = mathjax.document('', { InputJax: tex, OutputJax: chtml });
        const node = mathDoc.convert(snip.tex, { display: snip.type === 'display' });
        const serialized = adaptor.outerHTML(node);

        // Check if MathJax produced an error node: <mjx-merror> or data-mjx-error
        if (serialized.includes('data-mjx-error') || serialized.includes('mjx-merror')) {
          const errMatch = serialized.match(/title="([^"]*)"/) || serialized.match(/data-mjx-error="([^"]*)"/);
          const errMsg = errMatch ? errMatch[1] : 'MathJax error node generated';
          console.error(`[MATHJAX ERROR in ${rel}] ${errMsg}`);
          console.error(`  TeX: ${snip.raw.slice(0, 100)}`);
          totalErrors++;
        }
      } catch (err) {
        console.error(`[EXCEPTION in ${rel}] ${err.message}`);
        console.error(`  TeX: ${snip.raw}`);
        totalErrors++;
      }
    });

    console.log(`  Checked ${snippets.length} math snippets.`);
  });
});

console.log(`\n=== RESULT: ${totalChecked} math snippets checked, ${totalErrors} errors found ===`);
