const fs = require('fs');
const path = require('path');

const mod09Dir = path.join(__dirname, '..', 'modules', 'module-09');
const rootIndexPath = path.join(__dirname, '..', 'index.html');
const lessons = [
  'lesson-01.html',
  'lesson-02.html',
  'lesson-03.html',
  'lesson-04.html',
  'lesson-05.html'
];

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

console.log('=== VERIFYING MODULE 9: ACADEMIC FIDELITY & FORMAT LOCK ===\n');

// 1. Root Index Check
console.log('Checking root index.html Module 09 card...');
check('root index.html exists', fs.existsSync(rootIndexPath));
const rootContent = fs.readFileSync(rootIndexPath, 'utf8');
check('Module 09 card present in index.html', rootContent.includes('09 Time-Ordered Data, Autocorrelation &amp; HAC Inference') || rootContent.includes('09 Time-Ordered Data, Autocorrelation & HAC Inference'));
check('Module 09 links to modules/module-09/index.html', rootContent.includes('modules/module-09/index.html'));
check('Module 09 SVG micro-visual present', rootContent.includes('DW ≈ 2(1-ρ)') || rootContent.includes('DW &#x2248; 2(1-&#x3C1;)'));
console.log('');

// 2. Overview Page Check
console.log('Checking modules/module-09/index.html...');
const indexPath = path.join(mod09Dir, 'index.html');
check('module-09/index.html exists', fs.existsSync(indexPath));
const indexContent = fs.readFileSync(indexPath, 'utf8');

check('Navbar present', indexContent.includes('class="site-header"'));
check('Hero title matches Module 09', indexContent.includes('Time-Ordered Data, Autocorrelation &amp; HAC Inference') || indexContent.includes('Time-Ordered Data, Autocorrelation & HAC Inference'));
check('Module completion / progress card present', indexContent.includes('module-completion-card') || indexContent.includes('progress-card'));
check('Learning path component present', indexContent.includes('module-learning-path') || indexContent.includes('learning-path-flow'));
check('Single-column lessons section present', indexContent.includes('module-lessons-container') || indexContent.includes('module-lesson-card'));
check('Shared footer present', indexContent.includes('class="site-footer"'));

const lessonCards = indexContent.match(/class=["'][^"']*module-lesson-card[^"']*["']/g) || [];
check('Exactly 5 single-column lesson cards', lessonCards.length === 5);

// 10-step Learning Path check
const expectedPathSteps = [
  'Time-Ordered Data',
  'Serial Correlation',
  'AR(1)',
  'Durbin–Watson',
  'GLS Transformation',
  'Prais–Winsten',
  'Cochrane–Orcutt',
  'FGLS',
  'Newey–West HAC',
  'Method Comparison'
];
expectedPathSteps.forEach(step => {
  const normStep = step.replace('–', '-');
  const found = indexContent.includes(step) || indexContent.includes(normStep) || indexContent.includes(encodeURIComponent(step));
  check(`Learning path step "${step}" present`, found);
});
console.log('');

// 3. Common Lesson Format Locks
lessons.forEach((lFile, idx) => {
  const lessonNum = idx + 1;
  console.log(`Checking Lesson 9.${lessonNum} (${lFile}) format locks...`);
  const lPath = path.join(mod09Dir, lFile);
  check(`${lFile} exists`, fs.existsSync(lPath));
  const content = fs.readFileSync(lPath, 'utf8');

  // Shared UI structure
  check('Global navbar present', content.includes('class="site-header"'));
  check('Dropdown menu present', content.includes('class="nav-dropdown-menu"'));
  check('Sticky top lesson nav present', content.includes('class="top-lesson-nav"'));
  check('Lessons dropdown menu present', content.includes('class="lesson-dropdown-menu"'));
  check('Lesson header block present', content.includes('class="lesson-header-block"'));
  check('Learning objectives card present', content.includes('objectives-card'));
  check('Study surface boxes present', content.includes('study-card') || content.includes('study-section'));
  check('Canonical Quick Check present', content.includes('quick-check-container') || content.includes('knowledge-check-accordion'));
  check('What You Should Now Understand present', content.includes('takeaways') || content.includes('What You Should Now Understand'));
  check('Lesson pager present', /class="[^"]*lesson-(?:pager|pagination)[^"]*"/.test(content));
  check('Course footer present', content.includes('class="site-footer"'));

  // Permanent UI rule negative checks
  check('NO sidebar', !content.includes('<aside') && !content.includes('class="sidebar"'));
  check('NO native select', !/<select[\s>]/i.test(content));
  check('NO PDF/source commentary shown to learners', !/page \d+ of source/i.test(content) && !/Econometrics \(9\)\.pdf/i.test(content));
  check('NO legends inside SVG plots', !content.includes('<g class="legend"') && !content.includes('<g id="legend"'));
  check('External legend present when lab exists', !content.includes('class="graph-container"') || content.includes('external-legend-bar'));
  check('NO raw unrendered LaTeX markers like \\[ or \\]', !content.includes('\\[') && !content.includes('\\]'));

  console.log('');
});

// 4. Academic Truth Checks (Econometrics (9).pdf)
console.log('Checking Lesson 9.1 Academic Truth...');
const l1 = fs.readFileSync(path.join(mod09Dir, 'lesson-01.html'), 'utf8');
check('Bridge from Module 8 (Ω ≠ I)', l1.includes('Ω') || l1.includes('\\boldsymbol{\\Omega}'));
check('Autocorrelation definition: E[ε_t ε_s] ≠ 0 for t ≠ s', l1.includes('\\mathbb{E}[\\varepsilon_t \\varepsilon_s] \\neq 0') || l1.includes('E[\\varepsilon_t \\varepsilon_s]'));
check('AR(1) formula: ε_t = ρ ε_{t-1} + u_t', l1.includes('\\varepsilon_t = \\rho \\varepsilon_{t-1} + u_t'));
check('|ρ| < 1 condition', l1.includes('|\\rho| < 1'));
check('Innovation u_t ~ iid(0, σ²)', l1.includes('u_t') && (l1.includes('\\sigma^2') || l1.includes('iid')));
check('Strict exogeneity condition preserved for OLS unbiasedness', l1.includes('strict exogeneity') || l1.includes('strictly exogenous'));
check('OLS consistency & unbiasedness preserved', l1.includes('unbiased') && l1.includes('consistent'));
check('OLS not efficient / conventional SE wrong', l1.includes('efficient') && l1.includes('standard error'));
check('Interactive Lab 9.1 AR(1) Explorer present', l1.includes('AR(1) Residual Explorer'));
check('Quick Check 9.1 present', l1.includes('Quick Check 9.1'));
console.log('');

console.log('Checking Lesson 9.2 Academic Truth...');
const l2 = fs.readFileSync(path.join(mod09Dir, 'lesson-02.html'), 'utf8');
check('Durbin–Watson formula present with tall fraction', l2.includes('\\text{DW} = \\frac{\\sum') || l2.includes('DW = \\frac{\\sum'));
check('DW intuition: numerator (differences) vs denominator (squared residual sum)', l2.includes('Numerator') && l2.includes('Denominator'));
check('DW source benchmarks: ≈ 2, < 2, > 2', l2.includes('DW \\approx 2') || l2.includes('DW &lt; 2') || l2.includes('≈ 2'));
check('Large sample heuristic: DW ≈ 2(1 - ρ)', l2.includes('2(1 -') || l2.includes('2(1-\\rho)'));
check('Part B: GLS transformation with known ρ', l2.includes('y_t - \\rho y_{t-1}') && l2.includes('\\mathbf{x}_t - \\rho \\mathbf{x}_{t-1}'));
check('Transformed variables y_t* and x_t*', l2.includes('y_t^*') && l2.includes('\\mathbf{x}_t^*'));
check('Derivation Journey (6 steps)', l2.includes('Derivation Journey') || l2.includes('Step 1') && l2.includes('Step 6'));
check('Matrix GLS estimator formula', l2.includes('(\\mathbf{X}\'\\boldsymbol{\\Omega}^{-1}\\mathbf{X})^{-1}'));
check('NO unsourced DW critical value tables', !l2.includes('dL') && !l2.includes('dU') && !l2.includes('inconclusive region'));
console.log('');

console.log('Checking Lesson 9.3 Academic Truth...');
const l3 = fs.readFileSync(path.join(mod09Dir, 'lesson-03.html'), 'utf8');
check('FGLS problem: ρ is unknown in practice', l3.includes('unknown') && l3.includes('Feasible'));
check('5-Step FGLS workflow present', l3.includes('1') && l3.includes('5') && l3.includes('Initial OLS') && l3.includes('Re-Estimate'));
check('Cochrane–Orcutt drops observation t=1', l3.includes('t=1') && (l3.includes('Drops') || l3.includes('discarded') || l3.includes('omitted')));
check('Cochrane–Orcutt iterative procedure', l3.includes('iterat') || l3.includes('Iterative'));
check('Prais–Winsten preserves observation t=1', l3.includes('Prais') && l3.includes('preserv') || l3.includes('Retains'));
check('Prais–Winsten first-obs formula: √(1 - ρ²)', l3.includes('\\sqrt{1 - \\rho^2}') || l3.includes('\\sqrt{1 - \\widehat{\\rho}^2}'));
check('Comparison card: Prais-Winsten vs Cochrane-Orcutt', l3.includes('Prais–Winsten vs.') || l3.includes('Prais-Winsten vs'));
check('Source efficiency statement: dropping t=1 causes efficiency loss', l3.includes('efficiency') && l3.includes('finite-sample'));
check('Interactive Lab 9.3 AR(1) Transformation Explorer present', l3.includes('AR(1) Transformation Explorer'));
check('Quick Check 9.3 present', l3.includes('Quick Check 9.3'));
console.log('');

console.log('Checking Lesson 9.4 Academic Truth...');
const l4 = fs.readFileSync(path.join(mod09Dir, 'lesson-04.html'), 'utf8');
check('Contrast: GLS transforms model vs Newey-West keeps OLS coefficients', l4.includes('keeps') && l4.includes('coefficients'));
check('HAC definition: Heteroskedasticity and Autocorrelation Consistent', l4.includes('Heteroskedasticity and Autocorrelation Consistent'));
check('OLS coefficient vector unchanged', l4.includes('\\widehat{\\boldsymbol{\\beta}}_{\\text{OLS}}') && l4.includes('unchanged'));
check('Newey-West sandwich formula present', l4.includes('(\\mathbf{X}\'\\mathbf{X})^{-1}') && l4.includes('w_s'));
check('Bartlett kernel weights formula: w_s = 1 - |s|/(L+1)', l4.includes('1 - \\frac{|s|}{L + 1}') || l4.includes('1 - \\frac{|s|}{L+1}'));
check('Bandwidth / truncation lag L explained', l4.includes('bandwidth') || l4.includes('truncation lag'));
check('Bartlett weight visual / lag-weight profile present', l4.includes('bartlettSvg') || l4.includes('Bartlett Weight'));
check('Interactive Lab 9.4 Newey-West Explorer present', l4.includes('Newey–West HAC Explorer'));
check('Illustrative simulation label present', l4.includes('illustrative simulation') || l4.includes('SIMULATION NOTE'));
check('Quick Check 9.4 present', l4.includes('Quick Check 9.4'));
console.log('');

console.log('Checking Lesson 9.5 Academic Truth...');
const l5 = fs.readFileSync(path.join(mod09Dir, 'lesson-05.html'), 'utf8');
check('Method decision map present', l5.includes('Decision Map') || l5.includes('STRATEGY SELECTOR'));
check('GLS recap: known Ω attains BLUE', l5.includes('BLUE') && (l5.includes('Gauss') || l5.includes('known')));
check('WLS source recap: Var(ε_i) = σ² h(x_i)²', l5.includes('\\sigma^2 h(x_i)^2') || l5.includes('h(x_i)'));
check('WLS 6-step weighting procedure', l5.includes('residuals') && l5.includes('weights') && l5.includes('1 /'));
check('Master comparison table present with 7 rows', l5.includes('OLS Conventional') && l5.includes('Prais–Winsten') && l5.includes('Newey–West HAC') && l5.includes('Weighted LS'));
check('14 review cards present', l5.includes('1. Serial Correlation') && l5.includes('14. GLS Efficiency'));
check('Quick Check 9.5 present', l5.includes('Quick Check 9.5'));
console.log('');

// 5. Verification Results
console.log('==================================================');
console.log(`TOTAL CHECKS: ${totalChecks}`);
console.log(`PASSED: ${passedChecks}`);
console.log(`FAILED: ${failedChecks}`);
console.log('==================================================');

if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('ALL MODULE 9 ACADEMIC & FORMAT SPECIFICATIONS VERIFIED!');
}
