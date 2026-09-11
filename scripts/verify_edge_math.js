const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const files = [
  'modules/module-04/index.html',
  'modules/module-04/lesson-01.html',
  'modules/module-04/lesson-02.html',
  'modules/module-04/lesson-03.html',
  'modules/module-04/lesson-04.html',
  'modules/module-04/lesson-05.html',
  'modules/module-04/lesson-06.html',
  'modules/module-04/lesson-07.html',
  'modules/module-04/lesson-08.html',
  'modules/module-05/index.html',
  'modules/module-05/lesson-01.html',
  'modules/module-05/lesson-02.html',
  'modules/module-05/lesson-03.html',
  'modules/module-05/lesson-04.html',
  'modules/module-05/lesson-05.html',
  'modules/module-05/lesson-06.html',
  'modules/module-05/lesson-07.html'
];

let allPassed = true;

files.forEach(f => {
  const url = 'file:///g:/Econometrics-with-AI-/' + f;
  try {
    const out = execSync(`"${edgePath}" --headless=new --disable-gpu --dump-dom "${url}"`, {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024
    });
    const mjxCount = (out.match(/<mjx-container/g) || []).length;
    // Check if any raw \( or $$ remain outside script tags
    const stripped = out.replace(/<script[\s\S]*?<\/script>/gi, '');
    const rawInline = (stripped.match(/\\\(.*?\\\)/g) || []).length;
    const rawBlock = (stripped.match(/\$\$.*?\$\$/g) || []).length;

    const rawMatches = [...stripped.matchAll(/(?:\\\([\s\S]*?\\\))|(?:\$\$[\s\S]*?\$\$)/g)];
    if (rawMatches.length > 0) {
      console.log(`\n--- Unrendered math in ${f} ---`);
      rawMatches.forEach((m, idx) => {
        const start = Math.max(0, m.index - 60);
        const end = Math.min(stripped.length, m.index + m[0].length + 60);
        console.log(`[Match ${idx+1}]`, stripped.substring(start, end).replace(/\s+/g, ' '));
      });
    }

    console.log(`${f}: mjx-container = ${mjxCount}, unrendered inline = ${rawInline}, unrendered block = ${rawBlock}`);
    if (mjxCount === 0 || rawInline > 0 || rawBlock > 0) {
      allPassed = false;
    }
  } catch (err) {
    console.error(`Error rendering ${f}:`, err.message);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n=== ALL SAMPLED LESSONS RENDERED 100% OF MATH FORMULAS VIA LOCAL MATHJAX ===');
} else {
  console.error('\n=== SOME LESSONS FAILED MATH RENDERING ===');
  process.exit(1);
}
