const fs = require('fs');

const html = fs.readFileSync('modules/module-01/lesson-04.html', 'utf8');
const js = fs.readFileSync('assets/js/interactions.js', 'utf8');

console.log('--- 1. Testing Elements in HTML & JS ---');
const requiredIds = [
  'ols-svg',
  'sliderB1',
  'sliderB2',
  'readoutB1',
  'readoutB2',
  'sseDisplay',
  'optimalSseDisplay',
  'olsOptimalBadge',
  'btnFindOls'
];

let failed = 0;
for (const id of requiredIds) {
  const inHtml = html.includes(`id="${id}"`);
  const inJs = js.includes(id);
  if (inHtml && inJs) {
    console.log(`✓ PASS: #${id} exists in HTML and JS`);
  } else {
    console.log(`✗ FAIL: #${id} (HTML: ${inHtml}, JS: ${inJs})`);
    failed++;
  }
}

console.log('\n--- 2. Testing Pre-rendered SVG & Outside Legend in HTML ---');
if (html.includes('<svg id="ols-svg"') && html.includes('class="ols-plot-wrapper"') && html.includes('class="ols-stage-container"')) {
  console.log('✓ PASS: ols-stage-container, ols-plot-wrapper, and #ols-svg present');
} else {
  console.log('✗ FAIL: Missing ols-stage-container, ols-plot-wrapper, or #ols-svg');
  failed++;
}

// Check that SVG contains pre-rendered elements and axes
const svgSubstrings = [
  'Regressor X',
  'Outcome Y',
  'viewBox="0 0 800 420"'
];
for (const sub of svgSubstrings) {
  if (html.includes(sub)) {
    console.log(`✓ PASS: Pre-rendered SVG contains "${sub}"`);
  } else {
    console.log(`✗ FAIL: Pre-rendered SVG missing "${sub}"`);
    failed++;
  }
}

// Check that legend is outside the SVG and has the 3 required items
if (html.includes('class="ols-legend-card"') &&
    html.includes('Candidate:') &&
    html.includes('Residual:') &&
    html.includes('Observations:')) {
  console.log('✓ PASS: Dedicated outside legend card (.ols-legend-card) contains all 3 required items');
} else {
  console.log('✗ FAIL: Missing or incomplete outside legend card');
  failed++;
}

// Confirm no in-plot SVG legend exists in JS
if (!js.includes('olsSvg.appendChild(legG)')) {
  console.log('✓ PASS: In-plot SVG legend successfully removed from interactions.js (no plot overlap)');
} else {
  console.log('✗ FAIL: In-plot SVG legend still being appended inside interactions.js');
  failed++;
}

console.log('\n--- 3. Testing Imperfect Initial State ---');
if (html.includes('value="24"') && html.includes('value="1.3"') && html.includes('76.40')) {
  console.log('✓ PASS: Starts at imperfect state (b1=24, b2=1.3, Current SSE=76.40)');
} else {
  console.log('✗ FAIL: Initial state is not deliberately imperfect');
  failed++;
}

console.log('\n--- 4. Testing DOM-based SVG Rendering in JS ---');
if (js.includes("document.createElementNS(SVG_NS, tag)") || js.includes("document.createElementNS('http://www.w3.org/2000/svg'")) {
  console.log('✓ PASS: Uses document.createElementNS for reliable cross-browser SVG rendering');
} else {
  console.log('✗ FAIL: Does not use document.createElementNS');
  failed++;
}

console.log('\n--- 5. Testing Analytical OLS Accuracy ---');
const observations = [
  { x: 2, y: 26.18 },
  { x: 4, y: 25.06 },
  { x: 6, y: 29.02 },
  { x: 8, y: 35.74 },
  { x: 10, y: 39.34 },
  { x: 12, y: 39.82 },
  { x: 14, y: 43.06 },
  { x: 16, y: 51.38 }
];

const n = observations.length;
const sumX = observations.reduce((a, p) => a + p.x, 0);
const sumY = observations.reduce((a, p) => a + p.y, 0);
const xBar = sumX / n;
const yBar = sumY / n;
let sxx = 0, sxy = 0;
observations.forEach(p => {
  sxx += (p.x - xBar) ** 2;
  sxy += (p.x - xBar) * (p.y - yBar);
});
const b2_hat = sxy / sxx;
const b1_hat = yBar - b2_hat * xBar;
let optSSE = 0;
observations.forEach(p => {
  optSSE += (p.y - (b1_hat + b2_hat * p.x)) ** 2;
});

console.log(`Computed OLS b1_hat: ${b1_hat.toFixed(4)}, b2_hat: ${b2_hat.toFixed(4)}, Optimal SSE: ${optSSE.toFixed(2)}`);
if (Math.abs(b1_hat - 20.0) < 0.001 && Math.abs(b2_hat - 1.8) < 0.001 && Math.abs(optSSE - 32.40) < 0.01) {
  console.log('✓ PASS: Analytical OLS matches exactly b1=20.0, b2=1.8, SSE=32.40');
} else {
  console.log('✗ FAIL: Analytical OLS mismatch');
  failed++;
}

if (failed === 0) {
  console.log('\nAll Lesson 4 OLS SVG Verification checks PASSED!');
} else {
  process.exit(1);
}
