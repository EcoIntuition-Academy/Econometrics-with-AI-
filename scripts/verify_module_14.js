const fs = require('fs');
const path = require('path');

const mod14Dir = path.join(__dirname, '..', 'modules', 'module-14');

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

console.log('\n=== VERIFYING MODULE 14 FILES & ARCHITECTURE ===\n');

// 1. Verify existence of all files
files.forEach(f => {
  const filePath = path.join(mod14Dir, f);
  assert(fs.existsSync(filePath), `File exists: ${f}`);
});

// 2. Verify Overview
console.log('\n--- Checking Module 14 Overview (index.html) ---');
const overviewHtml = fs.existsSync(path.join(mod14Dir, 'index.html')) ? fs.readFileSync(path.join(mod14Dir, 'index.html'), 'utf8') : '';
if (overviewHtml) {
  assert(overviewHtml.includes('data-module="module-14"'), 'Sets data-module="module-14"');
  assert(overviewHtml.includes('module-learning-path-card'), 'Contains compact module-learning-path-card');
  assert(overviewHtml.includes('MDE') && overviewHtml.includes('Exclusion Restriction'), 'Contains full 15-step learning path');
  assert(overviewHtml.includes('module-lessons-list'), 'Contains single-column lesson list');
  assert(overviewHtml.includes('progress-text-module-14'), 'Contains progress tracking text');
  assert(overviewHtml.includes('progress-fill-module-14'), 'Contains progress tracking bar');
  assert(overviewHtml.includes('Field Experiments II: Estimation, Compliance &amp; LATE') || overviewHtml.includes('Field Experiments II: Estimation, Compliance & LATE'), 'Correct Module 14 title');
}

// 3. Verify Lessons
for (let i = 1; i <= 6; i++) {
  const lessonFile = `lesson-0${i}.html`;
  console.log(`\n--- Checking Lesson 14.${i} (${lessonFile}) ---`);
  const filePath = path.join(mod14Dir, lessonFile);
  if (!fs.existsSync(filePath)) {
    assert(false, `File ${lessonFile} exists`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  assert(content.includes('data-module="module-14"'), 'data-module="module-14" attribute present');
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
const l1 = fs.existsSync(path.join(mod14Dir, 'lesson-01.html')) ? fs.readFileSync(path.join(mod14Dir, 'lesson-01.html'), 'utf8') : '';
if (l1) {
  assert(l1.includes('Minimum Detectable Effect') || l1.includes('MDE'), 'L14.1 covers Minimum Detectable Effect (MDE)');
  assert(l1.includes('policy') || l1.includes('actionable'), 'L14.1 covers policy-actionable effect threshold');
  assert(l1.includes('lion') || l1.includes('leopard') || l1.includes('serval'), 'L14.1 contains animal search intuition');
}

const l2 = fs.existsSync(path.join(mod14Dir, 'lesson-02.html')) ? fs.readFileSync(path.join(mod14Dir, 'lesson-02.html'), 'utf8') : '';
if (l2) {
  assert(l2.includes('Intent to Treat') || l2.includes('ITT'), 'L14.2 covers Intent to Treat (ITT)');
  assert(l2.includes('intreat') || l2.includes('Difference-in-Differences'), 'L14.2 covers repeated outcomes DID interaction model');
  assert(l2.includes('cluster') || l2.includes('Cluster'), 'L14.2 includes within-unit clustering warning');
}

const l3 = fs.existsSync(path.join(mod14Dir, 'lesson-03.html')) ? fs.readFileSync(path.join(mod14Dir, 'lesson-03.html'), 'utf8') : '';
if (l3) {
  assert(l3.includes('Preregistration') || l3.includes('preregistration'), 'L14.3 covers preregistration');
  assert(l3.includes('socialscienceregistry.org') || l3.includes('Social Science Registry'), 'L14.3 references Social Science Registry');
  assert(l3.includes('Bonferroni') || l3.includes('FWER') || l3.includes('Multiple Hypotheses'), 'L14.3 covers multiple hypothesis corrections');
}

const l4 = fs.existsSync(path.join(mod14Dir, 'lesson-04.html')) ? fs.readFileSync(path.join(mod14Dir, 'lesson-04.html'), 'utf8') : '';
if (l4) {
  assert(l4.includes('Always-taker') && l4.includes('Complier') && l4.includes('Never-taker') && l4.includes('Defier'), 'L14.4 covers four compliance types');
  assert(l4.includes('scholarship') || l4.includes('cookie'), 'L14.4 includes scholarship / cookie example');
}

const l5 = fs.existsSync(path.join(mod14Dir, 'lesson-05.html')) ? fs.readFileSync(path.join(mod14Dir, 'lesson-05.html'), 'utf8') : '';
if (l5) {
  assert(l5.includes('Monotonicity') || l5.includes('monotonicity'), 'L14.5 covers monotonicity (no defiers)');
  assert(l5.includes('Wald') || l5.includes('LATE'), 'L14.5 covers Wald estimator & LATE');
  assert(l5.includes('0.25') && l5.includes('20'), 'L14.5 includes primary source numerical LATE example (ITT=5, FS=0.25, LATE=20)');
}

const l6 = fs.existsSync(path.join(mod14Dir, 'lesson-06.html')) ? fs.readFileSync(path.join(mod14Dir, 'lesson-06.html'), 'utf8') : '';
if (l6) {
  assert(l6.includes('2SLS') || l6.includes('Two-Stage Least Squares'), 'L14.6 covers 2SLS in field experiments');
  assert(l6.includes('Exclusion Restriction') || l6.includes('exclusion restriction'), 'L14.6 covers exclusion restriction');
  assert(l6.includes('LATE vs ATE') || l6.includes('ATE'), 'L14.6 covers LATE vs ATE distinction');
}

console.log('\n--- SUMMARY ---');
console.log(`Total Checks: ${checksTotal}`);
console.log(`Passed: ${checksPassed}`);
console.log(`Failed: ${checksTotal - checksPassed}`);

if (checksPassed < checksTotal) {
  process.exit(1);
} else {
  console.log('\nMODULE 14 SUITE PASSED 100%! 🚀\n');
}
