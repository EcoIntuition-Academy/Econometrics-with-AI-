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

const plotLeft = 70;
const plotRight = 750;
const plotWidth = 680;
const plotTop = 40;
const plotBottom = 360;
const plotHeight = 320;
const xMin = 0, xMax = 18;
const yMin = 0, yMax = 65;

function scaleX(x) {
  return Number((plotLeft + ((x - xMin) / (xMax - xMin)) * plotWidth).toFixed(2));
}
function scaleY(y) {
  return Number((plotTop + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight).toFixed(2));
}

const b1 = 24.0;
const b2 = 1.30;

let svg = `
  <!-- Background -->
  <rect x="0" y="0" width="800" height="420" fill="#ffffff" rx="8"/>

  <!-- Grid lines -->
  <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4">
`;

[10, 20, 30, 40, 50, 60].forEach(yVal => {
  const y = scaleY(yVal);
  svg += `    <line x1="${plotLeft}" y1="${y}" x2="${plotRight}" y2="${y}"/>\n`;
});
[4, 8, 12, 16].forEach(xVal => {
  const x = scaleX(xVal);
  svg += `    <line x1="${x}" y1="${plotBottom}" x2="${x}" y2="${plotTop}"/>\n`;
});

svg += `  </g>

  <!-- Axes -->
  <line x1="${plotLeft}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="#475569" stroke-width="2"/>
  <line x1="${plotLeft}" y1="${plotBottom}" x2="${plotLeft}" y2="${plotTop}" stroke="#475569" stroke-width="2"/>

  <!-- Ticks and Tick Labels -->
  <g font-size="13" fill="#475569" font-family="system-ui, -apple-system, sans-serif">
`;

[0, 4, 8, 12, 16].forEach(val => {
  const x = scaleX(val);
  svg += `    <line x1="${x}" y1="${plotBottom}" x2="${x}" y2="${plotBottom + 6}" stroke="#475569" stroke-width="1.5"/>\n`;
  svg += `    <text x="${x}" y="${plotBottom + 22}" text-anchor="middle">${val}</text>\n`;
});

[0, 10, 20, 30, 40, 50, 60].forEach(val => {
  const y = scaleY(val);
  svg += `    <line x1="${plotLeft - 6}" y1="${y}" x2="${plotLeft}" y2="${y}" stroke="#475569" stroke-width="1.5"/>\n`;
  svg += `    <text x="${plotLeft - 10}" y="${y + 4}" text-anchor="end">${val}</text>\n`;
});

svg += `  </g>

  <!-- Axis Titles -->
  <text x="${plotRight}" y="${plotBottom + 42}" font-size="13" font-weight="700" fill="#0f172a" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">Regressor X</text>
  <text x="${plotLeft}" y="${plotTop - 14}" font-size="13" font-weight="700" fill="#0f172a" text-anchor="start" font-family="system-ui, -apple-system, sans-serif">Outcome Y</text>

  <!-- Residual Drop Lines -->
  <g stroke="#dc2626" stroke-width="2" stroke-dasharray="4,3">
`;

observations.forEach(p => {
  const yHat = b1 + b2 * p.x;
  svg += `    <line x1="${scaleX(p.x)}" y1="${scaleY(p.y)}" x2="${scaleX(p.x)}" y2="${scaleY(yHat)}"/>\n`;
});

svg += `  </g>

  <!-- Candidate Regression Line -->
  <line x1="${scaleX(0)}" y1="${scaleY(b1)}" x2="${scaleX(17.5)}" y2="${scaleY(b1 + b2 * 17.5)}" stroke="#1d4ed8" stroke-width="3.2"/>

  <!-- Scatter Observations -->
  <g fill="#0f172a" stroke="#ffffff" stroke-width="2">
`;

observations.forEach(p => {
  svg += `    <circle cx="${scaleX(p.x)}" cy="${scaleY(p.y)}" r="6"/>\n`;
});

svg += `  </g>

  <!-- In-Plot Legend -->
  <g transform="translate(${plotRight - 230}, ${plotTop + 10})" font-family="system-ui, -apple-system, sans-serif">
    <rect width="230" height="74" rx="6" fill="#ffffff" fill-opacity="0.95" stroke="#cbd5e1" stroke-width="1.2"/>
    <line x1="14" y1="18" x2="40" y2="18" stroke="#1d4ed8" stroke-width="3"/>
    <text x="48" y="22" font-size="12" font-weight="600" fill="#1e293b">Candidate: ŷ = b₁ + b₂x</text>
    <line x1="14" y1="38" x2="40" y2="38" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="48" y="42" font-size="12" font-weight="600" fill="#991b1b">Residual eᵢ = yᵢ − ŷᵢ</text>
    <circle cx="27" cy="58" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="1.5"/>
    <text x="48" y="62" font-size="12" font-weight="600" fill="#334155">Observations (xᵢ, yᵢ)</text>
  </g>
`;

console.log('SVG length:', svg.length);
console.log('Generated successfully!');
