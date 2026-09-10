const fs = require('fs');
const path = require('path');

console.log('--- VERIFYING VISUAL EXPLANATION CARDS ACROSS MODULE 2 ---');

const module2Dir = path.join(__dirname, '..', 'modules', 'module-02');
const lessonsWithViz = [
  'lesson-01.html',
  'lesson-02.html',
  'lesson-03.html',
  'lesson-04.html',
  'lesson-05.html',
  'lesson-06.html',
  'lesson-07.html'
];

let errors = [];

lessonsWithViz.forEach(file => {
  const filePath = path.join(module2Dir, file);
  const html = fs.readFileSync(filePath, 'utf8');

  // Must have visual-explanation-grid
  if (!html.includes('class="visual-explanation-grid"')) {
    errors.push(`${file} missing class="visual-explanation-grid"`);
  }

  // Must have visual-explanation-card
  const cardCount = (html.match(/class="visual-explanation-card /g) || []).length;
  if (cardCount !== 4) {
    errors.push(`${file} has ${cardCount} visual-explanation-cards (expected 4)`);
  }

  // Check 4 accents
  const accents = ['visual-card--seeing', 'visual-card--notice', 'visual-card--matters', 'visual-card--interp'];
  accents.forEach(acc => {
    if (!html.includes(acc)) {
      errors.push(`${file} missing accent ${acc}`);
    }
  });

  // Check title and body classes
  const titleCount = (html.match(/class="visual-explanation-title"/g) || []).length;
  if (titleCount !== 4) {
    errors.push(`${file} has ${titleCount} visual-explanation-title (expected 4)`);
  }

  const bodyCount = (html.match(/class="visual-explanation-body"/g) || []).length;
  if (bodyCount !== 4) {
    errors.push(`${file} has ${bodyCount} visual-explanation-body (expected 4)`);
  }

  // Check visual-try-this
  if (!html.includes('class="visual-try-this"')) {
    errors.push(`${file} missing class="visual-try-this"`);
  }

  console.log(`✓ ${file}: 4 cards with seeing/notice/matters/interp accents, title, body, and try-this box verified.`);
});

if (errors.length === 0) {
  console.log('\nSUCCESS: All Module 2 visual explanation cards strictly match Module 1 specifications!');
} else {
  console.error(`\nFAILED with ${errors.length} error(s):`, errors);
  process.exit(1);
}
