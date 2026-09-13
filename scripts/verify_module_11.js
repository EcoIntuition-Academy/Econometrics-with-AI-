const fs = require('fs');
const path = require('path');

const modDir = path.join(__dirname, '..', 'modules', 'module-11');
const files = [
  'index.html',
  'lesson-01.html',
  'lesson-02.html',
  'lesson-03.html',
  'lesson-04.html',
  'lesson-05.html',
  'lesson-06.html',
  'lesson-07.html'
];

let totalErrors = 0;

console.log('========================================================');
console.log('AUDITING MODULE 11 ARCHITECTURE, SCRIPTS & COMPONENTS');
console.log('========================================================\n');

files.forEach(file => {
  const filePath = path.join(modDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] Missing file: ${file}`);
    totalErrors++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const isLesson = file.startsWith('lesson-');
  let errors = [];

  // Check CSS stylesheets
  const cssList = ['variables.css', 'main.css', 'course.css', 'responsive.css'];
  if (isLesson) cssList.push('lesson.css');

  cssList.forEach(css => {
    if (!content.includes(css)) {
      errors.push(`Missing stylesheet link: ${css}`);
    }
  });

  // Check MathJax
  if (!content.includes('math-config.js')) {
    errors.push('Missing math-config.js');
  }
  if (!content.includes('MathJax-script')) {
    errors.push('Missing MathJax script');
  }

  // Check Footer
  if (!content.includes('class="site-footer"')) {
    errors.push('Missing .site-footer');
  }
  if (!content.includes('Curriculum Tiers') || !content.includes('EcoIntuition Academy')) {
    errors.push('Incomplete 3-column footer links');
  }

  // Check Placeholders
  if (/TODO|Lorem ipsum|TBD|placeholder text/i.test(content)) {
    errors.push('Contains placeholder text');
  }

  if (isLesson) {
    // Check Top Nav
    if (!content.includes('top-lesson-nav')) {
      errors.push('Missing top-lesson-nav');
    }
    if (!content.includes('lesson-dropdown-wrapper')) {
      errors.push('Missing lesson dropdown menu');
    }

    // Check Learning Objectives
    if (!content.includes('objectives-card')) {
      errors.push('Missing objectives-card');
    }

    // Check Concept Check
    if (!content.includes('quick-check-card') && !content.includes('quick-check-container')) {
      errors.push('Missing quick-check component');
    }

    // Check Takeaways
    if (!content.includes('summary-takeaways-card')) {
      errors.push('Missing summary-takeaways-card');
    }
    if (!content.includes('What You Should Now Understand')) {
      errors.push('Missing canonical takeaways title "What You Should Now Understand"');
    }

    // Check Pagination Pager
    if (!content.includes('lesson-pager')) {
      errors.push('Missing lesson-pager navigation');
    }
  } else {
    // Check Overview structure
    if (!content.includes('class="module-hero"')) errors.push('Missing .module-hero');
    if (!content.includes('class="module-actions"')) errors.push('Missing .module-actions');
    if (!content.includes('class="module-progress-card"')) errors.push('Missing .module-progress-card');
    if (!content.includes('class="module-learning-path-card"')) errors.push('Missing .module-learning-path-card');
    if (!content.includes('class="module-lessons-section"')) errors.push('Missing .module-lessons-section');

    const cardMatches = content.match(/class=["']module-lesson-card["']/g) || [];
    if (cardMatches.length !== 7) {
      errors.push(`Expected 7 lesson cards, found ${cardMatches.length}`);
    }
  }

  if (errors.length === 0) {
    console.log(`[PASS] ${file} passes all design & structural audits.`);
  } else {
    console.log(`[FAIL] ${file} had ${errors.length} issue(s):`);
    errors.forEach(e => console.log(`   - ${e}`));
    totalErrors += errors.length;
  }
});

console.log('\n========================================================');
if (totalErrors === 0) {
  console.log('ALL MODULE 11 AUDITS PASSED CLEANLY (0 errors)!');
} else {
  console.error(`AUDIT FAILED: ${totalErrors} issue(s) detected.`);
  process.exit(1);
}
console.log('========================================================');
