const fs = require('fs');

const content = fs.readFileSync('modules/module-01/lesson-03.html', 'utf8');

const checks = [
  'matrix-dimensions-card',
  'matrix-table-wrap',
  'matrix-table',
  'matrix-symbol',
  'matrix-dimension',
  'dimension-intuition',
  'individual-observation-section',
  'Matrix Dimensions Breakdown',
  'Object',
  'Dimensions',
  'Meaning',
  '\\underbrace{X}_{(n \\times k)}',
  'y_i = x_i\' \\beta + \\varepsilon_i'
];

let failed = 0;
for (const c of checks) {
  if (content.includes(c)) {
    console.log('✓ PASS: ' + c);
  } else {
    console.log('✗ FAIL: ' + c);
    failed++;
  }
}

// Verify that awkward "Matrix / Vector" is no longer in lesson-03
if (content.includes('Matrix / Vector')) {
  console.log('✗ FAIL: Found awkward "Matrix / Vector" in content');
  failed++;
} else {
  console.log('✓ PASS: No awkward "Matrix / Vector"');
}

if (failed === 0) {
  console.log('\nAll Matrix Dimensions Breakdown checks PASSED successfully!');
} else {
  process.exit(1);
}
