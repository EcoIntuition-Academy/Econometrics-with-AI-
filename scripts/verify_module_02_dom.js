const fs = require('fs');
const path = require('path');

console.log('--- RUNNING DEEP DOM & SVG VALIDATION FOR MODULE 2 ---');

const baseDir = path.join(__dirname, '..');
const module2Dir = path.join(baseDir, 'modules', 'module-02');

const lessons = [
  { file: 'lesson-01.html', svg: 'projectionLabSvg', title: 'OLS as Orthogonal Projection' },
  { file: 'lesson-02.html', svg: 'sseBowlSvg', title: 'Deriving the Normal Equations' },
  { file: 'lesson-03.html', svg: 'operatorSvg', title: 'Projection & Residual-Maker Matrices' },
  { file: 'lesson-04.html', svg: 'balanceSvg', title: 'Residual Orthogonality & the Constant Term' },
  { file: 'lesson-05.html', svg: 'meansSvg', title: 'Means, Fitted Values & Regression Balance' },
  { file: 'lesson-06.html', svg: 'fwlSvg', title: 'The Frisch–Waugh–Lovell Theorem' },
  { file: 'lesson-07.html', svg: 'demeanSvg', title: 'Demeaning & the Covariance Form of OLS' },
  { file: 'lesson-08.html', svg: null, title: 'Orthogonal Regressors, Randomization & Module Review' }
];

let errors = [];

lessons.forEach(({ file, svg, title }) => {
  const filePath = path.join(module2Dir, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`File missing: ${file}`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');

  // Verify title
  if (!html.includes(title)) {
    errors.push(`${file} does not contain expected title "${title}"`);
  }

  // Verify MathJax config
  if (!html.includes('math-config.js') || !html.includes('tex-chtml.js')) {
    errors.push(`${file} missing MathJax script tags`);
  }

  // Verify interaction script
  if (!html.includes('module-02-interactions.js')) {
    errors.push(`${file} missing module-02-interactions.js`);
  }

  // Verify top navigation
  if (!html.includes('top-lesson-nav') || !html.includes('lesson-dropdown-wrapper')) {
    errors.push(`${file} missing top lesson navigation dropdown`);
  }

  // Verify NO sidebar
  if (html.includes('lesson-sidebar') || html.includes('id="lessonSidebar"')) {
    errors.push(`${file} has forbidden sidebar element!`);
  }

  // Verify SVG container if applicable
  if (svg) {
    if (!html.includes(`id="${svg}"`)) {
      errors.push(`${file} missing interactive SVG element with id="${svg}"`);
    }
  }

  // Verify visual cards (What you are seeing, what to notice, etc.)
  if (file !== 'lesson-08.html') {
    if (!html.includes('WHAT YOU ARE SEEING') || !html.includes('WHAT TO NOTICE') || !html.includes('WHY IT MATTERS')) {
      errors.push(`${file} missing complete Visual Card suite`);
    }
  }

  console.log(`✓ ${file}: Validated title, navigation, MathJax, SVG (${svg || 'N/A'}), and study components.`);
});

// Check Lesson 8 Quiz Solutions & Accordions
const l8 = fs.readFileSync(path.join(module2Dir, 'lesson-08.html'), 'utf8');
const quizIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
quizIds.forEach(q => {
  if (!l8.includes(`hint-${q}`) || !l8.includes(`sol-${q}`)) {
    errors.push(`Lesson 8 missing hint or solution for ${q}`);
  }
});
console.log('✓ Lesson 8: All 6 Source Quiz Hints & Full Solutions verified.');

if (errors.length === 0) {
  console.log('\nSUCCESS: All Module 2 lessons pass deep DOM and SVG validation!');
} else {
  console.error(`\nFAILED with ${errors.length} error(s):`, errors);
  process.exit(1);
}
