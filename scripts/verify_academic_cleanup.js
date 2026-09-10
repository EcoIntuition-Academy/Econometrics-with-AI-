const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

let totalErrors = 0;
function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
  } else {
    console.error(`✗ FAIL: ${message}`);
    totalErrors++;
  }
}

console.log('=== Academic Precision & UI Verification ===\n');

// 1. Check variables.css
const varCss = fs.readFileSync(path.join(rootDir, 'assets/css/variables.css'), 'utf8');
assert(varCss.includes('--main-nav-height: 70px'), 'variables.css defines --main-nav-height');
assert(varCss.includes('--module-bar-height: 58px'), 'variables.css defines --module-bar-height');
assert(varCss.includes('--total-sticky-offset'), 'variables.css defines --total-sticky-offset');

// 2. Check lesson.css
const lessonCss = fs.readFileSync(path.join(rootDir, 'assets/css/lesson.css'), 'utf8');
assert(lessonCss.includes('scroll-margin-top: calc(var(--total-sticky-offset'), 'lesson.css applies scroll-margin-top with total sticky offset');
assert(!lessonCss.includes('.objectives-card ul li,\n.learning-objectives ul li {\n  display: flex'), 'lesson.css: .objectives-card ul li does NOT use display: flex');
assert(lessonCss.includes('.objectives-card ul li,\n.learning-objectives ul li {\n  display: block'), 'lesson.css: .objectives-card ul li uses display: block');
assert(lessonCss.includes('.review-cards-grid'), 'lesson.css defines .review-cards-grid');
assert(lessonCss.includes('.concept-cards-grid'), 'lesson.css defines .concept-cards-grid');
assert(lessonCss.includes('.normality-cards-grid'), 'lesson.css defines .normality-cards-grid');

// 3. Check Lesson 2
const l2 = fs.readFileSync(path.join(rootDir, 'modules/module-01/lesson-02.html'), 'utf8');
assert(l2.includes('distinguish the relationship of interest from confounding pathways'), 'Lesson 2: Objectives include precise confounding pathway wording');
assert(l2.includes('Explain why causal identification matters for policy decisions'), 'Lesson 2: Objectives include policy identification significance');
assert(!l2.includes('celebrated Class Size vs. Test Score empirical case study'), 'Lesson 2: Removed "celebrated Class Size" informal wording');
assert(l2.includes('This is an observed association, not yet a causal conclusion'), 'Lesson 2: Explicit association caveat included');

// 4. Check Lesson 3
const l3 = fs.readFileSync(path.join(rootDir, 'modules/module-01/lesson-03.html'), 'utf8');
assert(l3.includes('y_i = \\beta_1 + \\beta_2 x_{i2} + \\varepsilon_i'), 'Lesson 3: Regression equation formatted with y_i, beta_1, beta_2 x_{i2}, epsilon_i');
assert(l3.includes('conditional mean of \\(y\\) when \\(x_2 = 0\\)'), 'Lesson 3: Intercept beta_1 defined via conditional mean');
assert(l3.includes('change in \\(\\mathbb{E}[y \\mid x_2]\\) associated with a one-unit change in \\(x_2\\)'), 'Lesson 3: Slope coefficient defined via conditional mean change');
assert(!l3.includes('all omitted influences and measurement error'), 'Lesson 3: Disturbance does not erroneously lump all measurement error into epsilon');
assert(l3.includes('Multiplying \\(X\\) (\\(n \\times k\\)) by \\(\\beta\\) (\\(k \\times 1\\)) produces an \\(n \\times 1\\) vector'), 'Lesson 3: Expanded matrix dimensions clearly explained');

// 5. Check Lesson 4
const l4 = fs.readFileSync(path.join(rootDir, 'modules/module-01/lesson-04.html'), 'utf8');
assert(!l4.includes('<h2>1. Minimizing the Sum of Squared Residuals (SSE)</h2>\n      <h2>1.'), 'Lesson 4: No duplicate section 1 heading');
assert(l4.includes('S(b) = \\sum_{i=1}^n e_i^2'), 'Lesson 4: SSE clearly evaluated at candidate vector b');
assert(l4.includes('Candidate \\(k \\times 1\\) coefficient vector'), 'Lesson 4: Explicit definition of candidate vector b vs true beta vs OLS beta_hat');

// 6. Check Lesson 6
const l6 = fs.readFileSync(path.join(rootDir, 'modules/module-01/lesson-06.html'), 'utf8');
assert(l6.includes('concept-cards-grid'), 'Lesson 6: Uses concept-cards-grid');
assert(l6.includes('\\text{Var}(\\varepsilon_i \\mid X) = \\sigma^2'), 'Lesson 6: Homoskedasticity conditional notation');
assert(l6.includes('\\text{Cov}(\\varepsilon_i, \\varepsilon_j \\mid X) = 0'), 'Lesson 6: No autocorrelation conditional notation');
assert(l6.includes('cross-state traffic-fatality data'), 'Lesson 6: Cross-state traffic-fatality example included');
assert(l6.includes('conventional homoskedastic standard errors are invalid'), 'Lesson 6: Precise consequence on conventional standard errors (not blanket t-tests invalid)');

// 7. Check Lesson 7
const l7 = fs.readFileSync(path.join(rootDir, 'modules/module-01/lesson-07.html'), 'utf8');
assert(l7.includes('normality-cards-grid'), 'Lesson 7: Uses normality-cards-grid');
assert(!l7.includes('n < 30'), 'Lesson 7: Removed arbitrary n < 30 cutoff');
assert(l7.includes('Fixed-X View') && l7.includes('Random-X View'), 'Lesson 7: Uses Fixed-X and Random-X theoretical views');
assert(l7.includes('NORMALITY IS NOT REQUIRED FOR:'), 'Lesson 7: Balanced Normality card "NOT REQUIRED FOR"');
assert(l7.includes('NORMALITY IS USEFUL FOR:'), 'Lesson 7: Balanced Normality card "USEFUL FOR"');

// 8. Check Lesson 8
const l8 = fs.readFileSync(path.join(rootDir, 'modules/module-01/lesson-08.html'), 'utf8');
assert(l8.includes('\\frac{\\partial \\mathbb{E}[y \\mid x]}{\\partial x} = \\beta_2'), 'Lesson 8: Linear marginal effect correctly differentiated conditional mean');
assert(l8.includes('\\frac{\\partial \\mathbb{E}[y \\mid x]}{\\partial x} = \\beta_2 + 2\\beta_3 x'), 'Lesson 8: Quadratic model marginal association varies with x');
assert(l8.includes('The marginal association varies with \\(x\\)'), 'Lesson 8: Marginal association wording in quadratic model');
assert(l8.includes('100(e^{\\beta_2} - 1)\\%'), 'Lesson 8: Log-level exact percentage effect included');
assert(l8.includes('Scale Invariance'), 'Lesson 8: Log-log WHERE box includes Scale Invariance in title case');

// 9. Check Lesson 9
const l9 = fs.readFileSync(path.join(rootDir, 'modules/module-01/lesson-09.html'), 'utf8');
assert(l9.includes('\\frac{y_1 - y_0}{y_0} = \\frac{y_1}{y_0} - 1 = e^{\\beta_1} - 1'), 'Lesson 9: Relative change derived cleanly without %Δy proportion confusion');
assert(l9.includes('Exact: } 100(e^{\\beta_1} - 1)\\%'), 'Lesson 9: Exact percentage change is 100(e^{beta_1}-1)%');
assert(!l9.includes('substantially underestimates when \\(\\beta_1 > 0.10\\)'), 'Lesson 9: Removed arbitrary beta_1 > 0.10 threshold');
assert(l9.includes('Numerical Example (\\(\\beta_1 = 0.20\\))'), 'Lesson 9: Includes 0.20 numerical example (20% vs 22.14%)');
assert(l9.includes('review-cards-grid'), 'Lesson 9: Uses review-cards-grid');
assert(l9.includes('Zero Conditional Mean / Exogeneity'), 'Lesson 9: Review card 6 labeled Zero Conditional Mean / Exogeneity');

console.log(`\nVerification finished with ${totalErrors} error(s).`);
process.exit(totalErrors === 0 ? 0 : 1);
