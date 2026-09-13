const fs = require('fs');
const path = require('path');

const mod12Dir = path.join(__dirname, '..', 'modules', 'module-12');

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

console.log('\n=== VERIFYING MODULE 12 FILES & ARCHITECTURE ===\n');

// 1. Verify existence of all files
files.forEach(f => {
  const filePath = path.join(mod12Dir, f);
  assert(fs.existsSync(filePath), `File exists: ${f}`);
});

// 2. Verify Overview
console.log('\n--- Checking Module 12 Overview (index.html) ---');
const overviewHtml = fs.readFileSync(path.join(mod12Dir, 'index.html'), 'utf8');
assert(overviewHtml.includes('data-module="module-12"'), 'Sets data-module="module-12"');
assert(overviewHtml.includes('module-learning-path'), 'Contains compact module-learning-path');
assert(overviewHtml.includes('learning-path-pill') || overviewHtml.includes('path-node'), 'Contains learning path nodes');
assert(overviewHtml.includes('single-column-lessons') || overviewHtml.includes('module-lessons-list'), 'Contains single-column lesson list');
assert(overviewHtml.includes('progress-text-module-12'), 'Contains progress tracking text');
assert(overviewHtml.includes('progress-fill-module-12'), 'Contains progress tracking bar');

// 3. Verify Lessons
for (let i = 1; i <= 6; i++) {
  const lessonFile = `lesson-0${i}.html`;
  console.log(`\n--- Checking Lesson 12.${i} (${lessonFile}) ---`);
  const content = fs.readFileSync(path.join(mod12Dir, lessonFile), 'utf8');

  assert(content.includes(`data-module="module-12"`), 'data-module="module-12" attribute present');
  assert(content.includes(`data-lesson="${i}"`), `data-lesson="${i}" attribute present`);
  assert(content.includes('top-lesson-nav'), 'Sticky top-lesson-nav present');
  assert(content.includes('lesson-hero'), 'Lesson hero present');
  assert(content.includes('quick-check-card'), 'Quick check card present');
  assert(content.includes('toggle-hint-btn') && content.includes('toggle-sol-btn'), 'Quick check interactive buttons present');
  assert(content.includes('summary-takeaways-card') || content.includes('completion-card'), 'What You Should Now Understand card present');
  assert(content.includes('lesson-pager'), 'Lesson pager present');
  assert(content.includes('site-footer'), 'Shared global footer present');
  assert(content.includes('theme.js') && content.includes('navigation.js') && content.includes('progress.js'), 'Core course JS scripts included');
}

// 4. Verify Academic Concepts from Econometrics (12).pdf
console.log('\n--- Checking Econometric Content Fidelity ---');
const l1 = fs.readFileSync(path.join(mod12Dir, 'lesson-01.html'), 'utf8');
assert(l1.includes('Hausman') && l1.includes('W') && l1.includes('\\chi^2'), 'Lesson 12.1 contains Hausman W chi-square test');
assert(l1.includes('Wu') && l1.includes('\\hat{u}'), 'Lesson 12.1 contains Wu test with first-stage residual');
assert(l1.includes('Module 10') || l1.includes('FE vs RE'), 'Lesson 12.1 clarifies Module 10 FE-vs-RE vs Module 12 IV-vs-OLS continuity');

const l2 = fs.readFileSync(path.join(mod12Dir, 'lesson-02.html'), 'utf8');
assert(l2.includes('Sargan') && l2.includes('L > K'), 'Lesson 12.2 contains Sargan test with L > K overidentification requirement');
assert(l2.includes('LATE') || l2.includes('complier'), 'Lesson 12.2 explains LATE / heterogeneous effect caution');
assert(l2.includes('Quarter of Birth') || l2.includes('Distance to College'), 'Lesson 12.2 uses primary source examples (Quarter of Birth / Distance to College)');

const l3 = fs.readFileSync(path.join(mod12Dir, 'lesson-03.html'), 'utf8');
assert(l3.includes('F \\ge 10') || l3.includes('F ≥ 10'), 'Lesson 12.3 contains F >= 10 rule of thumb');
assert(l3.includes('F \\ge 16') || l3.includes('F ≥ 16'), 'Lesson 12.3 contains F >= 16 (|t| >= 4) single instrument rule');
assert(l3.includes('Stock') && l3.includes('Cragg') && l3.includes('Kleibergen'), 'Lesson 12.3 contains Stock-Yogo, Cragg-Donald, and Kleibergen-Paap');

const l4 = fs.readFileSync(path.join(mod12Dir, 'lesson-04.html'), 'utf8');
assert(l4.includes('y^* = \\alpha + x^*\\beta + \\varepsilon') || l4.includes('y^*'), 'Lesson 12.4 contains true latent model');
assert(l4.includes('\\sigma_\\varepsilon^2 + \\sigma_v^2') || l4.includes('variance'), 'Lesson 12.4 derives inflated error variance in y');
assert(l4.includes('\\omega = \\varepsilon - \\beta u') || l4.includes('attenuation'), 'Lesson 12.4 shows regressor endogeneity in x');

const l5 = fs.readFileSync(path.join(mod12Dir, 'lesson-05.html'), 'utf8');
assert(l5.includes('\\lambda') && l5.includes('\\text{Var}(x^*)'), 'Lesson 12.5 defines attenuation factor lambda');
assert(l5.includes('1.4') || l5.includes('0.7'), 'Lesson 12.5 includes beta=2, lambda=0.7 -> 1.4 worked example');
assert(l5.includes('\\text{Cov}(z, u) = 0'), 'Lesson 12.5 derives IV conditions for measurement error');

const l6 = fs.readFileSync(path.join(mod12Dir, 'lesson-06.html'), 'utf8');
assert(l6.includes('Propagation of error') || l6.includes('propagation'), 'Lesson 12.6 defines propagation of error');
assert(l6.includes('Wage =') || l6.includes('Income / Hours'), 'Lesson 12.6 includes Wage ratio example');
assert(l6.includes('Difference in test scores') || l6.includes('test scores'), 'Lesson 12.6 includes test score differences example');

console.log(`\n=== VERIFICATION SUMMARY ===`);
console.log(`Total Checks: ${checksTotal}`);
console.log(`Passed: ${checksPassed}`);
console.log(`Failed: ${checksTotal - checksPassed}`);

if (checksPassed === checksTotal) {
  console.log('\nMODULE 12 100% VERIFIED AND READY! 🎓');
} else {
  process.exit(1);
}
