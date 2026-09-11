const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    failed++;
  }
}

console.log('=== VERIFYING COURSE-WIDE VISUAL LEGEND FORMAT LOCK ===\n');

// 1. Check shared CSS classes
console.log('1. Checking shared CSS rules in assets/css/course.css...');
const courseCss = fs.readFileSync(path.join(repoRoot, 'assets', 'css', 'course.css'), 'utf8');
assert(courseCss.includes('.visual-legend'), 'Defines .visual-legend');
assert(courseCss.includes('.visual-legend-item'), 'Defines .visual-legend-item');
assert(courseCss.includes('.visual-legend-swatch'), 'Defines .visual-legend-swatch');
assert(courseCss.includes('.visual-legend-swatch--line'), 'Defines .visual-legend-swatch--line');
assert(courseCss.includes('.visual-legend-swatch--dashed'), 'Defines .visual-legend-swatch--dashed');
assert(courseCss.includes('.visual-legend-swatch--point'), 'Defines .visual-legend-swatch--point');
assert(courseCss.includes('.visual-legend-swatch--ref'), 'Defines .visual-legend-swatch--ref');
assert(courseCss.includes('.visual-legend-swatch--area'), 'Defines .visual-legend-swatch--area');
assert(courseCss.includes('.visual-legend-label'), 'Defines .visual-legend-label');
assert(courseCss.includes('.visual-legend-value'), 'Defines .visual-legend-value');

// 2. Check Module 6 Lesson 6.1
console.log('\n2. Checking Module 6 Lesson 6.1 (Cookie Lab)...');
const m6l1Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-06', 'lesson-01.html'), 'utf8');
const m6Js = fs.readFileSync(path.join(repoRoot, 'assets', 'js', 'module-06-interactions.js'), 'utf8');
assert(m6l1Html.includes('class="visual-legend"'), 'Lesson 6.1 has external visual-legend');
assert(m6l1Html.includes('cookieLegendEstLine'), 'Lesson 6.1 has dynamic swatch id cookieLegendEstLine');
assert(!m6Js.includes('True Sanaz (β₁ = -2.0)'), 'Lesson 6.1 JS has NO internal SVG legend text');
assert(!m6Js.includes('Estimated β̂₁ = ${data.beta1Hat'), 'Lesson 6.1 JS has NO internal SVG legend box');

// 3. Check Module 6 Lesson 6.2
console.log('\n3. Checking Module 6 Lesson 6.2 (Sampling Distribution Lab)...');
const m6l2Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-06', 'lesson-02.html'), 'utf8');
assert(m6l2Html.includes('class="visual-legend"'), 'Lesson 6.2 has external visual-legend');
assert(m6l2Html.includes('id="precLegendSeOmit"'), 'Lesson 6.2 has dynamic value id precLegendSeOmit');
assert(m6l2Html.includes('id="precLegendSeIncl"'), 'Lesson 6.2 has dynamic value id precLegendSeIncl');
assert(!m6Js.includes('Omitting X₂ (SE:'), 'Lesson 6.2 JS has NO internal SVG legend box');
assert(!m6Js.includes('Including X₂ (SE:'), 'Lesson 6.2 JS has NO internal SVG legend box');
assert(m6Js.includes("legSeOmit.textContent = `SE: ${d.seOmit.toFixed(2)}`"), 'Lesson 6.2 JS dynamically updates external SE values');

// 4. Check Module 1 Lesson 1.3
console.log('\n4. Checking Module 1 Lesson 1.3 (Regression Line Simulator)...');
const m1l3Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-01', 'lesson-03.html'), 'utf8');
const interJs = fs.readFileSync(path.join(repoRoot, 'assets', 'js', 'interactions.js'), 'utf8');
assert(m1l3Html.includes('class="visual-legend"'), 'Lesson 1.3 has external visual-legend');
assert(!interJs.includes('In-Plot Compact Legend'), 'interactions.js has NO internal in-plot legend');

// 5. Check Module 6 Lessons 6.6, 6.7, 6.8
console.log('\n5. Checking Module 6 Lessons 6.6, 6.7, 6.8...');
const m6l6Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-06', 'lesson-06.html'), 'utf8');
const m6l7Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-06', 'lesson-07.html'), 'utf8');
const m6l8Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-06', 'lesson-08.html'), 'utf8');
assert(m6l6Html.includes('class="visual-legend"'), 'Lesson 6.6 has external visual-legend');
assert(m6l7Html.includes('class="visual-legend"'), 'Lesson 6.7 has external visual-legend');
assert(m6l8Html.includes('class="visual-legend"'), 'Lesson 6.8 has external visual-legend');

// 6. Check Module 1 Lessons 1.6, 1.8
console.log('\n6. Checking Module 1 Lessons 1.6, 1.8...');
const m1l6Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-01', 'lesson-06.html'), 'utf8');
const m1l8Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-01', 'lesson-08.html'), 'utf8');
assert(m1l6Html.includes('class="visual-legend"'), 'Lesson 1.6 has external visual-legend');
assert(m1l8Html.includes('class="visual-legend"'), 'Lesson 1.8 has external visual-legend');

// 7. Check Module 2 Lesson 2.1 & Module 3 Lesson 3.1
console.log('\n7. Checking Module 2 Lesson 2.1 & Module 3 Lesson 3.1...');
const m2l1Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-02', 'lesson-01.html'), 'utf8');
const m3l1Html = fs.readFileSync(path.join(repoRoot, 'modules', 'module-03', 'lesson-01.html'), 'utf8');
assert(m2l1Html.includes('class="visual-legend"'), 'Lesson 2.1 has external visual-legend');
assert(m3l1Html.includes('class="visual-legend"'), 'Lesson 3.1 has external visual-legend');

console.log(`\n========================================`);
console.log(`PASSED CHECKS: ${passed}`);
console.log(`FAILED CHECKS: ${failed}`);
if (failed === 0) {
  console.log('ALL LEGEND CHECKS PASSED PERFECTLY! 🚀');
} else {
  process.exit(1);
}
