const fs = require('fs');
const path = require('path');

const modules = [
  { id: 'module-01', num: 1, title: 'Foundations & Regression' },
  { id: 'module-02', num: 2, title: 'Matrix Algebra & Geometry' },
  { id: 'module-03', num: 3, title: 'Finite-Sample Properties & Fit' },
  { id: 'module-04', num: 4, title: 'Asymptotic Theory & Inference' },
  { id: 'module-05', num: 5, title: 'Hypothesis Testing & Dummies' },
  { id: 'module-06', num: 6, title: 'OVB, Experiments & DD' }
];

function getCanonicalNav(modNum) {
  const dropdownItems = modules.map(m => {
    const activeClass = m.num === modNum ? ' active' : '';
    const href = m.num === modNum ? 'index.html' : `../${m.id}/index.html`;
    return `              <a href="${href}" class="nav-dropdown-item${activeClass}">Module ${m.num}: ${m.title}</a>`;
  }).join('\n');

  return `      <nav aria-label="Main Navigation">
        <ul class="nav-links" id="navLinks">
          <li><a href="../../index.html" class="nav-item-link">Home</a></li>
          <li class="nav-dropdown">
            <button class="nav-dropdown-toggle nav-item-link" type="button" aria-expanded="false" aria-haspopup="true">
              Modules <svg class="dropdown-chevron" viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>
            <div class="nav-dropdown-menu">
${dropdownItems}
            </div>
          </li>
          <li><a href="index.html" class="nav-item-link active">Module ${modNum}</a></li>
          <li><a href="../../index.html#resources" class="nav-item-link">Resources</a></li>
          <li>
            <a href="https://github.com/EcoIntuition-Academy/Econometrics-with-AI-" target="_blank" rel="noopener noreferrer" class="nav-item-link">
              GitHub
            </a>
          </li>
        </ul>
      </nav>`;
}

let updatedCount = 0;

modules.forEach(m => {
  const dir = path.join(__dirname, '..', 'modules', m.id);
  const files = fs.readdirSync(dir).filter(f => f.startsWith('lesson-') && f.endsWith('.html'));

  files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');

    const navRegex = /<nav aria-label=["']Main Navigation["']>[\s\S]*?<\/nav>/;
    if (navRegex.test(content)) {
      const canonicalNav = getCanonicalNav(m.num);
      content = content.replace(navRegex, canonicalNav);
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
    } else {
      console.warn(`WARNING: Could not find main navigation in ${filePath}`);
    }
  });
});

console.log(`Successfully normalized navbar across ${updatedCount} lesson files!`);
