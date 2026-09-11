const fs = require('fs');
const path = require('path');

console.log('--- RUNNING MODULE 3 COMPREHENSIVE AUDIT ---');

const baseDir = path.join(__dirname, '..');
const module3Dir = path.join(baseDir, 'modules', 'module-03');
const homepagePath = path.join(baseDir, 'index.html');
const progressPath = path.join(baseDir, 'assets', 'js', 'progress.js');
const interactionsPath = path.join(baseDir, 'assets', 'js', 'module-03-interactions.js');

let errors = [];

// 1. Check module files existence
const expectedFiles = [
  'index.html',
  'lesson-01.html',
  'lesson-02.html',
  'lesson-03.html',
  'lesson-04.html',
  'lesson-05.html',
  'lesson-06.html',
  'lesson-07.html'
];

expectedFiles.forEach(f => {
  const p = path.join(module3Dir, f);
  if (fs.existsSync(p)) {
    console.log(`✓ Found ${f}`);
  } else {
    errors.push(`Missing file: modules/module-03/${f}`);
  }
});

// 2. Check homepage link
if (fs.existsSync(homepagePath)) {
  const homeHtml = fs.readFileSync(homepagePath, 'utf8');
  if (homeHtml.includes('modules/module-03/index.html')) {
    console.log('✓ Homepage index.html links directly to Module 3');
  } else {
    errors.push('Homepage index.html does not link to modules/module-03/index.html');
  }
  if (homeHtml.includes('03 Goodness of Fit &amp; Finite-Sample OLS Properties') || homeHtml.includes('03 Goodness of Fit & Finite-Sample OLS Properties')) {
    console.log('✓ Homepage index.html has correct Module 3 title');
  } else {
    errors.push('Homepage index.html missing updated Module 3 title');
  }
}

// 3. Check progress.js
if (fs.existsSync(progressPath)) {
  const progJs = fs.readFileSync(progressPath, 'utf8');
  if (progJs.includes("'module-03': 7")) {
    console.log("✓ progress.js configures 'module-03': 7");
  } else {
    errors.push("progress.js missing 'module-03': 7 configuration");
  }
}

// 4. Check interaction script
if (fs.existsSync(interactionsPath)) {
  const intJs = fs.readFileSync(interactionsPath, 'utf8');
  console.log('✓ module-03-interactions.js exists');

  const expectedSvgs = [
    'r2LabSvg',
    'modelCompSvg',
    'fTestSvg',
    'ovbLabSvg',
    'varianceLabSvg',
    'blueLabSvg',
    'normalityTsvg'
  ];

  expectedSvgs.forEach(svgId => {
    if (intJs.includes(svgId)) {
      console.log(`✓ Interactive handler found for: #${svgId}`);
    } else {
      errors.push(`module-03-interactions.js missing handler for #${svgId}`);
    }
  });
}

// 5. Deep validation across lessons
const lessonChecks = [
  { file: 'lesson-01.html', svg: 'r2LabSvg', keyContent: ['SST', 'SSR', 'SSE', 'M_0'] },
  { file: 'lesson-02.html', svg: 'modelCompSvg', keyContent: ['Adjusted R', 'n - K', 'n - 1'] },
  { file: 'lesson-03.html', svg: 'fTestSvg', keyContent: ['F[J, n - k]', 'R_r^2', 'Unrestricted'] },
  { file: 'lesson-04.html', svg: 'ovbLabSvg', keyContent: ['b \\mid X', 'Omitted Variable Bias', 'biasCell22'] },
  { file: 'lesson-05.html', svg: 'varianceLabSvg', keyContent: ['operatorname{Var}', 'X)^{-1}', 'operatorname{SE}'] },
  { file: 'lesson-06.html', svg: 'blueLabSvg', keyContent: ['Gauss–Markov', 'BLUE', 'DD', 'Hansen', 's^2'] },
  { file: 'lesson-07.html', svg: 'normalityTsvg', keyContent: ['t_{n - k}', 'Lindeberg–Lévy', 'Lindeberg–Feller', 'Review Cards'] }
];

lessonChecks.forEach(({ file, svg, keyContent }) => {
  const fp = path.join(module3Dir, file);
  if (!fs.existsSync(fp)) return;
  const html = fs.readFileSync(fp, 'utf8');

  // MathJax check
  if (!html.includes('math-config.js') || !html.includes('tex-chtml.js')) {
    errors.push(`${file} missing centralized MathJax scripts`);
  }

  // Top nav check
  if (!html.includes('top-lesson-nav') || !html.includes('lesson-dropdown-wrapper')) {
    errors.push(`${file} missing top lesson navigation dropdown`);
  }

  // Sidebar forbidden check
  if (html.includes('lesson-sidebar') || html.includes('id="lessonSidebar"')) {
    errors.push(`${file} contains forbidden persistent sidebar`);
  }

  // SVG check
  if (svg && !html.includes(`id="${svg}"`)) {
    errors.push(`${file} missing SVG with id="${svg}"`);
  }

  // Visual explanation cards check
  const requiredCards = [
    'visual-card--seeing',
    'visual-card--notice',
    'visual-card--matters',
    'visual-card--interp',
    'visual-try-this'
  ];
  requiredCards.forEach(cls => {
    if (!html.includes(cls)) {
      errors.push(`${file} missing visual explanation card class: ${cls}`);
    }
  });

  // Key academic content check
  keyContent.forEach(kc => {
    if (!html.includes(kc)) {
      errors.push(`${file} missing expected core content: "${kc}"`);
    }
  });

  console.log(`✓ ${file}: Validated navigation, MathJax, SVG (${svg}), and study cards.`);
});

console.log('\n--- VERIFICATION SUMMARY ---');
if (errors.length === 0) {
  console.log('🎉 ALL CHECKS PASSED! Module 3 structure, equations, SVGs, and interactions are verified.');
  process.exit(0);
} else {
  console.error(`FAILED with ${errors.length} error(s):`, errors);
  process.exit(1);
}
