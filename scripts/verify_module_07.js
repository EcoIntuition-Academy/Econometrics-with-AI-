const fs = require('fs');
const path = require('path');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(desc, cond) {
  totalChecks++;
  if (cond) {
    passedChecks++;
    console.log(`  [PASS] ${desc}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${desc}`);
  }
}

console.log('=== VERIFYING MODULE 7 (ADVANCED DIFFERENCE-IN-DIFFERENCES) ===\n');

// 1. Check Module 7 Hub
console.log('1. Checking Module 7 Overview (modules/module-07/index.html)...');
const indexPath = path.join(__dirname, '..', 'modules', 'module-07', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

const posNav = indexContent.indexOf('class="site-header"');
const posHero = indexContent.indexOf('class="module-hero"');
const posActions = indexContent.indexOf('class="module-actions"');
const posProgress = indexContent.indexOf('class="module-progress-card"');
const posPath = indexContent.indexOf('class="module-learning-path-card"');
const posLessons = indexContent.indexOf('class="module-lessons-section"');
const posFooter = indexContent.indexOf('class="site-footer"');

check('Canonical Section Order (Nav -> Hero -> Actions -> Progress -> Path -> Lessons -> Footer)',
  posNav < posHero && posHero < posActions && posActions < posProgress &&
  posProgress < posPath && posPath < posLessons && posLessons < posFooter
);

check('Single-Column Lessons List', indexContent.includes('class="module-lessons-list"'));
check('Contains 5 Single-Column Lesson Cards', (indexContent.match(/class="module-lesson-card"/g) || []).length === 5);
check('Canonical Learning Path title', indexContent.includes('MODULE LEARNING PATH'));
check('Has Start Module 7 button', indexContent.includes('Start Module 7 →'));
check('Has Explore All Modules button', indexContent.includes('Explore All Modules'));
check('Has 0% Complete indicator', indexContent.includes('0% Complete'));

// 2. Check All 5 Lessons
const lessons = [
  { file: 'lesson-01.html', num: 1, title: 'Why Difference-in-Difference-in-Differences?', progress: '20%' },
  { file: 'lesson-02.html', num: 2, title: 'The DDD Regression & Coefficient Interpretation', progress: '40%' },
  { file: 'lesson-03.html', num: 3, title: 'Deriving the Triple-Interaction Effect', progress: '60%' },
  { file: 'lesson-04.html', num: 4, title: 'DDD in Changes & the Role of Controls', progress: '80%' },
  { file: 'lesson-05.html', num: 5, title: 'DDD Assumptions, Interpretation & Review', progress: '100%' }
];

lessons.forEach(l => {
  console.log(`\nChecking Lesson 7.${l.num} (${l.file})...`);
  const lPath = path.join(__dirname, '..', 'modules', 'module-07', l.file);
  const content = fs.readFileSync(lPath, 'utf8');

  check('Sticky top navigator present', content.includes('class="top-lesson-nav"'));
  check('View Lessons dropdown present with 5 lessons', (content.match(/class="dropdown-item/g) || []).length === 5);
  check(`Progress text is ${l.progress}`, content.includes(l.progress));
  check('Canonical vertical Learning Objectives card present', content.includes('class="objectives-card"'));
  check('What You Should Now Understand summary present', content.includes('What You Should Now Understand'));
  check('Bottom navigation with previous and next links present', content.includes('class="lesson-pagination"') || content.includes('class="lesson-bottom-nav"') || content.includes('class="lesson-pager"'));
  check('Course footer present', content.includes('class="site-footer"'));
  check('All main educational sections are boxed (.study-section)', (content.match(/class="study-section"/g) || []).length >= 2);
});

// 3. Academic & Content Specific Checks
console.log('\n3. Verifying Academic Fidelity against Econometrics (7).pdf...');

const l1 = fs.readFileSync(path.join(__dirname, '..', 'modules', 'module-07', 'lesson-01.html'), 'utf8');
check('L7.1 contains Medicaid expansion example', l1.includes('Medicaid'));
check('L7.1 contains poor and rich children comparison', l1.includes('poor children') && l1.includes('rich children'));
check('L7.1 contains physical education simultaneous shock', l1.includes('physical-education') || l1.includes('physical education'));
check('L7.1 defines DDD as difference between two DD estimates', l1.includes('difference between two Difference-in-Differences estimates') || l1.includes('difference between two DD estimates'));
check('L7.1 has 3-layer visual (State x Time x Subgroup)', l1.includes('Dimension 1') && l1.includes('Dimension 2') && l1.includes('Dimension 3'));
check('L7.1 mentions common limitation of finding a placebo group', l1.includes('not always possible to find a suitable placebo group'));

const l2 = fs.readFileSync(path.join(__dirname, '..', 'modules', 'module-07', 'lesson-02.html'), 'utf8');
check('L7.2 contains Philadelphia and Pittsburgh math scores example', l2.includes('Philadelphia') && l2.includes('Pittsburgh'));
check('L7.2 contains junior and sophomore grade levels', l2.includes('Juniors') && l2.includes('Sophomores'));
check('L7.2 includes aligned saturated DDD regression', l2.includes('score}_{itc}') && l2.includes('\\beta_7'));
check('L7.2 has Pre and Post period decomposition tables', l2.includes('PRE-TREATMENT PERIOD') && l2.includes('POST-TREATMENT PERIOD'));
check('L7.2 interprets all 8 parameters β0 to β7', l2.includes('\\beta_0') && l2.includes('\\beta_1') && l2.includes('\\beta_5') && l2.includes('\\beta_7'));

const l3 = fs.readFileSync(path.join(__dirname, '..', 'modules', 'module-07', 'lesson-03.html'), 'utf8');
check('L7.3 has Derivation Journey rail', l3.includes('class="derivation-journey"'));
check('L7.3 derives DD_Juniors = β5 + β7', l3.includes('\\beta_5 + \\beta_7'));
check('L7.3 derives DD_Sophomores = β5', l3.includes('\\beta_5'));
check('L7.3 proves DDD = β7', l3.includes('\\text{DDD} = \\beta_7'));
check('L7.3 includes Interactive DDD Table Builder', l3.includes('id="dddBuilderApp"'));
check('L7.3 includes 8 interactive table inputs', l3.includes('id="pittSophPre"') && l3.includes('id="phillyJrPost"'));
check('L7.3 includes external legend', l3.includes('Editable Input Cell') && l3.includes('Calculated Difference'));
check('L7.3 includes 5-box visual explanation grid', l3.includes('WHAT YOU ARE SEEING') && l3.includes('WHAT TO NOTICE') && l3.includes('WHY IT MATTERS') && l3.includes('ECONOMETRIC INTERPRETATION') && l3.includes('TRY THIS'));

const l4 = fs.readFileSync(path.join(__dirname, '..', 'modules', 'module-07', 'lesson-04.html'), 'utf8');
check('L7.4 includes DDD in changes specification', l4.includes('\\Delta \\text{score}_{itc}'));
check('L7.4 proves double differencing in changes equals β7', l4.includes('(\\beta_4 + \\beta_5 + \\beta_6 + \\beta_7)'));
check('L7.4 has side-by-side Levels vs Changes study cards', l4.includes('LEVELS SPECIFICATION') && l4.includes('CHANGES SPECIFICATION'));
check('L7.4 contrasts Raw DDD vs Controlled DDD', l4.includes('Raw DDD') && l4.includes('Controlled DDD'));
check('L7.4 explains precision improvement and OVB mitigation', l4.includes('Improves Estimation Precision') && l4.includes('Omitted-Variable Bias'));

const l5 = fs.readFileSync(path.join(__dirname, '..', 'modules', 'module-07', 'lesson-05.html'), 'utf8');
check('L7.5 details the 3 DDD identifying assumptions', (l5.includes('Appropriate Counterfactual Trends') || l5.includes('Relevant Common Trends')) && (l5.includes('Comparable Shock Exposure') || l5.includes('Equal Confounder Exposure')) && (l5.includes('No Treatment on Placebo Subgroup') || l5.includes('No Spillover to Placebo')));
check('L7.5 ties causal interpretation strictly to assumptions', l5.includes('Under the stated DDD identifying assumptions') && l5.includes('has the causal treatment-effect interpretation'));
check('L7.5 has synthesis: What DDD Does and Definition', (l5.includes('What DDD Can Do') || l5.includes('Key Capabilities of the DDD Design')) && (l5.includes('DEFINITION') || l5.includes('FORMAL DEFINITION')));
check('L7.5 contains 8-step review pipeline map', l5.includes('Module 7 Conceptual Pipeline'));
check('L7.5 contains 11 modular review cards', (l5.match(/class="study-card"/g) || []).length >= 11);

// 4. Exclusion checks
console.log('\n4. Verifying Strict Source Exclusions (No TWFE, Staggered, or Module 8)...');
const allMod7Text = indexContent + l1 + l2 + l3 + l4 + l5;
check('NO TWFE (Two-Way Fixed Effects) lessons introduced', !allMod7Text.toLowerCase().includes('two-way fixed effects') && !allMod7Text.includes('TWFE'));
check('NO Staggered-adoption estimators (Callaway, Sant\'Anna, Sun, Abraham, Goodman-Bacon)',
  !allMod7Text.includes('Callaway') && !allMod7Text.includes('Sant\'Anna') && !allMod7Text.includes('Goodman-Bacon') && !allMod7Text.includes('Sun and Abraham')
);
const mod8Lessons = fs.existsSync(path.join(__dirname, '..', 'modules', 'module-08')) ?
  fs.readdirSync(path.join(__dirname, '..', 'modules', 'module-08')).filter(f => f.startsWith('lesson-')) : [];
check('NO Module 8 lessons started (only placeholder remains untouched)', mod8Lessons.length === 0);

console.log(`\n========================================`);
console.log(`TOTAL CHECKS: ${totalChecks}`);
console.log(`PASSED: ${passedChecks}`);
console.log(`FAILED: ${failedChecks}`);
console.log(`========================================\n`);

if (failedChecks > 0) process.exit(1);
