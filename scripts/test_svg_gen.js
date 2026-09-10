// Generate exact initial SVG markup and verify OLS calculation
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
  return plotLeft + ((x - xMin) / (xMax - xMin)) * plotWidth;
}
function scaleY(y) {
  return plotTop + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;
}

// Initial state: b1 = 24.0, b2 = 1.30
const initB1 = 24.0;
const initB2 = 1.30;
let initSSE = 0;
observations.forEach(p => {
  const yHat = initB1 + initB2 * p.x;
  initSSE += (p.y - yHat) ** 2;
});

// OLS analytical calculation
const n = observations.length;
const sumX = observations.reduce((a, p) => a + p.x, 0);
const sumY = observations.reduce((a, p) => a + p.y, 0);
const xBar = sumX / n;
const yBar = sumY / n;
let sxx = 0, sxy = 0;
observations.forEach(p => {
  sxx += (p.x - xBar) ** 2;
  sxy += (p.x - xBar) * (p.y - yBar);
});
const b2_hat = sxy / sxx;
const b1_hat = yBar - b2_hat * xBar;
let optSSE = 0;
observations.forEach(p => {
  const yHat = b1_hat + b2_hat * p.x;
  optSSE += (p.y - yHat) ** 2;
});

console.log(`Initial Imperfect: b1 = ${initB1}, b2 = ${initB2}, Current SSE = ${initSSE.toFixed(2)}`);
console.log(`Optimal OLS:       b1 = ${b1_hat.toFixed(2)}, b2 = ${b2_hat.toFixed(2)}, Optimal SSE = ${optSSE.toFixed(2)}`);
