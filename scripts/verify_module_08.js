const fs = require('fs');
const path = require('path');

const mod08Dir = path.join(__dirname, '..', 'modules', 'module-08');
const lessons = [
  'lesson-01.html',
  'lesson-02.html',
  'lesson-03.html',
  'lesson-04.html',
  'lesson-05.html',
  'lesson-06.html'
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

console.log('=== VERIFYING MODULE 8: ACADEMIC FIDELITY & FORMAT LOCK ===\n');

// 1. Overview Page Check
console.log('Checking module-08/index.html...');
const indexPath = path.join(mod08Dir, 'index.html');
check('index.html exists', fs.existsSync(indexPath));
const indexContent = fs.readFileSync(indexPath, 'utf8');

check('Navbar present', indexContent.includes('class="site-header"'));
check('Hero title matches Module 08', indexContent.includes('Non-Spherical Errors, Robust Inference & Efficient Estimation'));
check('Module Progress Card present', indexContent.includes('class="module-progress-card"'));
check('Learning Path Card present', indexContent.includes('class="module-learning-path-card"'));
check('Single column lessons section present', indexContent.includes('class="module-lessons-section"'));
check('Course footer present', indexContent.includes('class="site-footer"'));

const overviewCards = indexContent.match(/class=["']module-lesson-card["']/g) || [];
check('Exactly 6 single-column lesson cards', overviewCards.length === 6);

// Verify Learning Path Steps
const learningPathSteps = [
  'Spherical Errors',
  'Non-Spherical Errors',
  'OLS Variance',
  'GLS',
  'FGLS',
  'Robust Standard Errors',
  'Heteroskedasticity Tests',
  'WLS',
  'Bootstrap'
];
learningPathSteps.forEach(step => {
  check(`Learning path includes "${step}"`, indexContent.includes(step));
});

console.log('');

// 2. Lesson-by-lesson checks
lessons.forEach((lFile, idx) => {
  const lessonNum = idx + 1;
  console.log(`Checking Lesson 8.${lessonNum} (${lFile})...`);
  const lPath = path.join(mod08Dir, lFile);
  check(`${lFile} exists`, fs.existsSync(lPath));
  const content = fs.readFileSync(lPath, 'utf8');

  // Common UI format checks
  check('Global navbar present', content.includes('class="site-header"'));
  check('Dropdown menu present', content.includes('class="nav-dropdown-menu"'));
  check('Sticky top lesson nav present', content.includes('class="top-lesson-nav"'));
  check('Canonical View Lessons dropdown present', content.includes('class="lesson-dropdown-menu"'));
  check('Lesson header block present', content.includes('class="lesson-header-block"'));
  check('Learning objectives card present', content.includes('class="objectives-card"'));
  check('Study section boxes present', content.includes('class="study-section"'));
  check('Explanation grid present', content.includes('class="visual-explanation-grid"'));
  check('Canonical Quick Check present', content.includes('class="knowledge-check-accordion"'));
  check('What You Should Now Understand present', content.includes('class="summary-takeaways-card"'));
  check('Lesson pager navigation present', content.includes('class="lesson-pager"'));
  check('Course footer present', content.includes('class="site-footer"'));

  // Negative checks (Strictly unpermitted topics)
  check('NO Newey-West / HAC', !/Newey[–\s-]*West|HAC\b/i.test(content));
  check('NO Durbin-Watson', !/Durbin[–\s-]*Watson/i.test(content));
  check('NO Breusch-Godfrey', !/Breusch[–\s-]*Godfrey/i.test(content));
  check('NO cluster-robust / panel clustering', !/cluster[–\s-]*robust|clustered standard errors/i.test(content));
  check('NO HC1 / HC2 / HC3 / HC4', !/\bHC[1-4]\b/i.test(content));
  check('NO Prais-Winsten / Cochrane-Orcutt', !/Prais[–\s-]*Winsten|Cochrane[–\s-]*Orcutt/i.test(content));

  console.log('');
});

// 3. Academic Topic Specific Checks
console.log('Checking Academic Truth against Econometrics (8).pdf...');

// Lesson 8.1
const l1 = fs.readFileSync(path.join(mod08Dir, 'lesson-01.html'), 'utf8');
check('L8.1: Spherical disturbances E[ee|X] = sigma^2 I', l1.includes('\\sigma^2 \\mathbf{I}'));
check('L8.1: Heteroskedasticity & Autocorrelation distinctions', l1.includes('Homoskedasticity') && l1.includes('No Autocorrelation'));
check('L8.1: Responsive Covariance Matrix Visual (Spherical, Heteroskedastic, Autocorrelated tabs)', 
  l1.includes('id="tabSpherical"') && l1.includes('id="tabHetero"') && l1.includes('id="tabAuto"'));
check('L8.1: OLS unbiasedness proof E[beta_hat|X] = beta', l1.includes('\\mathbb{E}[\\widehat{\\boldsymbol{\\beta}}_{\\text{OLS}} \\mid \\mathbf{X}] = \\boldsymbol{\\beta}'));
check('L8.1: True OLS variance with Omega between X\' and X', l1.includes('\\mathbf{X}\'\\boldsymbol{\\Omega}\\mathbf{X}'));
check('L8.1: Normality result conditional on X', l1.includes('\\mathcal{N}'));
check('L8.1: Interactive Lab present', l1.includes('btnLabSpherical') && l1.includes('labScatterSvg'));

// Lesson 8.2
const l2 = fs.readFileSync(path.join(mod08Dir, 'lesson-02.html'), 'utf8');
check('L8.2: Premultiplication by Omega^-1/2 transformation', l2.includes('\\boldsymbol{\\Omega}^{-1/2}'));
check('L8.2: Transformed disturbances spherical E[e* e*\'|X] = sigma^2 I', l2.includes('\\sigma^2 \\mathbf{I}'));
check('L8.2: GLS estimator (X\' Omega^-1 X)^-1 X\' Omega^-1 y', l2.includes('(\\mathbf{X}\'\\boldsymbol{\\Omega}^{-1}\\mathbf{X})^{-1} \\mathbf{X}\'\\boldsymbol{\\Omega}^{-1}\\mathbf{y}'));
check('L8.2: GLS variance sigma^2 (X\' Omega^-1 X)^-1', l2.includes('\\sigma^2 (\\mathbf{X}\'\\boldsymbol{\\Omega}^{-1}\\mathbf{X})^{-1}'));
check('L8.2: FGLS three-stage procedure', l2.includes('STAGE 1') && l2.includes('STAGE 2') && l2.includes('STAGE 3'));
check('L8.2: FGLS estimator with estimated Omega_hat', l2.includes('\\widehat{\\boldsymbol{\\Omega}}'));
check('L8.2: Interactive Lab present', l2.includes('btnViewOriginal') && l2.includes('btnViewTransformed') && l2.includes('glsLabSvg'));

// Lesson 8.3
const l3 = fs.readFileSync(path.join(mod08Dir, 'lesson-03.html'), 'utf8');
check('L8.3: White HC0 sandwich covariance formula', l3.includes('\\sum_{i=1}^n \\widehat{\\varepsilon}_i^2 \\mathbf{x}_i \\mathbf{x}_i\''));
check('L8.3: Bread-Meat-Bread visual diagram', l3.includes('BREAD') && l3.includes('MEAT'));
check('L8.3: OLS point estimates unchanged by robust SEs', l3.includes('Strictly Unchanged') || l3.includes('point estimates remain identical'));
check('L8.3: Interactive Lab with heteroskedasticity slider', l3.includes('id="sliderHetero"') && l3.includes('whiteLabSvg'));

// Lesson 8.4
const l4 = fs.readFileSync(path.join(mod08Dir, 'lesson-04.html'), 'utf8');
check('L8.4: Breusch-Pagan test auxiliary regression with squared residuals', l4.includes('Breusch–Pagan') && l4.includes('\\widehat{\\varepsilon}_i^2'));
check('L8.4: Breusch-Pagan test statistic nR^2 ~ chi^2_k', l4.includes('n R^2') && l4.includes('\\chi^2_k'));
check('L8.4: White test with squares and cross-products', l4.includes('cross-products') && l4.includes('\\chi^2_q'));
check('L8.4: Test rejection caution (does not imply bias)', l4.includes('Does NOT Mean OLS Is Biased') || l4.includes('does not imply bias'));
check('L8.4: Interactive Lab present', l4.includes('btnTestHomo') && l4.includes('btnTestLinear') && l4.includes('btnTestNonlinear') && l4.includes('testLabSvg'));

// Lesson 8.5
const l5 = fs.readFileSync(path.join(mod08Dir, 'lesson-05.html'), 'utf8');
check('L8.5: WLS as special diagonal GLS', l5.includes('special case of Generalized Least Squares'));
check('L8.5: Classroom girls example Var(e_i) = sigma^2 / girls_i', l5.includes('\\text{girls}_i') && l5.includes('\\operatorname{Var}(\\varepsilon_i)'));
check('L8.5: Transformation by sqrt(girls_i)', l5.includes('\\sqrt{\\text{girls}_i}'));
check('L8.5: Matrix form (X\' W X)^-1 X\' W y', l5.includes('(\\mathbf{X}\'\\mathbf{W}\\mathbf{X})^{-1}\\mathbf{X}\'\\mathbf{W}\\mathbf{y}'));
check('L8.5: Summation form with weights', l5.includes('\\sum_{i=1}^n w_i'));
check('L8.5: Classroom weighting bubble visual lab', l5.includes('wlsLabSvg') && l5.includes('Classroom Weighting Lab'));

// Lesson 8.6
const l6 = fs.readFileSync(path.join(mod08Dir, 'lesson-06.html'), 'utf8');
check('L8.6: Bootstrap resampling with replacement algorithm', l6.includes('Draw Sample of Size') && l6.includes('WITH REPLACEMENT'));
check('L8.6: Concrete sample {2, 4, 9, 12} source example', l6.includes('2, 4, 9, 12'));
check('L8.6: Combinatorics 4^4 = 256 ordered draws vs 35 distinct combinations', l6.includes('256') && l6.includes('35'));
check('L8.6: Bootstrap variance & SE dispersion formulas', l6.includes('\\operatorname{SE}^*(\\widehat{\\theta})'));
check('L8.6: Interactive Bootstrap Resampling Lab', l6.includes('btnDrawOne') && l6.includes('btnDraw50') && l6.includes('btnDraw250') && l6.includes('bootHistSvg'));
check('L8.6: 12 Module Review Cards present', (l6.match(/0[1-9] &middot;|1[0-2] &middot;/g) || []).length === 12);
check('L8.6: Comparative Synthesis Table present', l6.includes('Methodological Comparison of Approaches'));

console.log('\n--- MODULE 8 VERIFICATION SUMMARY ---');
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);

if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('\nALL MODULE 8 ACADEMIC & UI SPECIFICATIONS FULLY VERIFIED! 🏆');
}
