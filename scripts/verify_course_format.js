const fs = require('fs');
const path = require('path');

const modules = [
  { id: 'module-01', num: 1, title: 'Econometrics Fundamentals & Linear Regression', lessons: 9 },
  { id: 'module-02', num: 2, title: 'OLS Geometry, Matrix Algebra & Regression Mechanics', lessons: 8 },
  { id: 'module-03', num: 3, title: 'Goodness of Fit & Finite-Sample OLS Properties', lessons: 7 },
  { id: 'module-04', num: 4, title: 'Large-Sample Theory, Asymptotic Inference & Nonlinear Functions', lessons: 8 },
  { id: 'module-05', num: 5, title: 'Hypothesis Testing, Linear Restrictions & Dummy Variables', lessons: 7 },
  { id: 'module-06', num: 6, title: 'Omitted Variable Bias, Randomized Experiments & Difference-in-Differences', lessons: 8 },
  { id: 'module-07', num: 7, title: 'Advanced Difference-in-Differences: DDD, Triple Interactions & Controlled Comparisons', lessons: 5 },
  { id: 'module-08', num: 8, title: 'Non-Spherical Errors, Robust Inference & Efficient Estimation', lessons: 6 },
  { id: 'module-09', num: 9, title: 'Time-Ordered Data, Autocorrelation & HAC Inference', lessons: 5 },
  { id: 'module-10', num: 10, title: 'Panel Data II: First Differences, Cluster-Robust Inference & the Hausman Test', lessons: 5 },
  { id: 'module-11', num: 11, title: 'Instrumental Variables & Two-Stage Least Squares', lessons: 7 },
  { id: 'module-12', num: 12, title: 'IV Diagnostics, Weak Instruments & Measurement Error', lessons: 6 },
  { id: 'module-14', num: 14, title: 'Field Experiments II: Estimation, Compliance & LATE', lessons: 6 },
  { id: 'module-15', num: 15, title: 'Regression Discontinuity Designs', lessons: 6 },
  { id: 'module-16', num: 16, title: 'Binary Choice Models & Maximum Likelihood', lessons: 6 },
  { id: 'module-17', num: 17, title: 'Hypothesis, Specification Tests & Generalized Method of Moments', lessons: 6 },
  { id: 'module-18', num: 18, title: 'Multinomial & Conditional Logit Models', lessons: 5 }
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

console.log('=== VERIFYING COURSE-WIDE FORMAT LOCK (MODULES 1–6) ===\n');

modules.forEach(m => {
  console.log(`Checking ${m.id} (${m.title})...`);
  const indexPath = path.join(__dirname, '..', 'modules', m.id, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');

  // 1. Structure & Section Order
  const posNav = content.indexOf('class="site-header"');
  const posHero = content.indexOf('class="module-hero"');
  const posActions = content.indexOf('class="module-actions"');
  const posProgress = content.indexOf('class="module-progress-card"');
  const posPath = content.indexOf('class="module-learning-path-card"');
  const posLessons = content.indexOf('class="module-lessons-section"');
  const posFooter = content.indexOf('class="site-footer"');

  check('Global navbar present', posNav !== -1);
  check('Module hero present', posHero !== -1);
  check('Module action buttons present', posActions !== -1);
  check('Module progress card present', posProgress !== -1);
  check('Module learning path card present', posPath !== -1);
  check('Module lessons section present', posLessons !== -1);
  check('Course footer present', posFooter !== -1);

  check('Canonical Section Order (Nav -> Hero -> Actions -> Progress -> Path -> Lessons -> Footer)',
    posNav < posHero &&
    posHero < posActions &&
    posActions < posProgress &&
    posProgress < posPath &&
    posPath < posLessons &&
    posLessons < posFooter
  );

  // 2. Canonical Learning Path Heading
  const hasLearningPathHeading = content.includes('MODULE LEARNING PATH');
  check('Heading is strictly "MODULE LEARNING PATH"', hasLearningPathHeading);

  // 3. Navbar Dropdown
  const hasDropdown = content.includes('class="nav-dropdown"');
  const hasDropdownToggle = content.includes('class="nav-dropdown-toggle');
  const hasDropdownMenu = content.includes('class="nav-dropdown-menu"');
  check('Navbar has scalable Modules dropdown system', hasDropdown && hasDropdownToggle && hasDropdownMenu);

  // 4. Single-Column Lesson Cards (No 2-column grid)
  const hasGrid = content.includes('grid-template-columns: repeat(auto-fill');
  check('Strictly NO two-column lesson grid', !hasGrid);

  const cardMatches = content.match(/class=["']module-lesson-card["']/g) || [];
  check(`Lesson card count matches expected (${cardMatches.length} / ${m.lessons})`, cardMatches.length === m.lessons);

  // 5. Button Text Standardized
  const enterLessonMatches = content.match(/Enter Lesson →/g) || [];
  check(`All lesson cards use "Enter Lesson →" (${enterLessonMatches.length} / ${m.lessons})`, enterLessonMatches.length === m.lessons);

  // 6. Badges Group
  const badgeNumMatches = content.match(/class=["']badge badge-num["']/g) || [];
  const badgeCatMatches = content.match(/class=["']badge badge-cat["']/g) || [];
  check(`All cards have badge-num (${badgeNumMatches.length} / ${m.lessons})`, badgeNumMatches.length === m.lessons);
  check(`All cards have badge-cat (${badgeCatMatches.length} / ${m.lessons})`, badgeCatMatches.length === m.lessons);

  // 7. No raw equations inside card descriptions
  const cardDescSection = content.substring(posLessons, posFooter);
  const hasRawLatexInCards = /\\mathbb\{E\}|\\hat\{\\beta\}|\\sum_|\\frac\{/.test(cardDescSection);
  check('No bulky raw LaTeX in overview card descriptions', !hasRawLatexInCards);

  console.log('');
});

console.log('--- SUMMARY ---');
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);

if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('\nCOURSE-WIDE FORMAT LOCK VERIFIED 100%! 🚀');
}
