const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '..', 'modules');
const jsDir = path.join(__dirname, '..', 'assets', 'js');

// Load all JS files
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
const jsContents = {};
for (const f of jsFiles) {
  jsContents[f] = fs.readFileSync(path.join(jsDir, f), 'utf8');
}

for (let m = 1; m <= 6; m++) {
  const mFolder = path.join(modulesDir, 'module-' + String(m).padStart(2, '0'));
  if (!fs.existsSync(mFolder)) continue;
  const files = fs.readdirSync(mFolder).filter(f => f.startsWith('lesson-') && f.endsWith('.html'));
  for (const f of files) {
    const html = fs.readFileSync(path.join(mFolder, f), 'utf8');
    const svgMatches = [...html.matchAll(/<svg[^>]*id=["']([^"']+)["'][^>]*>/g)]
      .map(m => m[1])
      .filter(id => !id.includes('icon') && !id.includes('theme') && !id.includes('chevron'));

    if (svgMatches.length === 0) continue;

    for (const svgId of svgMatches) {
      // Check if html has an external legend near svgId
      const svgIndex = html.indexOf(`id="${svgId}"`) !== -1 ? html.indexOf(`id="${svgId}"`) : html.indexOf(`id='${svgId}'`);
      const surroundingHtml = html.substring(Math.max(0, svgIndex - 1200), svgIndex);
      const hasHtmlLegend = /class=["'][^"']*(?:legend|swatch)[^"']*["']/i.test(surroundingHtml);

      // Check JS code for this svgId
      let foundInJs = [];
      for (const [jsFile, content] of Object.entries(jsContents)) {
        if (content.includes(svgId)) {
          // Look for legend or in-plot box near svgId in this js file
          const idx = content.indexOf(svgId);
          // Look at function containing idx (approx 2500 chars after)
          const chunk = content.substring(idx, idx + 2500);
          const hasInternalLegend = /legend|translate\([^)]*\)[^<]*<rect/i.test(chunk);
          foundInJs.push({ jsFile, hasInternalLegend });
        }
      }

      console.log(`M${m} ${f} [${svgId}]: HTML_Legend=${hasHtmlLegend} | JS=${JSON.stringify(foundInJs)}`);
    }
  }
}
