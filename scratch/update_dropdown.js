const fs = require('fs');
const path = require('path');

function updateDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'module-07') updateDir(full);
    } else if (f.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('Module 6: OVB') && !content.includes('Module 7: Advanced DD')) {
        const mod7Link = '<a href="../module-07/index.html" class="nav-dropdown-item">Module 7: Advanced DD &amp; Triple Differences</a>';
        
        const target = '<a href="../module-06/index.html" class="nav-dropdown-item">Module 6: OVB, Experiments &amp; DD</a>';
        const targetActive = '<a href="index.html" class="nav-dropdown-item active">Module 6: OVB, Experiments &amp; DD</a>';
        const targetInMod6 = '<a href="index.html" class="nav-dropdown-item">Module 6: OVB, Experiments &amp; DD</a>';

        if (content.includes(target)) {
          content = content.replace(target, target + '\n              ' + mod7Link);
          fs.writeFileSync(full, content, 'utf8');
          console.log('Updated dropdown in:', full);
        } else if (content.includes(targetActive)) {
          content = content.replace(targetActive, targetActive + '\n              ' + mod7Link);
          fs.writeFileSync(full, content, 'utf8');
          console.log('Updated dropdown in:', full);
        } else if (content.includes(targetInMod6)) {
          content = content.replace(targetInMod6, targetInMod6 + '\n              ' + mod7Link);
          fs.writeFileSync(full, content, 'utf8');
          console.log('Updated dropdown in:', full);
        }
      }
    }
  }
}

updateDir('g:/Econometrics-with-AI-/modules');
console.log('Dropdown update finished.');
