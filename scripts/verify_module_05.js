const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const module05Dir = path.join(rootDir, 'modules', 'module-05');

const expectedLessons = [
  { file: 'index.html', isHub: true },
  { file: 'lesson-01.html', lessonNum: '01', svgId: 'hypTwoTailedSvg', prev: null, next: 'lesson-02.html' },
  { file: 'lesson-02.html', lessonNum: '02', svgId: 'powerLabSvg', prev: 'lesson-01.html', next: 'lesson-03.html' },
  { file: 'lesson-03.html', lessonNum: '03', svgId: 'restrictionBuilderSvg', prev: 'lesson-02.html', next: 'lesson-04.html' },
  { file: 'lesson-04.html', lessonNum: '04', svgId: 'fTestLossSvg', prev: 'lesson-03.html', next: 'lesson-05.html' },
  { file: 'lesson-05.html', lessonNum: '05', svgId: 'dummyGroupSvg', prev: 'lesson-04.html', next: 'lesson-06.html' },
  { file: 'lesson-06.html', lessonNum: '06', svgId: 'parallelLinesSvg', prev: 'lesson-05.html', next: 'lesson-07.html' },
  { file: 'lesson-07.html', lessonNum: '07', svgId: 'exactVsApproxSvg', prev: 'lesson-06.html', next: null }
];

const requiredVisualBoxes = [
  'WHAT YOU ARE SEEING',
  'WHAT TO NOTICE',
  'WHY IT MATTERS',
  'ECONOMETRIC INTERPRETATION',
  'TRY THIS'
];

let errors = 0;
let passes = 0;

function logPass(msg) {
  console.log(`  [PASS] ${msg}`);
  passes++;
}

function logError(msg) {
  console.error(`  [FAIL] ${msg}`);
  errors++;
}

console.log('=== MODULE 5 VERIFICATION SUITE ===\n');

expectedLessons.forEach(item => {
  const filePath = path.join(module05Dir, item.file);
  console.log(`Checking ${item.file}...`);

  if (!fs.existsSync(filePath)) {
    logError(`File does not exist: ${item.file}`);
    return;
  }
  logPass(`File exists: ${item.file}`);

  const content = fs.readFileSync(filePath, 'utf8');

  // Check DOCTYPE, viewport, stylesheets
  if (!content.includes('<!DOCTYPE html>')) logError(`${item.file} missing <!DOCTYPE html>`);
  if (!content.includes('name="viewport"')) logError(`${item.file} missing viewport meta`);
  if (!content.includes('assets/css/lesson.css') && !item.isHub) logError(`${item.file} missing lesson.css`);
  if (!content.includes('assets/js/module-05-interactions.js') && !item.isHub) logError(`${item.file} missing module-05-interactions.js`);

  // Check STRICTLY NO SIDEBAR
  if (content.includes('<aside class="sidebar"') || content.includes('<nav class="sidebar"')) {
    logError(`${item.file} contains prohibited sidebar element!`);
  } else {
    logPass(`${item.file} adheres to NO SIDEBAR rule`);
  }

  // Check Sticky Top Nav
  if (!item.isHub) {
    if (!content.includes('class="top-lesson-nav"')) {
      logError(`${item.file} missing sticky top lesson navigator`);
    } else {
      logPass(`${item.file} has sticky top lesson navigator`);
    }

    // Check SVG Lab ID
    if (item.svgId) {
      if (!content.includes(`id="${item.svgId}"`)) {
        logError(`${item.file} missing expected interactive SVG canvas id="${item.svgId}"`);
      } else {
        logPass(`${item.file} contains SVG canvas id="${item.svgId}"`);
      }
    }

    // Check 5-Box Visual Explanation Grid
    let missingBox = false;
    requiredVisualBoxes.forEach(box => {
      if (!content.includes(box)) {
        logError(`${item.file} missing visual explanation box: "${box}"`);
        missingBox = true;
      }
    });
    if (!missingBox) {
      logPass(`${item.file} contains all 5 required visual explanation cards`);
    }

    // Check Stepper Navigation
    if (item.prev && !content.includes(`href="${item.prev}"`)) {
      logError(`${item.file} missing prev link to ${item.prev}`);
    }
    if (item.next && !content.includes(`href="${item.next}"`)) {
      logError(`${item.file} missing next link to ${item.next}`);
    }

    // Check data-module and data-lesson attributes
    if (!content.includes('data-module="module-05"')) {
      logError(`${item.file} missing data-module="module-05"`);
    }
    if (!content.includes(`data-lesson="${item.lessonNum}"`)) {
      logError(`${item.file} missing data-lesson="${item.lessonNum}"`);
    }
  } else {
    // Hub page checks
    if (!content.includes('Lesson 5.1') || !content.includes('Lesson 5.7')) {
      logError(`Hub page index.html missing lessons 5.1-5.7`);
    } else {
      logPass(`Hub page index.html lists lessons 5.1 through 5.7`);
    }
  }

  console.log('');
});

// Check interaction script for all 7 SVG IDs
const scriptPath = path.join(rootDir, 'assets', 'js', 'module-05-interactions.js');
console.log('Checking assets/js/module-05-interactions.js...');
if (fs.existsSync(scriptPath)) {
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  expectedLessons.filter(l => l.svgId).forEach(l => {
    if (scriptContent.includes(`'${l.svgId}'`)) {
      logPass(`Script attaches handler for #${l.svgId}`);
    } else {
      logError(`Script missing handler for #${l.svgId}`);
    }
  });
} else {
  logError('module-05-interactions.js does not exist');
}

console.log(`\nVerification Complete: ${passes} Passed, ${errors} Errors.`);
if (errors > 0) {
  process.exit(1);
} else {
  console.log('\nALL MODULE 5 CHECKS PASSED PERFECTLY!\n');
}
