const fs = require('fs');
const path = require('path');
const dir = 'g:/Econometrics-with-AI-/modules/module-07';
const files = ['lesson-01.html', 'lesson-02.html', 'lesson-03.html', 'lesson-04.html', 'lesson-05.html'];

for (const f of files) {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');

  // 1. Container class
  content = content.replace('<main class="lesson-content-container">', '<main class="lesson-content-area" id="mainContent">');

  // 2. Hero header block
  content = content.replace('<header class="lesson-hero">', '<div class="lesson-header-block">');
  content = content.replace('</header>\n\n    <!-- Canonical Learning Objectives Card -->', '</div>\n\n    <!-- Canonical Learning Objectives Card -->');
  content = content.replace('</header>\r\n\r\n    <!-- Canonical Learning Objectives Card -->', '</div>\r\n\r\n    <!-- Canonical Learning Objectives Card -->');

  // 3. Objectives card class
  content = content.replace('<div class="learning-objectives-card">', '<div class="objectives-card">');
  content = content.replace(
    '<h3 class="learning-objectives-title">Learning Objectives</h3>',
    '<h3 style="font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-xs); color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem;"><span class="academic-badge badge-objectives">LEARNING OBJECTIVES</span></h3>'
  );
  content = content.replace('<ul class="learning-objectives-list">', '<ul>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('Normalized structure in:', f);
}
console.log('Structure normalization complete!');
