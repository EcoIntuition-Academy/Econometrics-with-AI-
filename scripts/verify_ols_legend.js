const fs = require('fs');

const html = fs.readFileSync('modules/module-01/lesson-04.html', 'utf8');
const css = fs.readFileSync('assets/css/lesson.css', 'utf8');
const js = fs.readFileSync('assets/js/interactions.js', 'utf8');

console.log('=== 1. HTML Verification ===');
const checks = [
  ['ols-stage-container present', html.includes('ols-stage-container')],
  ['ols-plot-wrapper present', html.includes('ols-plot-wrapper')],
  ['ols-legend-card present', html.includes('ols-legend-card')],
  ['ols-legend-header present', html.includes('ols-legend-header')],
  ['Candidate Line item present', html.includes('Candidate:') && html.includes('ols-marker-line')],
  ['Residual item present', html.includes('Residual:') && html.includes('ols-marker-residual')],
  ['Observations item present', html.includes('Observations:') && html.includes('ols-marker-point')],
  ['No in-SVG legend in HTML', !html.includes('legG') && !html.includes('fill-opacity="0.95"')]
];

let failed = 0;
for (const [desc, passed] of checks) {
  if (passed) {
    console.log(`✓ PASS: ${desc}`);
  } else {
    console.log(`✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('\n=== 2. CSS Rules Verification ===');
const cssChecks = [
  ['Stage flex container', css.includes('.ols-stage-container') && css.includes('display: flex')],
  ['Legend card layout & width', css.includes('.ols-legend-card') && css.includes('width: 220px')],
  ['Candidate line blue marker (#1d4ed8)', css.includes('.ols-marker-line') && css.includes('#1d4ed8')],
  ['Residual dashed red marker (#dc2626)', css.includes('.ols-marker-residual') && css.includes('#dc2626')],
  ['Observations dark dot marker (#0f172a)', css.includes('.ols-marker-point') && css.includes('#0f172a')],
  ['Tablet responsive order (-1) above plot', css.includes('@media (max-width: 860px)') && css.includes('order: -1')],
  ['Mobile responsive column stacking', css.includes('@media (max-width: 560px)') && css.includes('flex-direction: column')]
];

for (const [desc, passed] of cssChecks) {
  if (passed) {
    console.log(`✓ PASS: ${desc}`);
  } else {
    console.log(`✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('\n=== 3. JavaScript Non-Obstruction & Interaction Verification ===');
const jsChecks = [
  ['No in-plot SVG legend rendered dynamically', !js.includes('legG') && !js.includes('olsSvg.appendChild(legG)')],
  ['Slider B1 input event bound', js.includes("olsB1.addEventListener('input', renderOLSPlot)")],
  ['Slider B2 input event bound', js.includes("olsB2.addEventListener('input', renderOLSPlot)")],
  ['Find OLS button event bound', js.includes("btnFindOls.addEventListener('click',")]
];

for (const [desc, passed] of jsChecks) {
  if (passed) {
    console.log(`✓ PASS: ${desc}`);
  } else {
    console.log(`✗ FAIL: ${desc}`);
    failed++;
  }
}

if (failed === 0) {
  console.log('\nAll OLS Legend & Graph Placement checks PASSED perfectly!');
  process.exit(0);
} else {
  console.log(`\nVerification failed with ${failed} issue(s)`);
  process.exit(1);
}
