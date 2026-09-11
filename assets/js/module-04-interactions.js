/**
 * EcoIntuition Academy — Econometrics with AI
 * Module 4 Interactive Visualizations Controller
 * 
 * Includes:
 * 1. Lesson 4.1: Convergence in Probability Lab (#convergenceSvg)
 * 2. Lesson 4.2: Consistency of OLS Sampling Distribution (#consistencySvg)
 * 3. Lesson 4.3: Asymptotic Normality & CLT Lab (#asyNormalitySvg)
 * 4. Lesson 4.4: CAN Estimators & Asymptotic Efficiency (#efficiencySvg)
 * 5. Lesson 4.5: Large-Sample Hypothesis Testing & Normal Curve (#hypothesisTestSvg)
 * 6. Lesson 4.6: Delta Method & Tangent-Line Local Linearization (#deltaMethodSvg)
 * 7. Lesson 4.7: Delta Method Worked Example Propagation (#deltaWorkedSvg)
 * 8. Lesson 4.8: Wald Test & Chi-Square Distribution Explorer (#waldTestSvg)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper: Normal PDF
  function normalPdf(x, mu, sigma) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  }

  // Helper: Chi-Square PDF with df = 1: f(x) = (1 / sqrt(2*pi*x)) * exp(-x/2) for x > 0
  function chiSquare1Pdf(x) {
    if (x <= 0.0001) return 2.5; // Cap asymptote for clean SVG rendering
    const val = (1 / Math.sqrt(2 * Math.PI * x)) * Math.exp(-x / 2);
    return Math.min(val, 2.5);
  }

  // =========================================================================
  // 1. LESSON 4.1: CONVERGENCE IN PROBABILITY (#convergenceSvg)
  // =========================================================================
  const convSvg = document.getElementById('convergenceSvg');
  if (convSvg) {
    const sliderN = document.getElementById('convSliderN');
    const readoutN = document.getElementById('convReadoutN');
    const readoutProb = document.getElementById('convReadoutProb');
    const btnEps1 = document.getElementById('convEps05');
    const btnEps2 = document.getElementById('convEps10');

    let currentEps = 0.5;
    const c = 5.0; // Target parameter c

    // Available sample sizes: 25, 50, 100, 250, 500, 1000
    const nSteps = [25, 50, 100, 250, 500, 1000];

    function getStdDev(n) {
      // Deterministic standard deviation scaling with 1 / sqrt(n)
      return 2.5 / Math.sqrt(n);
    }

    function renderConvergence() {
      const idx = sliderN ? parseInt(sliderN.value, 10) : 2;
      const n = nSteps[idx] || 100;
      const sd = getStdDev(n);

      if (readoutN) readoutN.textContent = n;

      // Analytical tail probability Pr(|X - c| > eps) for N(c, sd^2)
      // Pr(|Z| > eps / sd) = 2 * (1 - Phi(eps / sd))
      const z = currentEps / sd;
      // Approximation for standard normal CDF upper tail
      function normUpperTail(val) {
        if (val > 6) return 0.00001;
        const b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
        const p = 0.2316419;
        const t = 1.0 / (1.0 + p * val);
        const zPdf = Math.exp(-0.5 * val * val) / Math.sqrt(2 * Math.PI);
        return zPdf * (b1 * t + b2 * Math.pow(t, 2) + b3 * Math.pow(t, 3) + b4 * Math.pow(t, 4) + b5 * Math.pow(t, 5));
      }

      const tailProb = Math.min(1.0, 2 * normUpperTail(Math.abs(z)));
      if (readoutProb) readoutProb.textContent = tailProb < 0.001 ? '< 0.001' : tailProb.toFixed(3);

      // SVG coordinates: 540 x 300
      const padL = 50, padR = 30, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = 2.0, maxX = 8.0;
      const maxY = 5.6; // Peak height for n = 1000 (normal peak ~5.05)

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - (Math.min(y, maxY) / maxY) * plotH; }

      let svg = '';

      // Grid & Axes
      for (let x = 2; x <= 8; x += 1) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        if (x === c) {
          svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">c = 5.0 (Target)</text>`;
        } else {
          svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x}</text>`;
        }
      }

      // Epsilon Tolerance Interval [c - eps, c + eps]
      const xLeftEps = toX(c - currentEps);
      const xRightEps = toX(c + currentEps);
      const yBottom = toY(0);

      // Shaded central tolerance band [c - eps, c + eps]
      svg += `<rect x="${xLeftEps}" y="${padT}" width="${xRightEps - xLeftEps}" height="${plotH}" fill="rgba(37, 99, 235, 0.08)"/>`;
      svg += `<line x1="${xLeftEps}" y1="${padT}" x2="${xLeftEps}" y2="${padT + plotH}" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      svg += `<line x1="${xRightEps}" y1="${padT}" x2="${xRightEps}" y2="${padT + plotH}" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4 3"/>`;

      // Epsilon Labels (anchored outward from boundary lines to prevent collision)
      svg += `<text x="${xLeftEps - 6}" y="${padT - 8}" font-size="10" font-weight="700" fill="#2563eb" text-anchor="end">c - ε (${(c - currentEps).toFixed(1)})</text>`;
      svg += `<text x="${xRightEps + 6}" y="${padT - 8}" font-size="10" font-weight="700" fill="#2563eb" text-anchor="start">c + ε (${(c + currentEps).toFixed(1)})</text>`;

      // Target parameter vertical line at c
      const sxC = toX(c);
      svg += `<line x1="${sxC}" y1="${padT}" x2="${sxC}" y2="${padT + plotH}" stroke="#0f172a" stroke-width="2"/>`;

      // Build Sampling Curve & Tail Polygon
      const step = 0.04;
      let leftTailPoints = `${toX(minX)},${yBottom} `;
      let rightTailPoints = '';
      let curvePath = '';

      for (let x = minX; x <= maxX; x += step) {
        const y = normalPdf(x, c, sd);
        const sx = toX(x);
        const sy = toY(y);

        if (x === minX) curvePath += `M ${sx} ${sy} `;
        else curvePath += `L ${sx} ${sy} `;

        if (x <= c - currentEps) {
          leftTailPoints += `${sx},${sy} `;
        }
        if (x >= c + currentEps) {
          if (rightTailPoints === '') rightTailPoints += `${sx},${yBottom} `;
          rightTailPoints += `${sx},${sy} `;
        }
      }
      leftTailPoints += `${toX(c - currentEps)},${yBottom}`;
      rightTailPoints += `${toX(maxX)},${yBottom}`;

      // Rejection / Violation Region (Outside Epsilon) Shading
      svg += `<polygon points="${leftTailPoints}" fill="rgba(239, 68, 68, 0.4)"/>`;
      svg += `<polygon points="${rightTailPoints}" fill="rgba(239, 68, 68, 0.4)"/>`;

      // Main distribution curve
      svg += `<path d="${curvePath}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      // Labels on tail probability with pill background
      if (tailProb > 0.02) {
        const tx = toX(minX + 0.4);
        const ty = toY(0.35);
        svg += `<rect x="${tx - 4}" y="${ty - 11}" width="78" height="15" fill="rgba(255, 255, 255, 0.9)" rx="3"/>`;
        svg += `<text x="${tx}" y="${ty}" font-size="10" font-weight="700" fill="#dc2626">|x_n - c| &gt; ε</text>`;
      }

      convSvg.innerHTML = svg;
    }

    if (sliderN) sliderN.addEventListener('input', renderConvergence);
    if (btnEps1) {
      btnEps1.addEventListener('click', () => {
        currentEps = 0.5;
        btnEps1.classList.add('active');
        if (btnEps2) btnEps2.classList.remove('active');
        renderConvergence();
      });
    }
    if (btnEps2) {
      btnEps2.addEventListener('click', () => {
        currentEps = 1.0;
        btnEps2.classList.add('active');
        if (btnEps1) btnEps1.classList.remove('active');
        renderConvergence();
      });
    }

    renderConvergence();
  }

  // =========================================================================
  // 2. LESSON 4.2: CONSISTENCY OF OLS SAMPLING DISTRIBUTION (#consistencySvg)
  // =========================================================================
  const consistSvg = document.getElementById('consistencySvg');
  if (consistSvg) {
    const btnN30 = document.getElementById('consistN30');
    const btnN150 = document.getElementById('consistN150');
    const btnN1000 = document.getElementById('consistN1000');
    const readoutN = document.getElementById('consistReadoutN');
    const readoutVar = document.getElementById('consistReadoutVar');
    const readoutBand = document.getElementById('consistReadoutBand');

    let currentN = 150;
    const trueBeta = 2.5;
    const sigmaSq = 4.0;
    const qInv = 1.25; // Asymptotic variance factor sigma^2 * Q^-1

    function renderConsistency() {
      if (readoutN) readoutN.textContent = currentN;
      const asyVar = (sigmaSq * qInv) / currentN;
      const sd = Math.sqrt(asyVar);

      if (readoutVar) readoutVar.textContent = asyVar.toFixed(4);
      if (readoutBand) readoutBand.textContent = `[${(trueBeta - 1.96 * sd).toFixed(3)}, ${(trueBeta + 1.96 * sd).toFixed(3)}]`;

      const padL = 50, padR = 30, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = 1.0, maxX = 4.0;
      const maxY = 6.5;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - (y / maxY) * plotH; }

      let svg = '';

      // Grid
      for (let x = 1.0; x <= 4.0; x += 0.5) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        if (Math.abs(x - trueBeta) < 0.05) {
          svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">β = ${trueBeta.toFixed(1)} (True Value)</text>`;
        } else {
          svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x.toFixed(1)}</text>`;
        }
      }

      // True beta line
      const sxBeta = toX(trueBeta);
      svg += `<line x1="${sxBeta}" y1="${padT}" x2="${sxBeta}" y2="${padT + plotH}" stroke="#0f172a" stroke-width="2"/>`;

      // 95% Confidence / Spread Band
      const left95 = toX(trueBeta - 1.96 * sd);
      const right95 = toX(trueBeta + 1.96 * sd);
      svg += `<rect x="${left95}" y="${padT}" width="${Math.max(2, right95 - left95)}" height="${plotH}" fill="rgba(16, 185, 129, 0.12)"/>`;

      // Normal curve for current n
      let curvePath = '';
      let fillPoly = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= maxX; x += 0.02) {
        const y = normalPdf(x, trueBeta, sd);
        const sx = toX(x);
        const sy = toY(Math.min(y, maxY));
        if (x === minX) curvePath += `M ${sx} ${sy} `;
        else curvePath += `L ${sx} ${sy} `;
        fillPoly += `${sx},${sy} `;
      }
      fillPoly += `${toX(maxX)},${toY(0)}`;

      svg += `<polygon points="${fillPoly}" fill="rgba(37, 99, 235, 0.18)"/>`;
      svg += `<path d="${curvePath}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      consistSvg.innerHTML = svg;
    }

    if (btnN30) {
      btnN30.addEventListener('click', () => {
        currentN = 30;
        btnN30.classList.add('active');
        if (btnN150) btnN150.classList.remove('active');
        if (btnN1000) btnN1000.classList.remove('active');
        renderConsistency();
      });
    }
    if (btnN150) {
      btnN150.addEventListener('click', () => {
        currentN = 150;
        btnN150.classList.add('active');
        if (btnN30) btnN30.classList.remove('active');
        if (btnN1000) btnN1000.classList.remove('active');
        renderConsistency();
      });
    }
    if (btnN1000) {
      btnN1000.addEventListener('click', () => {
        currentN = 1000;
        btnN1000.classList.add('active');
        if (btnN30) btnN30.classList.remove('active');
        if (btnN150) btnN150.classList.remove('active');
        renderConsistency();
      });
    }

    renderConsistency();
  }

  // =========================================================================
  // 3. LESSON 4.3: ASYMPTOTIC NORMALITY & CLT LAB (#asyNormalitySvg)
  // =========================================================================
  const asySvg = document.getElementById('asyNormalitySvg');
  if (asySvg) {
    const btnErrBimodal = document.getElementById('asyDistBimodal');
    const btnErrUniform = document.getElementById('asyDistUniform');
    const btnErrChi = document.getElementById('asyDistChi');
    const sliderN = document.getElementById('asySliderN');
    const readoutN = document.getElementById('asyReadoutN');

    let distType = 'bimodal';

    function renderAsymptoticNormality() {
      const n = sliderN ? parseInt(sliderN.value, 10) : 50;
      if (readoutN) readoutN.textContent = n;

      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      // Two panels: Left = Error Distribution; Right = Standardized Estimator Distribution
      const panelW = (plotW - 30) / 2;

      let svg = '';

      // Left Panel: True disturbance distribution
      svg += `<text x="${padL + panelW / 2}" y="${padT - 10}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">Error Distribution (ε_i) [Non-Normal]</text>`;
      svg += `<rect x="${padL}" y="${padT}" width="${panelW}" height="${plotH}" fill="var(--color-bg, #f8fafc)" stroke="var(--border-subtle, #e2e8f0)"/>`;

      // Draw non-normal error shape
      let errPath = '';
      for (let i = 0; i <= panelW; i += 2) {
        const xRel = (i / panelW) * 6 - 3; // -3 to +3
        let yVal = 0;
        if (distType === 'bimodal') {
          yVal = 0.5 * normalPdf(xRel, -1.2, 0.6) + 0.5 * normalPdf(xRel, 1.2, 0.6);
        } else if (distType === 'uniform') {
          yVal = (xRel >= -1.73 && xRel <= 1.73) ? 0.288 : 0.01;
        } else {
          // Chi-square like skewed
          const xShift = xRel + 2.0;
          yVal = xShift > 0 ? (Math.pow(xShift, 1.5) * Math.exp(-xShift)) * 0.9 : 0;
        }
        const sy = padT + plotH - (yVal / 0.8) * plotH;
        if (i === 0) errPath += `M ${padL + i} ${sy} `;
        else errPath += `L ${padL + i} ${sy} `;
      }
      svg += `<path d="${errPath}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>`;

      // Right Panel: Standardized Estimator Distribution as n grows
      const rightL = padL + panelW + 30;
      svg += `<text x="${rightL + panelW / 2}" y="${padT - 10}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">Standardized Estimator: √n(β̂ - β)</text>`;
      svg += `<rect x="${rightL}" y="${padT}" width="${panelW}" height="${plotH}" fill="var(--color-bg, #f8fafc)" stroke="var(--border-subtle, #e2e8f0)"/>`;

      // Benchmark Standard Normal curve (dashed blue)
      let normPath = '';
      for (let i = 0; i <= panelW; i += 2) {
        const z = (i / panelW) * 6 - 3;
        const normY = normalPdf(z, 0, 1);
        const sy = padT + plotH - (normY / 0.45) * plotH;
        if (i === 0) normPath += `M ${rightL + i} ${sy} `;
        else normPath += `L ${rightL + i} ${sy} `;
      }
      svg += `<path d="${normPath}" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3"/>`;

      // Finite n approximated shape (Edgeworth/blend toward normal)
      const blend = Math.min(1.0, Math.sqrt(n) / 10); // 0 at small n, 1 at n >= 100
      let blendPath = '';
      let blendPoly = `${rightL},${padT + plotH} `;

      for (let i = 0; i <= panelW; i += 2) {
        const z = (i / panelW) * 6 - 3;
        let baseErr = 0;
        if (distType === 'bimodal') {
          baseErr = 0.5 * normalPdf(z, -1.2, 0.6) + 0.5 * normalPdf(z, 1.2, 0.6);
        } else if (distType === 'uniform') {
          baseErr = (z >= -1.73 && z <= 1.73) ? 0.288 : 0.01;
        } else {
          const zShift = z + 2.0;
          baseErr = zShift > 0 ? (Math.pow(zShift, 1.5) * Math.exp(-zShift)) * 0.9 : 0;
        }
        const normY = normalPdf(z, 0, 1);
        const combinedY = (1 - blend) * baseErr + blend * normY;
        const sy = padT + plotH - (combinedY / 0.45) * plotH;
        if (i === 0) blendPath += `M ${rightL + i} ${sy} `;
        else blendPath += `L ${rightL + i} ${sy} `;
        blendPoly += `${rightL + i},${sy} `;
      }
      blendPoly += `${rightL + panelW},${padT + plotH}`;

      svg += `<polygon points="${blendPoly}" fill="rgba(37, 99, 235, 0.15)"/>`;
      svg += `<path d="${blendPath}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      asySvg.innerHTML = svg;
    }

    if (sliderN) sliderN.addEventListener('input', renderAsymptoticNormality);
    if (btnErrBimodal) {
      btnErrBimodal.addEventListener('click', () => {
        distType = 'bimodal';
        btnErrBimodal.classList.add('active');
        if (btnErrUniform) btnErrUniform.classList.remove('active');
        if (btnErrChi) btnErrChi.classList.remove('active');
        renderAsymptoticNormality();
      });
    }
    if (btnErrUniform) {
      btnErrUniform.addEventListener('click', () => {
        distType = 'uniform';
        btnErrUniform.classList.add('active');
        if (btnErrBimodal) btnErrBimodal.classList.remove('active');
        if (btnErrChi) btnErrChi.classList.remove('active');
        renderAsymptoticNormality();
      });
    }
    if (btnErrChi) {
      btnErrChi.addEventListener('click', () => {
        distType = 'chi';
        btnErrChi.classList.add('active');
        if (btnErrBimodal) btnErrBimodal.classList.remove('active');
        if (btnErrUniform) btnErrUniform.classList.remove('active');
        renderAsymptoticNormality();
      });
    }

    renderAsymptoticNormality();
  }

  // =========================================================================
  // 4. LESSON 4.4: CAN ESTIMATORS & ASYMPTOTIC EFFICIENCY (#efficiencySvg)
  // =========================================================================
  const effSvg = document.getElementById('efficiencySvg');
  if (effSvg) {
    const sliderVarA = document.getElementById('effSliderVarA');
    const readoutVarA = document.getElementById('effReadoutVarA');
    const readoutAre = document.getElementById('effReadoutAre');

    const thetaTrue = 3.0;
    const varB = 1.0; // Efficient benchmark estimator B (e.g. MLE)

    function renderEfficiency() {
      const varA = sliderVarA ? parseFloat(sliderVarA.value) : 2.25;
      if (readoutVarA) readoutVarA.textContent = varA.toFixed(2);

      const are = varB / varA; // Asymptotic Relative Efficiency: Var(B) / Var(A)
      if (readoutAre) readoutAre.textContent = (are * 100).toFixed(1) + '%';
      const legVarA = document.getElementById('effLegendVarA');
      if (legVarA) legVarA.textContent = `AsyVar = ${varA.toFixed(2)}`;

      const sdA = Math.sqrt(varA);
      const sdB = Math.sqrt(varB);

      const padL = 50, padR = 30, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = 0.0, maxX = 6.0;
      const maxY = 0.48;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - (y / maxY) * plotH; }

      let svg = '';

      // Grid
      for (let x = 0; x <= 6; x += 1) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        if (Math.abs(x - thetaTrue) < 0.05) {
          svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">θ = 3.0 (Target)</text>`;
        } else {
          svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x}</text>`;
        }
      }

      // True Theta Vertical Line
      const sxTheta = toX(thetaTrue);
      svg += `<line x1="${sxTheta}" y1="${padT}" x2="${sxTheta}" y2="${padT + plotH}" stroke="#0f172a" stroke-width="2"/>`;

      // Curve A (Wider, Inefficient CAN Estimator A - Orange/Amber)
      let pathA = '';
      let polyA = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= maxX; x += 0.04) {
        const y = normalPdf(x, thetaTrue, sdA);
        const sx = toX(x);
        const sy = toY(y);
        if (x === minX) pathA += `M ${sx} ${sy} `;
        else pathA += `L ${sx} ${sy} `;
        polyA += `${sx},${sy} `;
      }
      polyA += `${toX(maxX)},${toY(0)}`;
      svg += `<polygon points="${polyA}" fill="rgba(245, 158, 11, 0.12)"/>`;
      svg += `<path d="${pathA}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>`;

      // Curve B (Narrower, Efficient CAN Estimator B - Blue)
      let pathB = '';
      let polyB = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= maxX; x += 0.04) {
        const y = normalPdf(x, thetaTrue, sdB);
        const sx = toX(x);
        const sy = toY(y);
        if (x === minX) pathB += `M ${sx} ${sy} `;
        else pathB += `L ${sx} ${sy} `;
        polyB += `${sx},${sy} `;
      }
      polyB += `${toX(maxX)},${toY(0)}`;
      svg += `<polygon points="${polyB}" fill="rgba(37, 99, 235, 0.18)"/>`;
      svg += `<path d="${pathB}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      effSvg.innerHTML = svg;
    }

    if (sliderVarA) sliderVarA.addEventListener('input', renderEfficiency);
    renderEfficiency();
  }

  // =========================================================================
  // 5. LESSON 4.5: HYPOTHESIS TESTING & STANDARD NORMAL (#hypothesisTestSvg)
  // =========================================================================
  const hypSvg = document.getElementById('hypothesisTestSvg');
  if (hypSvg) {
    const sliderStat = document.getElementById('hypSliderStat');
    const readoutStat = document.getElementById('hypReadoutStat');
    const readoutDecision = document.getElementById('hypReadoutDecision');
    const btnAlpha05 = document.getElementById('hypAlpha05'); // 5% (±1.96)
    const btnAlpha01 = document.getElementById('hypAlpha01'); // 1% (±2.576)

    let critVal = 1.96;
    let alphaLabel = '5% (Two-Sided, z = ±1.96)';

    function renderHypothesis() {
      const zObs = sliderStat ? parseFloat(sliderStat.value) : 2.20;
      if (readoutStat) readoutStat.textContent = zObs >= 0 ? `+${zObs.toFixed(2)}` : zObs.toFixed(2);

      const isReject = Math.abs(zObs) > critVal;
      if (readoutDecision) {
        if (isReject) {
          readoutDecision.textContent = 'REJECT H₀';
          readoutDecision.style.color = '#dc2626';
        } else {
          readoutDecision.textContent = 'FAIL TO REJECT H₀';
          readoutDecision.style.color = '#059669';
        }
      }

      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = -3.8, maxX = 3.8;
      const maxY = 0.45;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - (y / maxY) * plotH; }

      let svg = '';

      // Grid
      for (let x = -3; x <= 3; x += 1) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x > 0 ? '+' + x : x}</text>`;
      }

      // Rejection Polygons: Left Tail (-inf to -critVal) and Right Tail (+critVal to +inf)
      let leftPoly = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= -critVal; x += 0.04) {
        const y = normalPdf(x, 0, 1);
        leftPoly += `${toX(x)},${toY(y)} `;
      }
      leftPoly += `${toX(-critVal)},${toY(0)}`;

      let rightPoly = `${toX(critVal)},${toY(0)} `;
      for (let x = critVal; x <= maxX; x += 0.04) {
        const y = normalPdf(x, 0, 1);
        rightPoly += `${toX(x)},${toY(y)} `;
      }
      rightPoly += `${toX(maxX)},${toY(0)}`;

      svg += `<polygon points="${leftPoly}" fill="rgba(239, 68, 68, 0.4)"/>`;
      svg += `<polygon points="${rightPoly}" fill="rgba(239, 68, 68, 0.4)"/>`;

      // Critical Value Boundary Lines
      const sxCritL = toX(-critVal);
      const sxCritR = toX(critVal);
      svg += `<line x1="${sxCritL}" y1="${padT}" x2="${sxCritL}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4 3"/>`;
      svg += `<line x1="${sxCritR}" y1="${padT}" x2="${sxCritR}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4 3"/>`;

      svg += `<text x="${sxCritL}" y="${padT - 8}" font-size="10" font-weight="600" fill="#dc2626" text-anchor="middle">-${critVal.toFixed(3)}</text>`;
      svg += `<text x="${sxCritR}" y="${padT - 8}" font-size="10" font-weight="600" fill="#dc2626" text-anchor="middle">+${critVal.toFixed(3)}</text>`;

      // Standard Normal Curve
      let curvePath = '';
      for (let x = minX; x <= maxX; x += 0.04) {
        const y = normalPdf(x, 0, 1);
        const sx = toX(x);
        const sy = toY(y);
        if (x === minX) curvePath += `M ${sx} ${sy} `;
        else curvePath += `L ${sx} ${sy} `;
      }
      svg += `<path d="${curvePath}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      // Observed Test Statistic Line
      const sxObs = toX(Math.max(minX, Math.min(maxX, zObs)));
      const colorObs = isReject ? '#dc2626' : '#059669';
      svg += `<line x1="${sxObs}" y1="${padT}" x2="${sxObs}" y2="${padT + plotH}" stroke="${colorObs}" stroke-width="3"/>`;
      svg += `<circle cx="${sxObs}" cy="${toY(normalPdf(zObs, 0, 1))}" r="5.5" fill="${colorObs}"/>`;
      const textZ = `z = ${zObs.toFixed(2)}`;
      svg += `<rect x="${sxObs - 36}" y="${padT + plotH + 20}" width="72" height="17" fill="rgba(255, 255, 255, 0.95)" stroke="${colorObs}" stroke-width="1.2" rx="3"/>`;
      svg += `<text x="${sxObs}" y="${padT + plotH + 32}" font-size="10.5" font-weight="800" fill="${colorObs}" text-anchor="middle">${textZ}</text>`;

      hypSvg.innerHTML = svg;
    }

    if (sliderStat) sliderStat.addEventListener('input', renderHypothesis);
    if (btnAlpha05) {
      btnAlpha05.addEventListener('click', () => {
        critVal = 1.96;
        alphaLabel = '5% (Two-Sided, z = ±1.96)';
        btnAlpha05.classList.add('active');
        if (btnAlpha01) btnAlpha01.classList.remove('active');
        renderHypothesis();
      });
    }
    if (btnAlpha01) {
      btnAlpha01.addEventListener('click', () => {
        critVal = 2.576;
        alphaLabel = '1% (99% CI, z = ±2.576)';
        btnAlpha01.classList.add('active');
        if (btnAlpha05) btnAlpha05.classList.remove('active');
        renderHypothesis();
      });
    }

    renderHypothesis();
  }

  // =========================================================================
  // 6. LESSON 4.6: DELTA METHOD TANGENT APPROXIMATION (#deltaMethodSvg)
  // =========================================================================
  const deltaSvg = document.getElementById('deltaMethodSvg');
  if (deltaSvg) {
    const sliderTheta = document.getElementById('deltaSliderTheta');
    const readoutTheta = document.getElementById('deltaReadoutTheta');
    const readoutG = document.getElementById('deltaReadoutG');
    const readoutSlope = document.getElementById('deltaReadoutSlope');

    // Function: g(theta) = theta^2
    function g(t) { return t * t; }
    function gPrime(t) { return 2 * t; }

    function renderDelta() {
      const theta = sliderTheta ? parseFloat(sliderTheta.value) : 2.0;
      const gVal = g(theta);
      const slope = gPrime(theta);

      if (readoutTheta) readoutTheta.textContent = theta.toFixed(2);
      if (readoutG) readoutG.textContent = gVal.toFixed(2);
      if (readoutSlope) readoutSlope.textContent = slope.toFixed(2);

      const padL = 50, padR = 30, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = 0.5, maxX = 3.5;
      const minY = 0.0, maxY = 12.0;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - ((y - minY) / (maxY - minY)) * plotH; }

      let svg = '';

      // Grid
      for (let x = 1.0; x <= 3.0; x += 0.5) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x.toFixed(1)}</text>`;
      }
      for (let y = 2; y <= 10; y += 2) {
        const sy = toY(y);
        svg += `<line x1="${padL}" y1="${sy}" x2="${padL + plotW}" y2="${sy}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${padL - 8}" y="${sy + 4}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="end">${y}</text>`;
      }

      // Nonlinear curve g(theta) = theta^2
      let curvePath = '';
      for (let x = minX; x <= maxX; x += 0.05) {
        const y = g(x);
        const sx = toX(x);
        const sy = toY(y);
        if (x === minX) curvePath += `M ${sx} ${sy} `;
        else curvePath += `L ${sx} ${sy} `;
      }
      svg += `<path d="${curvePath}" fill="none" stroke="#2563eb" stroke-width="3"/>`;

      // Tangent line at theta: y = g(theta) + g'(theta) * (x - theta)
      const tangX1 = Math.max(minX, theta - 0.9);
      const tangX2 = Math.min(maxX, theta + 0.9);
      const tangY1 = gVal + slope * (tangX1 - theta);
      const tangY2 = gVal + slope * (tangX2 - theta);

      svg += `<line x1="${toX(tangX1)}" y1="${toY(tangY1)}" x2="${toX(tangX2)}" y2="${toY(tangY2)}" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5 4"/>`;

      // Operating point (theta, g(theta))
      const sxPt = toX(theta);
      const syPt = toY(gVal);
      svg += `<circle cx="${sxPt}" cy="${syPt}" r="6" fill="#0f172a"/>`;

      // Projections to axes
      svg += `<line x1="${sxPt}" y1="${syPt}" x2="${sxPt}" y2="${padT + plotH}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3 3"/>`;
      svg += `<line x1="${padL}" y1="${syPt}" x2="${sxPt}" y2="${syPt}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3 3"/>`;

      // Annotations
      svg += `<text x="${sxPt + 10}" y="${syPt - 12}" font-size="11" font-weight="700" fill="#0f172a">(θ = ${theta.toFixed(2)}, g(θ) = ${gVal.toFixed(2)})</text>`;

      deltaSvg.innerHTML = svg;
    }

    if (sliderTheta) sliderTheta.addEventListener('input', renderDelta);
    renderDelta();
  }

  // =========================================================================
  // 7. LESSON 4.7: DELTA METHOD WORKED EXAMPLE (#deltaWorkedSvg)
  // =========================================================================
  const workedSvg = document.getElementById('deltaWorkedSvg');
  if (workedSvg) {
    const btnReset = document.getElementById('workedBtnReset');
    const readoutEst = document.getElementById('workedReadoutEst');
    const readoutSe = document.getElementById('workedReadoutSe');
    const readoutCi = document.getElementById('workedReadoutCi');

    // Fixed source values: b2 = 2.0, SE(b2) = 0.5, g(b2) = b2^2 = 4.0
    // AsyVar = (2*2)^2 * 0.5^2 = 16 * 0.25 = 4.0 -> SE = 2.0
    // 95% CI: 4 ± 1.96 * 2.0 = [0.08, 7.92]
    function renderWorkedExample() {
      if (readoutEst) readoutEst.textContent = '4.00';
      if (readoutSe) readoutSe.textContent = '2.00';
      if (readoutCi) readoutCi.textContent = '[0.08, 7.92]';

      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      // Two panels: Left = Original beta_2 distribution; Right = Transformed g(beta_2) distribution
      const panelW = (plotW - 30) / 2;

      let svg = '';

      // Left Panel: Original beta_2 ~ N(2, 0.5^2)
      svg += `<text x="${padL + panelW / 2}" y="${padT - 10}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">Original Estimator: β̂₂ ~ N(2.0, 0.5²)</text>`;
      svg += `<rect x="${padL}" y="${padT}" width="${panelW}" height="${plotH}" fill="var(--color-bg, #f8fafc)" stroke="var(--border-subtle, #e2e8f0)"/>`;

      let leftCurve = '';
      let leftPoly = `${padL},${padT + plotH} `;
      for (let i = 0; i <= panelW; i += 2) {
        const val = (i / panelW) * 4.0 + 0.0; // 0 to 4
        const yVal = normalPdf(val, 2.0, 0.5);
        const sy = padT + plotH - (yVal / 0.85) * plotH;
        if (i === 0) leftCurve += `M ${padL + i} ${sy} `;
        else leftCurve += `L ${padL + i} ${sy} `;
        leftPoly += `${padL + i},${sy} `;
      }
      leftPoly += `${padL + panelW},${padT + plotH}`;
      svg += `<polygon points="${leftPoly}" fill="rgba(37, 99, 235, 0.15)"/>`;
      svg += `<path d="${leftCurve}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      svg += `<line x1="${padL + panelW / 2}" y1="${padT}" x2="${padL + panelW / 2}" y2="${padT + plotH}" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      svg += `<text x="${padL + panelW / 2}" y="${padT + plotH + 16}" font-size="10.5" font-weight="700" fill="#0f172a" text-anchor="middle">β̂₂ = 2.0</text>`;
      svg += `<text x="${padL + 8}" y="${padT + 18}" font-size="10" fill="#64748b">SE = 0.50 (Tight)</text>`;

      // Right Panel: Transformed g(beta_2) ~ N(4, 2.0^2)
      const rightL = padL + panelW + 30;
      svg += `<text x="${rightL + panelW / 2}" y="${padT - 10}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">Transformed: g(β̂₂) = β̂₂² ~ N(4.0, 2.0²)</text>`;
      svg += `<rect x="${rightL}" y="${padT}" width="${panelW}" height="${plotH}" fill="var(--color-bg, #f8fafc)" stroke="var(--border-subtle, #e2e8f0)"/>`;

      // 95% CI Shading on Right Panel [0.08, 7.92] (Range -1 to 9)
      const minTrans = -1.0, maxTrans = 9.0;
      function toRightX(v) { return rightL + ((v - minTrans) / (maxTrans - minTrans)) * panelW; }

      const xCiL = toRightX(0.08);
      const xCiR = toRightX(7.92);
      svg += `<rect x="${xCiL}" y="${padT}" width="${xCiR - xCiL}" height="${plotH}" fill="rgba(16, 185, 129, 0.12)"/>`;
      svg += `<line x1="${xCiL}" y1="${padT}" x2="${xCiL}" y2="${padT + plotH}" stroke="#059669" stroke-width="1.2" stroke-dasharray="3 2"/>`;
      svg += `<line x1="${xCiR}" y1="${padT}" x2="${xCiR}" y2="${padT + plotH}" stroke="#059669" stroke-width="1.2" stroke-dasharray="3 2"/>`;

      let rightCurve = '';
      let rightPoly = `${rightL},${padT + plotH} `;
      for (let i = 0; i <= panelW; i += 2) {
        const val = minTrans + (i / panelW) * (maxTrans - minTrans);
        const yVal = normalPdf(val, 4.0, 2.0);
        const sy = padT + plotH - (yVal / 0.25) * plotH;
        if (i === 0) rightCurve += `M ${rightL + i} ${sy} `;
        else rightCurve += `L ${rightL + i} ${sy} `;
        rightPoly += `${rightL + i},${sy} `;
      }
      rightPoly += `${rightL + panelW},${padT + plotH}`;
      svg += `<polygon points="${rightPoly}" fill="rgba(245, 158, 11, 0.15)"/>`;
      svg += `<path d="${rightCurve}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>`;

      const sx4 = toRightX(4.0);
      svg += `<line x1="${sx4}" y1="${padT}" x2="${sx4}" y2="${padT + plotH}" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      svg += `<text x="${sx4}" y="${padT + plotH + 16}" font-size="10.5" font-weight="700" fill="#0f172a" text-anchor="middle">g = 4.0</text>`;
      svg += `<text x="${rightL + 8}" y="${padT + 18}" font-size="10" fill="#dc2626" font-weight="600">SE = 2.00 (Expanded 4×!)</text>`;
      svg += `<text x="${rightL + 8}" y="${padT + 32}" font-size="9.5" fill="#059669">95% CI: [0.08, 7.92]</text>`;

      workedSvg.innerHTML = svg;
    }

    if (btnReset) btnReset.addEventListener('click', renderWorkedExample);
    renderWorkedExample();
  }

  // =========================================================================
  // 8. LESSON 4.8: WALD TEST & CHI-SQUARE LAB (#waldTestSvg)
  // =========================================================================
  const waldSvg = document.getElementById('waldTestSvg');
  if (waldSvg) {
    const sliderG = document.getElementById('waldSliderG');
    const readoutG = document.getElementById('waldReadoutG');
    const readoutW = document.getElementById('waldReadoutW');
    const readoutDecision = document.getElementById('waldReadoutDecision');
    const btnSetExample = document.getElementById('waldBtnSourceExample');

    const varG = 4.0; // From source: Var(g(theta)) = 4.0
    const critChiSq = 3.841; // 5% critical value for chi-square with 1 df

    function renderWald() {
      const gVal = sliderG ? parseFloat(sliderG.value) : 2.0;
      if (readoutG) readoutG.textContent = gVal.toFixed(2);

      // W = [g(theta)]^2 / Var(g(theta))
      const wStat = (gVal * gVal) / varG;
      if (readoutW) readoutW.textContent = wStat.toFixed(3);

      const isReject = wStat > critChiSq;
      if (readoutDecision) {
        if (isReject) {
          readoutDecision.textContent = 'REJECT H₀ (W > 3.841)';
          readoutDecision.style.color = '#dc2626';
        } else {
          readoutDecision.textContent = 'FAIL TO REJECT H₀ (W ≤ 3.841)';
          readoutDecision.style.color = '#059669';
        }
      }

      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = 0.0, maxX = 8.0;
      const maxY = 1.2;

      function toX(x) { return padL + (x / maxX) * plotW; }
      function toY(y) { return padT + plotH - (y / maxY) * plotH; }

      let svg = '';

      // Grid
      for (let x = 1; x <= 8; x += 1) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x}</text>`;
      }

      // Rejection region: x >= 3.841
      let rejPoly = `${toX(critChiSq)},${toY(0)} `;
      for (let x = critChiSq; x <= maxX; x += 0.05) {
        const y = chiSquare1Pdf(x);
        rejPoly += `${toX(x)},${toY(y)} `;
      }
      rejPoly += `${toX(maxX)},${toY(0)}`;
      svg += `<polygon points="${rejPoly}" fill="rgba(239, 68, 68, 0.4)"/>`;

      // Critical line
      const sxCrit = toX(critChiSq);
      svg += `<line x1="${sxCrit}" y1="${padT}" x2="${sxCrit}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>`;
      svg += `<text x="${sxCrit}" y="${padT - 8}" font-size="10" font-weight="700" fill="#dc2626" text-anchor="middle">χ²₁ Critical = 3.841 (α = 0.05)</text>`;

      // Chi-Square 1 df curve
      let curvePath = '';
      for (let x = 0.05; x <= maxX; x += 0.05) {
        const y = chiSquare1Pdf(x);
        const sx = toX(x);
        const sy = toY(y);
        if (x === 0.05) curvePath += `M ${sx} ${sy} `;
        else curvePath += `L ${sx} ${sy} `;
      }
      svg += `<path d="${curvePath}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      // Observed Wald Statistic line
      const sxW = toX(Math.min(maxX, wStat));
      const colW = isReject ? '#dc2626' : '#059669';
      svg += `<line x1="${sxW}" y1="${padT}" x2="${sxW}" y2="${padT + plotH}" stroke="${colW}" stroke-width="3"/>`;
      svg += `<circle cx="${sxW}" cy="${toY(chiSquare1Pdf(wStat))}" r="6" fill="${colW}"/>`;
      const textW = `W = ${wStat.toFixed(2)}`;
      svg += `<rect x="${sxW - 36}" y="${padT + plotH + 20}" width="72" height="17" fill="rgba(255, 255, 255, 0.95)" stroke="${colW}" stroke-width="1.2" rx="3"/>`;
      svg += `<text x="${sxW}" y="${padT + plotH + 32}" font-size="10.5" font-weight="800" fill="${colW}" text-anchor="middle">${textW}</text>`;

      waldSvg.innerHTML = svg;
    }

    if (sliderG) sliderG.addEventListener('input', renderWald);
    if (btnSetExample) {
      btnSetExample.addEventListener('click', () => {
        if (sliderG) sliderG.value = '2.0';
        renderWald();
      });
    }

    renderWald();
  }
});
