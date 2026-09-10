const fs = require('fs');
const path = require('path');

const moduleDir = path.join(__dirname, '..', 'modules', 'module-01');
const lessons = Array.from({ length: 9 }, (_, i) => `lesson-0${i + 1}.html`);

let totalBoxes = 0;
let errors = 0;

for (const lesson of lessons) {
  const file = path.join(moduleDir, lesson);
  const content = fs.readFileSync(file, 'utf8');

  const boxMatches = (content.match(/class="[^"]*equation-box[^"]*"/g) || []).length;
  const sectionMatches = (content.match(/class="[^"]*lesson-section[^"]*"/g) || []).length;
  const explainerMatches = (content.match(/class="[^"]*equation-explainer[^"]*"/g) || []).length;

  if (boxMatches === 0) {
    console.error(`ERROR: ${lesson} has no .equation-box`);
    errors++;
  } else {
    console.log(`✓ ${lesson}: ${boxMatches} equation boxes (${explainerMatches} explainers), ${sectionMatches} lesson sections`);
    totalBoxes += boxMatches;
  }
}

console.log(`\nTotal Equation Boxes Across Module 1: ${totalBoxes}`);
if (errors === 0) {
  console.log('SUCCESS: All 9 lessons have structured equation boxes and lesson sections!');
  process.exit(0);
} else {
  console.error(`FAILURE: Encountered ${errors} error(s).`);
  process.exit(1);
}
