const fs = require('fs');
const path = require('path');

const moduleDir = path.join(__dirname, '..', 'modules', 'module-01');
let errors = 0;

console.log('--- Verifying Module 1 Lesson Layout & Components ---');

for (let i = 1; i <= 9; i++) {
  const numStr = String(i).padStart(2, '0');
  const filename = `lesson-${numStr}.html`;
  const filePath = path.join(moduleDir, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: Missing file ${filename}`);
    errors++;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check absence of naked stepper
  if (content.includes('lesson-stepper-bar')) {
    console.error(`ERROR in ${filename}: Found obsolete lesson-stepper-bar in markup!`);
    errors++;
  }

  // 2. Check top navigation structure
  if (!content.includes('class="top-lesson-nav"') || !content.includes('top-lesson-nav-inner')) {
    console.error(`ERROR in ${filename}: Missing top-lesson-nav or top-lesson-nav-inner!`);
    errors++;
  }

  if (!content.includes('class="top-nav-left"') || !content.includes('class="top-nav-right"')) {
    console.error(`ERROR in ${filename}: Missing two-column top navigation structure!`);
    errors++;
  }

  // 3. Check dropdown wrapper and menu
  if (!content.includes('class="lesson-dropdown-wrapper"') || !content.includes('class="lesson-dropdown-toggle"')) {
    console.error(`ERROR in ${filename}: Missing lesson-dropdown-wrapper or toggle!`);
    errors++;
  }

  if (!content.includes('class="lesson-dropdown-menu"')) {
    console.error(`ERROR in ${filename}: Missing lesson-dropdown-menu!`);
    errors++;
  }

  // Count dropdown items (should have all 9 lessons)
  const dropdownItemCount = (content.match(/class="dropdown-item/g) || []).length;
  if (dropdownItemCount !== 9) {
    console.error(`ERROR in ${filename}: Expected 9 dropdown items, found ${dropdownItemCount}!`);
    errors++;
  }

  // 4. Check bottom pagination
  if (!content.includes('class="lesson-pagination"')) {
    console.error(`ERROR in ${filename}: Missing lesson-pagination component!`);
    errors++;
  }

  // 5. Check math config intact
  if (!content.includes('assets/js/math-config.js') || !content.includes('tex-chtml.js')) {
    console.error(`ERROR in ${filename}: MathJax scripts missing or damaged!`);
    errors++;
  }

  console.log(`✓ ${filename}: Verified (No stepper, clean top nav, 9 dropdown items, clean pagination, MathJax ready)`);
}

// Check index.html in module-01
const indexPath = path.join(moduleDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const rowCount = (indexContent.match(/class="module-lesson-row"/g) || []).length;
  if (rowCount !== 9) {
    console.error(`ERROR in index.html: Expected 9 module-lesson-row items, found ${rowCount}!`);
    errors++;
  } else {
    console.log(`✓ index.html: Verified (9 module-lesson-row cards)`);
  }
}

console.log(`\nVerification completed with ${errors} error(s).`);
process.exit(errors === 0 ? 0 : 1);
