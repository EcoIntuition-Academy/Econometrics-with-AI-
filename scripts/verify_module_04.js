/**
 * EcoIntuition Academy — Econometrics with AI
 * Automated Verification Script for Module 4
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const mod4Dir = path.join(repoRoot, 'modules', 'module-04');

console.log('--- Starting Module 4 Comprehensive Verification ---');
let errors = 0;
let passes = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    errors++;
  } else {
    console.log(`✅ PASS: ${message}`);
    passes++;
  }
}

// 1. Check Hub file
const hubFile = path.join(mod4Dir, 'index.html');
assert(fs.existsSync(hubFile), 'modules/module-04/index.html exists');
const hubHtml = fs.readFileSync(hubFile, 'utf8');
assert(hubHtml.includes('Large-Sample Theory, Asymptotic Inference &amp; Nonlinear Functions') || hubHtml.includes('Large-Sample Theory, Asymptotic Inference & Nonlinear Functions'), 'Hub contains official Module 4 title');
assert(hubHtml.includes('progress-text-module-04'), 'Hub contains progress text ID');
assert(hubHtml.includes('progress-fill-module-04'), 'Hub contains progress bar fill ID');

// Check 8 lessons exist
const expectedLessons = [
  { file: 'lesson-01.html', num: '4.1', title: 'Convergence in Probability & Consistency', svgId: 'convergenceSvg' },
  { file: 'lesson-02.html', num: '4.2', title: 'Consistency of OLS & Large-Sample Conditions', svgId: 'consistencySvg' },
  { file: 'lesson-03.html', num: '4.3', title: 'Asymptotic Normality of OLS', svgId: 'asyNormalitySvg' },
  { file: 'lesson-04.html', num: '4.4', title: 'Asymptotic Efficiency', svgId: 'efficiencySvg' },
  { file: 'lesson-05.html', num: '4.5', title: 'Confidence Intervals & Large-Sample Hypothesis Testing', svgId: 'hypothesisTestSvg' },
  { file: 'lesson-06.html', num: '4.6', title: 'The Delta Method', svgId: 'deltaMethodSvg' },
  { file: 'lesson-07.html', num: '4.7', title: 'Slutsky’s Theorem & Delta Method Applications', svgId: 'deltaWorkedSvg' },
  { file: 'lesson-08.html', num: '4.8', title: 'Wald Testing, Classical vs Asymptotic Inference & Robust SE', svgId: 'waldTestSvg' }
];

expectedLessons.forEach((l, idx) => {
  const filePath = path.join(mod4Dir, l.file);
  assert(fs.existsSync(filePath), `${l.file} exists`);
  if (!fs.existsSync(filePath)) return;

  const html = fs.readFileSync(filePath, 'utf8');

  // Hub link check
  assert(hubHtml.includes(l.file), `Hub links to ${l.file}`);

  // No sidebar
  assert(!html.includes('class="lesson-sidebar"'), `${l.file} does NOT contain legacy sidebar`);
  assert(html.includes('class="top-lesson-nav"'), `${l.file} contains sticky top navigator`);

  // Dropdown items
  expectedLessons.forEach(other => {
    assert(html.includes(other.file), `${l.file} navigator dropdown includes ${other.file}`);
  });

  // MathJax
  assert(html.includes('math-config.js'), `${l.file} includes centralized math-config.js`);
  assert(html.includes('tex-chtml.js'), `${l.file} includes MathJax 3 script`);

  // Visual SVG ID
  assert(html.includes(`id="${l.svgId}"`), `${l.file} contains SVG element with id="${l.svgId}"`);

  // Explanation Cards
  assert(html.includes('visual-card--seeing'), `${l.file} contains visual-card--seeing`);
  assert(html.includes('visual-card--notice'), `${l.file} contains visual-card--notice`);
  assert(html.includes('visual-card--matters'), `${l.file} contains visual-card--matters`);
  assert(html.includes('visual-card--interp'), `${l.file} contains visual-card--interp`);
  assert(html.includes('visual-try-this'), `${l.file} contains visual-try-this`);

  // Quick Check & Summary
  assert(html.includes('quick-check-card'), `${l.file} contains quick-check-card`);
  assert(html.includes('summary-takeaways-card'), `${l.file} contains summary-takeaways-card`);

  // Scripts
  assert(html.includes('progress.js'), `${l.file} includes progress.js`);
  assert(html.includes('main.js'), `${l.file} includes main.js`);
  assert(html.includes('module-04-interactions.js'), `${l.file} includes module-04-interactions.js`);
});

// Check interaction script contains all 8 SVGs
const intScriptPath = path.join(repoRoot, 'assets', 'js', 'module-04-interactions.js');
assert(fs.existsSync(intScriptPath), 'module-04-interactions.js exists');
const intScript = fs.readFileSync(intScriptPath, 'utf8');
expectedLessons.forEach(l => {
  assert(intScript.includes(l.svgId), `module-04-interactions.js handles #${l.svgId}`);
});

// Check specific academic content items from PDF source
const l1 = fs.readFileSync(path.join(mod4Dir, 'lesson-01.html'), 'utf8');
assert(l1.includes('Pr(|x_n - c| > \\varepsilon)') || l1.includes('|x_n - c| > \\varepsilon'), 'Lesson 4.1 has formal plim definition');
assert(l1.includes('Critical Notation Note'), 'Lesson 4.1 has critical epsilon notation note');

const l2 = fs.readFileSync(path.join(mod4Dir, 'lesson-02.html'), 'utf8');
assert(l2.includes('Grenander Regularity Conditions'), 'Lesson 4.2 has Grenander regularity card');
assert(l2.includes('derivation-journey'), 'Lesson 4.2 has connected derivation journey');

const l3 = fs.readFileSync(path.join(mod4Dir, 'lesson-03.html'), 'utf8');
assert(l3.includes('s^2 (X\'X)^{-1}') || l3.includes('s^2(X\'X)^{-1}'), 'Lesson 4.3 has estimated asymptotic variance formula');
assert(l3.includes('VARIANCE (Squared Units)'), 'Lesson 4.3 has variance vs standard error distinction');

const l4 = fs.readFileSync(path.join(mod4Dir, 'lesson-04.html'), 'utf8');
assert(l4.includes('CAN Estimator'), 'Lesson 4.4 defines CAN estimators');
assert(l4.includes('Greene (7th ed., p. 110)') || l4.includes('Greene'), 'Lesson 4.4 cites Greene on OLS vs MLE');

const l5 = fs.readFileSync(path.join(mod4Dir, 'lesson-05.html'), 'utf8');
assert(l5.includes('2.576'), 'Lesson 4.5 includes 99% CI critical value 2.576');
assert(l5.includes('1.96'), 'Lesson 4.5 includes 5% critical value 1.96');
assert(l5.includes('FAIL TO REJECT'), 'Lesson 4.5 enforces Fail to Reject H0');

const l6 = fs.readFileSync(path.join(mod4Dir, 'lesson-06.html'), 'utf8');
assert(l6.includes('Taylor Approximation') || l6.includes('Taylor'), 'Lesson 4.6 includes Taylor approximation');
assert(l6.includes('[g\'(\\theta)]^2'), 'Lesson 4.6 includes squared derivative scaling');

const l7 = fs.readFileSync(path.join(mod4Dir, 'lesson-07.html'), 'utf8');
assert(l7.includes('Sum Rule') && l7.includes('Product Rule') && l7.includes('Ratio Rule'), 'Lesson 4.7 separates Slutsky into Sum, Product, Ratio cards');
assert(l7.includes('[0.08') && l7.includes('7.92]'), 'Lesson 4.7 contains exact source CI [0.08, 7.92]');

const l8 = fs.readFileSync(path.join(mod4Dir, 'lesson-08.html'), 'utf8');
assert(l8.includes('Wald Test') && l8.includes('\\chi^2_1'), 'Lesson 4.8 contains Wald test statistic');
assert(l8.includes('15 Core Concepts'), 'Lesson 4.8 contains 15-card knowledge review map');

console.log('----------------------------------------------------');
console.log(`Verification Complete: ${passes} PASSES, ${errors} ERRORS`);
if (errors > 0) process.exit(1);
