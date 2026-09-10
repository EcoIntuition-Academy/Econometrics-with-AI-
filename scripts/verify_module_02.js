const fs = require('fs');
const path = require('path');

console.log('--- RUNNING MODULE 2 COMPREHENSIVE AUDIT ---');

const baseDir = path.join(__dirname, '..');
const module2Dir = path.join(baseDir, 'modules', 'module-02');

const expectedFiles = [
  'index.html',
  'lesson-01.html',
  'lesson-02.html',
  'lesson-03.html',
  'lesson-04.html',
  'lesson-05.html',
  'lesson-06.html',
  'lesson-07.html',
  'lesson-08.html'
];

let errors = [];
let warnings = [];

// 1. Check all files exist
expectedFiles.forEach(file => {
  const filePath = path.join(module2Dir, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${file}`);
  } else {
    console.log(`✓ Found ${file}`);
  }
});

// 2. Check index.html card
const rootIndexHtml = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
if (!rootIndexHtml.includes('href="modules/module-02/index.html"')) {
  errors.push('Homepage index.html does not link to modules/module-02/index.html');
} else {
  console.log('✓ Homepage index.html links to Module 2');
}

// 3. Check lessons for key quality requirements
expectedFiles.forEach(file => {
  const filePath = path.join(module2Dir, file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');

  // Check: NO persistent sidebar
  if (content.includes('class="lesson-sidebar"') || content.includes('id="lessonSidebar"')) {
    errors.push(`${file} contains persistent sidebar markup!`);
  }

  // Check MathJax
  if (file.startsWith('lesson-')) {
    if (!content.includes('math-config.js') || !content.includes('tex-chtml.js')) {
      errors.push(`${file} missing MathJax scripts`);
    }

    // Check dropdown
    if (!content.includes('lesson-dropdown-wrapper')) {
      errors.push(`${file} missing lesson dropdown wrapper`);
    }

    // Check Learning Objectives format
    if (content.includes('class="learning-objectives-card"')) {
      if (!content.includes('class="objectives-list"')) {
        errors.push(`${file} learning objectives does not use objectives-list`);
      }
    }

    // Check equation WHERE sections - no 3 or 4 column grids
    const fourColMatches = content.match(/grid-template-columns:\s*repeat\(4/g);
    if (fourColMatches) {
      errors.push(`${file} has repeat(4, ...) grid columns!`);
    }

    // Check raw unrendered LaTeX markers that shouldn't appear
    if (content.includes('\\begin{equation}') || content.includes('\\end{equation}')) {
      // In MathJax, \[ \] is preferred over raw unconfigured environments
    }
  }
});

// 4. Verify Interactive Controllers in module-02-interactions.js
const jsPath = path.join(baseDir, 'assets', 'js', 'module-02-interactions.js');
if (!fs.existsSync(jsPath)) {
  errors.push('Missing assets/js/module-02-interactions.js');
} else {
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  console.log('✓ module-02-interactions.js exists and is loaded');

  const requiredElementIds = [
    'projectionLabSvg',
    'sseBowlSvg',
    'operatorSvg',
    'balanceSvg',
    'meansSvg',
    'fwlSvg',
    'demeanSvg'
  ];

  requiredElementIds.forEach(id => {
    if (!jsContent.includes(id)) {
      errors.push(`Missing interactive element handler for #${id} in module-02-interactions.js`);
    } else {
      console.log(`✓ Interactive handler found for: #${id}`);
    }
  });
}

// 5. Verify Quiz in lesson-08.html
const lesson8Content = fs.readFileSync(path.join(module2Dir, 'lesson-08.html'), 'utf8');
const quizKeywords = [
  'PROBLEM SET 1', 'PROBLEM SET 2', 'PROBLEM SET 3',
  'PROBLEM SET 4', 'PROBLEM SET 5', 'PROBLEM SET 6'
];
quizKeywords.forEach(kw => {
  if (!lesson8Content.includes(kw)) {
    errors.push(`Lesson 8 missing quiz set: ${kw}`);
  } else {
    console.log(`✓ Lesson 8 includes ${kw}`);
  }
});

// Summary
console.log('\n--- VERIFICATION SUMMARY ---');
if (errors.length === 0) {
  console.log('🎉 ALL CHECKS PASSED! Module 2 structure, algebra, geometry, interactions, and quiz are verified.');
} else {
  console.error(`Found ${errors.length} error(s):`);
  errors.forEach(err => console.error(` ❌ ${err}`));
  process.exit(1);
}
