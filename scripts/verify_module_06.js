/**
 * EcoIntuition Academy — Verification Script for Module 06
 */

const fs = require('fs');
const path = require('path');

const modDir = path.join(__dirname, '..', 'modules', 'module-06');
const interactionsFile = path.join(__dirname, '..', 'assets', 'js', 'module-06-interactions.js');
const indexFile = path.join(__dirname, '..', 'index.html');
const progressFile = path.join(__dirname, '..', 'assets', 'js', 'progress.js');

let errors = [];
let passes = [];

function check(desc, condition) {
  if (condition) {
    passes.push(desc);
  } else {
    errors.push(desc);
  }
}

console.log('=== VERIFYING MODULE 06 ===\n');

// 1. Check progress.js registry
const progressContent = fs.readFileSync(progressFile, 'utf-8');
check("progress.js registers 'module-06': 8", progressContent.includes("'module-06': 8"));

// 2. Check homepage card in index.html
const indexContent = fs.readFileSync(indexFile, 'utf-8');
check("index.html contains link to modules/module-06/index.html", indexContent.includes('href="modules/module-06/index.html"'));
check("index.html has Module 06 title", indexContent.includes('06 Omitted Variable Bias, Randomized Experiments &amp; Difference-in-Differences'));
check("index.html has progress bar hook for module-06", indexContent.includes('id="progress-fill-module-06"'));

// 3. Check Hub page
const hubPath = path.join(modDir, 'index.html');
check("Hub page exists (modules/module-06/index.html)", fs.existsSync(hubPath));
if (fs.existsSync(hubPath)) {
  const hubContent = fs.readFileSync(hubPath, 'utf-8');
  check("Hub has data-module='module-06'", hubContent.includes('data-module="module-06"'));
  check("Hub links to all 8 lessons", [1,2,3,4,5,6,7,8].every(i => hubContent.includes(`lesson-0${i}.html`)));
  check("Hub does NOT contain sidebar", !hubContent.includes('class="lesson-sidebar"'));
  check("Hub does NOT contain native select", !hubContent.includes('<select'));
}

// 4. Check all 8 lessons
const expectedSvgIds = [
  'cookieLabSvg',
  'precisionTradeoffSvg',
  'rctPrecisionSvg',
  'ddCalculatorSvg',
  'parallelTrendsSvg',
  'trendTestSvg',
  'dddDecompositionSvg',
  'dddWorkedLabSvg'
];

for (let i = 1; i <= 8; i++) {
  const lessonPath = path.join(modDir, `lesson-0${i}.html`);
  check(`Lesson 6.${i} exists`, fs.existsSync(lessonPath));
  if (fs.existsSync(lessonPath)) {
    const html = fs.readFileSync(lessonPath, 'utf-8');
    
    // Structure checks
    check(`L6.${i}: Has data-module='module-06'`, html.includes('data-module="module-06"'));
    check(`L6.${i}: Has data-lesson='0${i}'`, html.includes(`data-lesson="0${i}"`));
    check(`L6.${i}: Has top lesson nav`, html.includes('class="top-lesson-nav"'));
    check(`L6.${i}: Has learning objectives card`, html.includes('class="objectives-card"'));
    check(`L6.${i}: Has 5-box visual explanation grid`, html.includes('class="visual-explanation-grid"'));
    check(`L6.${i}: Has quick check card`, html.includes('class="quick-check-card"'));
    check(`L6.${i}: Has summary takeaways card`, html.includes('class="summary-takeaways-card"'));
    check(`L6.${i}: Has lesson pager`, html.includes('class="lesson-pager"'));
    check(`L6.${i}: Includes module-06-interactions.js`, html.includes('module-06-interactions.js'));

    // Banned items
    check(`L6.${i}: NO sidebar`, !html.includes('lesson-sidebar'));
    check(`L6.${i}: NO native select`, !html.includes('<select'));
    check(`L6.${i}: NO raw unrendered LaTeX like \\begin{equation}`, !html.includes('\\begin{equation}'));

    // SVG ID check
    const svgId = expectedSvgIds[i - 1];
    check(`L6.${i}: Contains SVG #${svgId}`, html.includes(`id="${svgId}"`));
  }
}

// 5. Check interactions file
const interactionsContent = fs.readFileSync(interactionsFile, 'utf-8');
expectedSvgIds.forEach(id => {
  check(`Interactions JS handles #${id}`, interactionsContent.includes(id));
});

// 6. Specific academic checks
const l1Html = fs.readFileSync(path.join(modDir, 'lesson-01.html'), 'utf-8');
check("L6.1 mentions (X_1'X_1)^{-1}X_1'X_2 \\beta_2", l1Html.includes('(X_1\'X_1)^{-1}X_1\'X_2') && l1Html.includes('Sanaz') && l1Html.includes('Mike'));

const l2Html = fs.readFileSync(path.join(modDir, 'lesson-02.html'), 'utf-8');
check("L6.2 includes Page 5 2x2 SE table logic", l2Html.includes('Effect on Standard Errors') || l2Html.includes('helps precision'));

const l3Html = fs.readFileSync(path.join(modDir, 'lesson-03.html'), 'utf-8');
check("L6.3 includes FAFSA numerical example (0.030 / 0.017 -> 0.027 / 0.015)", l3Html.includes('0.030') && l3Html.includes('0.017') && l3Html.includes('0.027') && l3Html.includes('0.015'));

const l4Html = fs.readFileSync(path.join(modDir, 'lesson-04.html'), 'utf-8');
check("L6.4 includes DD regression with beta_4 interaction", l4Html.includes('\\beta_4') && l4Html.includes('\\text{Time}_t'));

const l5Html = fs.readFileSync(path.join(modDir, 'lesson-05.html'), 'utf-8');
check("L6.5 defines Parallel Trends counterfactual", l5Html.includes('Parallel Trends') && l5Html.includes('Counterfactual'));

const l6Html = fs.readFileSync(path.join(modDir, 'lesson-06.html'), 'utf-8');
check("L6.6 includes group trend model & cigarette tax anticipation", l6Html.includes('\\beta_3 (D_i \\cdot \\text{Trend}_t)') && l6Html.includes('cigarette'));

const l7Html = fs.readFileSync(path.join(modDir, 'lesson-07.html'), 'utf-8');
check("L6.7 includes Medicaid triple difference example", l7Html.includes('Medicaid') && (l7Html.includes('DD_1') || l7Html.includes('\\text{DD}_{\\text{poor}}') || l7Html.includes('poor')));

const l8Html = fs.readFileSync(path.join(modDir, 'lesson-08.html'), 'utf-8');
check("L6.8 includes Philadelphia & Pittsburgh test score model with beta_7", l8Html.includes('Philadelphia') && l8Html.includes('Pittsburgh') && l8Html.includes('\\beta_7'));

console.log(`\nPASSED CHECKS: ${passes.length}`);
console.log(`FAILED CHECKS: ${errors.length}`);

if (errors.length > 0) {
  console.log('\nFAILED DETAILS:');
  errors.forEach(e => console.log('  ❌ ' + e));
  process.exit(1);
} else {
  console.log('\nALL CHECKS PASSED PERFECTLY! 🚀');
  process.exit(0);
}
