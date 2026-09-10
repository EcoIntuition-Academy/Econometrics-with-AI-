// Find exact residuals for 8 points: x = [2, 4, 6, 8, 10, 12, 14, 16]
// b1 = 20.0, b2 = 1.80
// y_hat = 20.0 + 1.80 * x:
// x=2 => y_hat = 23.6
// x=4 => y_hat = 27.2
// x=6 => y_hat = 30.8
// x=8 => y_hat = 34.4
// x=10 => y_hat = 38.0
// x=12 => y_hat = 41.6
// x=14 => y_hat = 45.2
// x=16 => y_hat = 48.8

const target = 16.20; // 16.20 * 2 = 32.40
let best = null;
let bestDiff = 999;

for (let c1 = 2.4; c1 <= 2.9; c1 += 0.01) {
  for (let c2 = -2.5; c2 <= -1.8; c2 += 0.01) {
    for (let c3 = -2.0; c3 <= -1.4; c3 += 0.01) {
      const c4 = -(c1 + c2 + c3);
      const s = c1 * c1 + c2 * c2 + c3 * c3 + c4 * c4;
      const diff = Math.abs(s - target);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = [c1, c2, c3, c4];
      }
    }
  }
}

console.log('Best residuals half:', best.map(v => Math.round(v * 100) / 100), 'Diff:', bestDiff);

const c = best.map(v => Math.round(v * 100) / 100);
// Ensure exact zero sum
c[3] = Number((-(c[0] + c[1] + c[2])).toFixed(2));
const fullE = [c[0], c[1], c[2], c[3], c[3], c[2], c[1], c[0]];
const xVals = [2, 4, 6, 8, 10, 12, 14, 16];

const pts = xVals.map((x, i) => ({
  x,
  y: Number((20.0 + 1.80 * x + fullE[i]).toFixed(2))
}));

console.log('Points:');
console.log(JSON.stringify(pts, null, 2));

// Calculate exact OLS
const n = pts.length;
const sumX = pts.reduce((a, p) => a + p.x, 0);
const sumY = pts.reduce((a, p) => a + p.y, 0);
const xBar = sumX / n;
const yBar = sumY / n;
let sxx = 0, sxy = 0;
pts.forEach(p => {
  sxx += (p.x - xBar) ** 2;
  sxy += (p.x - xBar) * (p.y - yBar);
});
const b2_hat = sxy / sxx;
const b1_hat = yBar - b2_hat * xBar;
let sse = 0;
pts.forEach(p => {
  sse += (p.y - (b1_hat + b2_hat * p.x)) ** 2;
});

console.log(`b1_hat = ${b1_hat.toFixed(4)}, b2_hat = ${b2_hat.toFixed(4)}, optimal SSE = ${sse.toFixed(2)}`);
