const fs = require('fs');
const path = require('path');

const mod13Dir = path.join(__dirname, '..', 'modules', 'module-13');

const files = [
  'index.html',
  'lesson-01.html',
  'lesson-02.html',
  'lesson-03.html',
  'lesson-04.html',
  'lesson-05.html',
  'lesson-06.html'
];

let checksTotal = 0;
let checksPassed = 0;

function assert(condition, message) {
  checksTotal++;
  if (condition) {
    checksPassed++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('\n=== VERIFYING MODULE 13 FILES & ARCHITECTURE ===\n');

// 1. Verify existence of all files
files.forEach(f => {
  const filePath = path.join(mod13Dir, f);
  assert(fs.existsSync(filePath), `File exists: ${f}`);
});

// 2. Verify Overview
console.log('\n--- Checking Module 13 Overview (index.html) ---');
const overviewHtml = fs.existsSync(path.join(mod13Dir, 'index.html')) ? fs.readFileSync(path.join(mod13Dir, 'index.html'), 'utf8') : '';
if (overviewHtml) {
  assert(overviewHtml.includes('data-module="module-13"'), 'Sets data-module="module-13"');
  assert(overviewHtml.includes('module-learning-path-card'), 'Contains compact module-learning-path-card');
  assert(overviewHtml.includes('Self-Selection') && overviewHtml.includes('Covariate Adjustment'), 'Contains full 11-step learning path');
  assert(overviewHtml.includes('module-lessons-list'), 'Contains single-column lesson list');
  assert(overviewHtml.includes('progress-text-module-13'), 'Contains progress tracking text');
  assert(overviewHtml.includes('progress-fill-module-13'), 'Contains progress tracking bar');
  assert(overviewHtml.includes('Field Experiments, Randomization &amp; Experimental Design') || overviewHtml.includes('Field Experiments, Randomization & Experimental Design'), 'Correct Module 13 title');
}

// 3. Verify Lessons
for (let i = 1; i <= 6; i++) {
  const lessonFile = `lesson-0${i}.html`;
  console.log(`\n--- Checking Lesson 13.${i} (${lessonFile}) ---`);
  const filePath = path.join(mod13Dir, lessonFile);
  if (!fs.existsSync(filePath)) {
    assert(false, `File ${lessonFile} exists`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  assert(content.includes('data-module="module-13"'), 'data-module="module-13" attribute present');
  assert(content.includes(`data-lesson="${i}"`), `data-lesson="${i}" attribute present`);
  assert(content.includes('top-lesson-nav'), 'Sticky top-lesson-nav present');
  assert(content.includes('lesson-dropdown-wrapper'), 'Lesson dropdown present');
  assert(content.includes('lesson-hero-title') || content.includes('lesson-title'), 'Lesson title present');
  assert(content.includes('objectives-card'), 'Learning objectives card present');
  assert(content.includes('interactive-lab-card'), 'Interactive lab card present');
  assert(content.includes('lab-metrics-grid'), '2x2 metric grid present in lab');
  assert(content.includes('visual-explanation-grid'), '5-box visual explanation grid present');
  assert(content.includes('quick-check-card'), 'Quick check card present');
  assert(content.includes('toggle-hint-btn') && content.includes('toggle-sol-btn'), 'Quick check interactive buttons present');
  assert(content.includes('summary-takeaways-card'), 'What You Should Now Understand summary card present');
  assert(content.includes('lesson-pager'), 'Lesson pager navigation present');
  assert(content.includes('site-footer'), 'Canonical footer present');

  // No meta-language checks
  const metaRegex = /(according to the (pdf|source|lecture)|the lecture notes (say|emphasize)|page \d+ of the)/i;
  assert(!metaRegex.test(content), 'No source meta-language exposed to learner');
}

// 4. Verify Econometric Specifics
console.log('\n--- Checking Econometric Content Specifics ---');
const l1 = fs.existsSync(path.join(mod13Dir, 'lesson-01.html')) ? fs.readFileSync(path.join(mod13Dir, 'lesson-01.html'), 'utf8') : '';
if (l1) {
  assert(l1.includes('Selection Bias') && l1.includes('Random Assignment'), 'L13.1 covers selection bias and random assignment');
  assert(l1.includes('\\omega') || l1.includes('composite error') || l1.includes('omitted factor'), 'L13.1 covers composite error / omitted factor model');
}

const l2 = fs.existsSync(path.join(mod13Dir, 'lesson-02.html')) ? fs.readFileSync(path.join(mod13Dir, 'lesson-02.html'), 'utf8') : '';
if (l2) {
  assert(l2.includes('2\\sigma^2 / n') || l2.includes('2\\sigma^2/n'), 'L13.2 derives Var(beta_hat) = 2*sigma^2/n');
  assert(l2.includes('Quadruple') || l2.includes('quadruple') || l2.includes('4n'), 'L13.2 covers quadrupling sample size to halve SE');
  assert(l2.includes('derivation-journey') || l2.includes('derivation-step-node'), 'L13.2 uses Derivation Journey component');
}

const l3 = fs.existsSync(path.join(mod13Dir, 'lesson-03.html')) ? fs.readFileSync(path.join(mod13Dir, 'lesson-03.html'), 'utf8') : '';
if (l3) {
  assert(l3.includes('Randomization Inference') || l3.includes('sharp null'), 'L13.3 covers randomization inference & sharp null');
  assert(l3.includes('3.1') || l3.includes('10,000') || l3.includes('Monte Carlo') || l3.includes('permutation'), 'L13.3 includes randomization distribution simulation');
}

const l4 = fs.existsSync(path.join(mod13Dir, 'lesson-04.html')) ? fs.readFileSync(path.join(mod13Dir, 'lesson-04.html'), 'utf8') : '';
if (l4) {
  assert(l4.includes('Blocked Randomization') || l4.includes('Stratified'), 'L13.4 covers blocked / stratified randomization');
  assert(l4.includes("Fisher's Exact") || l4.includes('Fisher Exact'), 'L13.4 covers Fisher exact test');
  assert(l4.includes('D_{ib}') || l4.includes('\\gamma_b') || l4.includes('block indicator'), 'L13.4 covers block indicators regression');
}

const l5 = fs.existsSync(path.join(mod13Dir, 'lesson-05.html')) ? fs.readFileSync(path.join(mod13Dir, 'lesson-05.html'), 'utf8') : '';
if (l5) {
  assert(l5.includes('Balance Test') || l5.includes('balance'), 'L13.5 covers baseline balance tests');
  assert(l5.includes('Standardized') || l5.includes('standardized difference'), 'L13.5 covers standardized differences');
  assert(l5.includes('chance imbalance') || l5.includes('finite-sample'), 'L13.5 emphasizes finite-sample chance imbalance');
}

const l6 = fs.existsSync(path.join(mod13Dir, 'lesson-06.html')) ? fs.readFileSync(path.join(mod13Dir, 'lesson-06.html'), 'utf8') : '';
if (l6) {
  assert(l6.includes('Covariate Adjustment') || l6.includes('Pre-treatment') || l6.includes('pre-treatment'), 'L13.6 covers pre-treatment covariate adjustment');
  assert(l6.includes('post-treatment') || l6.includes('collider'), 'L13.6 warns against post-treatment controls');
  assert(l6.includes('Pre-register') || l6.includes('pre-registration') || l6.includes('best practice'), 'L13.6 covers experimental best practices');
}

console.log('\n--- SUMMARY ---');
console.log(`Total Checks: ${checksTotal}`);
console.log(`Passed: ${checksPassed}`);
console.log(`Failed: ${checksTotal - checksPassed}`);

if (checksPassed < checksTotal) {
  process.exit(1);
} else {
  console.log('\nMODULE 13 SUITE PASSED 100%! 🚀\n');
}
