/**
 * EcoIntuition Academy — Econometrics with AI
 * Module 5 Interactive Visualizations Controller
 * 
 * Includes:
 * 1. Lesson 5.1: Two-Tailed Hypothesis Testing Lab (#hypTwoTailedSvg)
 * 2. Lesson 5.2: Statistical Power & Type II Error Dual-Curve Lab (#powerLabSvg)
 * 3. Lesson 5.3: Linear Restriction Matrix Builder (#restrictionBuilderSvg)
 * 4. Lesson 5.4: F-Statistic & Model Fit Loss Explorer (#fTestLossSvg)
 * 5. Lesson 5.5: Binary Dummy Group Expectations Visualizer (#dummyGroupSvg)
 * 6. Lesson 5.6: Parallel Regression Lines & Control Shifter (#parallelLinesSvg)
 * 7. Lesson 5.7: Log-Dummy Exact vs Approximate Percentage Lab (#exactVsApproxSvg)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper: Normal PDF
  function normalPdf(x, mu, sigma) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  }

  // Helper: Standard Normal CDF approximation (Abramowitz & Stegun)
  function normCdf(val) {
    const b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
    const p = 0.2316419;
    const sign = val < 0 ? -1 : 1;
    const absX = Math.abs(val);
    const t = 1.0 / (1.0 + p * absX);
    const pdf = Math.exp(-0.5 * absX * absX) / Math.sqrt(2 * Math.PI);
    const cdf = 1.0 - pdf * (b1 * t + b2 * Math.pow(t, 2) + b3 * Math.pow(t, 3) + b4 * Math.pow(t, 4) + b5 * Math.pow(t, 5));
    return sign === 1 ? cdf : 1.0 - cdf;
  }

  // =========================================================================
  // 1. LESSON 5.1: TWO-TAILED HYPOTHESIS TESTING (#hypTwoTailedSvg)
  // =========================================================================
  const hypSvg = document.getElementById('hypTwoTailedSvg');
  if (hypSvg) {
    const sliderStat = document.getElementById('hyp51SliderStat');
    const readoutStat = document.getElementById('hyp51ReadoutStat');
    const readoutDecision = document.getElementById('hyp51ReadoutDecision');
    const readoutPval = document.getElementById('hyp51ReadoutPval');
    const critVal = 1.96; // 5% two-tailed

    function renderTwoTailedTest() {
      const stat = sliderStat ? parseFloat(sliderStat.value) : 2.1;
      if (readoutStat) readoutStat.textContent = stat >= 0 ? `+${stat.toFixed(2)}` : stat.toFixed(2);

      const pVal = 2 * (1 - normCdf(Math.abs(stat)));
      if (readoutPval) readoutPval.textContent = pVal < 0.001 ? '< 0.001' : pVal.toFixed(3);

      const isReject = Math.abs(stat) > critVal;
      if (readoutDecision) {
        if (isReject) {
          readoutDecision.textContent = 'REJECT H₀ (|t| > 1.96)';
          readoutDecision.style.color = '#dc2626';
        } else {
          readoutDecision.textContent = 'FAIL TO REJECT H₀ (|t| ≤ 1.96)';
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
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x > 0 ? '+' + x : x}</text>`;
      }

      // Rejection tails: left of -1.96 (2.5%) and right of +1.96 (2.5%)
      let leftPoly = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= -critVal; x += 0.04) {
        leftPoly += `${toX(x)},${toY(normalPdf(x, 0, 1))} `;
      }
      leftPoly += `${toX(-critVal)},${toY(0)}`;

      let rightPoly = `${toX(critVal)},${toY(0)} `;
      for (let x = critVal; x <= maxX; x += 0.04) {
        rightPoly += `${toX(x)},${toY(normalPdf(x, 0, 1))} `;
      }
      rightPoly += `${toX(maxX)},${toY(0)}`;

      svg += `<polygon points="${leftPoly}" fill="rgba(239, 68, 68, 0.4)"/>`;
      svg += `<polygon points="${rightPoly}" fill="rgba(239, 68, 68, 0.4)"/>`;

      // Critical lines
      const sxL = toX(-critVal);
      const sxR = toX(critVal);
      svg += `<line x1="${sxL}" y1="${padT}" x2="${sxL}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4 3"/>`;
      svg += `<line x1="${sxR}" y1="${padT}" x2="${sxR}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4 3"/>`;
      svg += `<text x="${sxL}" y="${padT - 8}" font-size="10" font-weight="600" fill="#dc2626" text-anchor="middle">-1.96 (2.5%)</text>`;
      svg += `<text x="${sxR}" y="${padT - 8}" font-size="10" font-weight="600" fill="#dc2626" text-anchor="middle">+1.96 (2.5%)</text>`;

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
      const sxStat = toX(Math.max(minX, Math.min(maxX, stat)));
      const colStat = isReject ? '#dc2626' : '#059669';
      svg += `<line x1="${sxStat}" y1="${padT}" x2="${sxStat}" y2="${padT + plotH}" stroke="${colStat}" stroke-width="3"/>`;
      svg += `<circle cx="${sxStat}" cy="${toY(normalPdf(stat, 0, 1))}" r="5.5" fill="${colStat}"/>`;
      const textT = `t = ${stat.toFixed(2)}`;
      svg += `<rect x="${sxStat - 34}" y="${padT + plotH + 20}" width="68" height="17" fill="rgba(255, 255, 255, 0.95)" stroke="${colStat}" stroke-width="1.2" rx="3"/>`;
      svg += `<text x="${sxStat}" y="${padT + plotH + 32}" font-size="10.5" font-weight="800" fill="${colStat}" text-anchor="middle">${textT}</text>`;

      // Center annotation
      const sxCenter = toX(0);
      svg += `<line x1="${sxCenter}" y1="${padT + 60}" x2="${sxCenter}" y2="${padT + plotH}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="2 2"/>`;
      svg += `<rect x="${sxCenter - 75}" y="${padT + 38}" width="150" height="18" fill="rgba(255, 255, 255, 0.92)" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" rx="3"/>`;
      svg += `<text x="${sxCenter}" y="${padT + 51}" font-size="10" font-weight="600" fill="#475569" text-anchor="middle">Hypothesized Value: β₂ = 0</text>`;

      hypSvg.innerHTML = svg;
    }

    if (sliderStat) sliderStat.addEventListener('input', renderTwoTailedTest);
    renderTwoTailedTest();
  }

  // =========================================================================
  // 2. LESSON 5.2: POWER & TYPE II ERROR DUAL-CURVE LAB (#powerLabSvg)
  // =========================================================================
  const powerSvg = document.getElementById('powerLabSvg');
  if (powerSvg) {
    const sliderDelta = document.getElementById('powerSliderDelta');
    const sliderSe = document.getElementById('powerSliderSe');
    const readoutDelta = document.getElementById('powerReadoutDelta');
    const readoutSe = document.getElementById('powerReadoutSe');
    const readoutPower = document.getElementById('powerReadoutPower');
    const readoutBeta = document.getElementById('powerReadoutBeta');

    function renderPowerLab() {
      const delta = sliderDelta ? parseFloat(sliderDelta.value) : 2.5; // True alternative effect size
      const se = sliderSe ? parseFloat(sliderSe.value) : 1.0; // Standard error of estimate

      if (readoutDelta) readoutDelta.textContent = delta.toFixed(2);
      if (readoutSe) readoutSe.textContent = se.toFixed(2);

      // Right-tailed test critical threshold under H0 at alpha = 0.05: c = 0 + 1.645 * se
      const critVal = 1.645 * se;

      // Type II error = Pr(X <= critVal | H1: X ~ N(delta, se^2)) = Phi((critVal - delta) / se)
      const zBeta = (critVal - delta) / se;
      const type2Rate = Math.max(0.0001, Math.min(0.9999, normCdf(zBeta)));
      const powerRate = 1.0 - type2Rate;

      if (readoutBeta) readoutBeta.textContent = (type2Rate * 100).toFixed(1) + '%';
      if (readoutPower) readoutPower.textContent = (powerRate * 100).toFixed(1) + '%';

      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = -3.0, maxX = 6.5;
      const maxY = 0.55;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - (y / maxY) * plotH; }

      let svg = '';

      // Grid
      for (let x = -2; x <= 6; x += 1) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x}</text>`;
      }

      // Shaded areas under H1 curve:
      // Left of critVal = Type II Error (Amber)
      let type2Poly = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= critVal; x += 0.04) {
        type2Poly += `${toX(x)},${toY(normalPdf(x, delta, se))} `;
      }
      type2Poly += `${toX(critVal)},${toY(0)}`;
      svg += `<polygon points="${type2Poly}" fill="rgba(245, 158, 11, 0.35)"/>`;

      // Right of critVal = Power (Green)
      let powerPoly = `${toX(critVal)},${toY(0)} `;
      for (let x = critVal; x <= maxX; x += 0.04) {
        powerPoly += `${toX(x)},${toY(normalPdf(x, delta, se))} `;
      }
      powerPoly += `${toX(maxX)},${toY(0)}`;
      svg += `<polygon points="${powerPoly}" fill="rgba(16, 185, 129, 0.35)"/>`;

      // Curve 1: Distribution under H0: N(0, se^2) (Dashed Blue)
      let curveH0 = '';
      for (let x = minX; x <= maxX; x += 0.04) {
        const y = normalPdf(x, 0, se);
        const sx = toX(x);
        const sy = toY(y);
        if (x === minX) curveH0 += `M ${sx} ${sy} `;
        else curveH0 += `L ${sx} ${sy} `;
      }
      svg += `<path d="${curveH0}" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="5 3"/>`;

      // Curve 2: Distribution under H1: N(delta, se^2) (Solid Green)
      let curveH1 = '';
      for (let x = minX; x <= maxX; x += 0.04) {
        const y = normalPdf(x, delta, se);
        const sx = toX(x);
        const sy = toY(y);
        if (x === minX) curveH1 += `M ${sx} ${sy} `;
        else curveH1 += `L ${sx} ${sy} `;
      }
      svg += `<path d="${curveH1}" fill="none" stroke="#059669" stroke-width="2.5"/>`;

      // Critical Value Threshold Line
      const sxCrit = toX(critVal);
      svg += `<line x1="${sxCrit}" y1="${padT}" x2="${sxCrit}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>`;
      svg += `<text x="${sxCrit}" y="${padT - 8}" font-size="10.5" font-weight="700" fill="#dc2626" text-anchor="middle">Critical c = ${critVal.toFixed(2)} (t = 1.645)</text>`;

      // Labels on Curves
      svg += `<text x="${toX(0)}" y="${padT + 18}" font-size="10" font-weight="700" fill="#2563eb" text-anchor="middle">H₀: β₂ ≤ 0</text>`;
      svg += `<text x="${toX(delta)}" y="${toY(normalPdf(delta, delta, se)) - 10}" font-size="10.5" font-weight="700" fill="#059669" text-anchor="middle">True H₁: β₂ = ${delta.toFixed(1)}</text>`;

      // Note: Legend moved to external HTML legend container above chart
      powerSvg.innerHTML = svg;
    }

    if (sliderDelta) sliderDelta.addEventListener('input', renderPowerLab);
    if (sliderSe) sliderSe.addEventListener('input', renderPowerLab);
    renderPowerLab();
  }

  // =========================================================================
  // 3. LESSON 5.3: LINEAR RESTRICTION MATRIX BUILDER (#restrictionBuilderSvg)
  // =========================================================================
  const restrSvg = document.getElementById('restrictionBuilderSvg');
  if (restrSvg) {
    const btnEx1 = document.getElementById('restrBtnEx1');
    const btnEx2 = document.getElementById('restrBtnEx2');
    const btnEx3 = document.getElementById('restrBtnEx3');
    const readoutHyp = document.getElementById('restrReadoutHyp');
    const readoutJ = document.getElementById('restrReadoutJ');

    let currentEx = 3; // Default to Example 3 (Multiple restrictions from source)

    function renderRestrictionBuilder() {
      if (currentEx === 1) {
        if (readoutHyp) readoutHyp.textContent = 'H₀: β₂ = 0';
        if (readoutJ) readoutJ.textContent = 'J = 1 restriction';
      } else if (currentEx === 2) {
        if (readoutHyp) readoutHyp.textContent = 'H₀: β₂ + β₃ = 1';
        if (readoutJ) readoutJ.textContent = 'J = 1 restriction';
      } else {
        if (readoutHyp) readoutHyp.textContent = 'H₀: β₂ = 0  and  β₃ = β₄';
        if (readoutJ) readoutJ.textContent = 'J = 2 restrictions';
      }

      let svg = '';
      svg += `<rect width="540" height="280" fill="var(--color-bg, #f8fafc)" rx="6" stroke="var(--border-subtle, #e2e8f0)"/>`;

      if (currentEx === 1) {
        // Ex 1: R = [0 1 0 0 0], q = 0
        svg += `<text x="270" y="30" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">Matrix Setup for H₀: β₂ = 0 (J = 1, K = 5)</text>`;

        // Render R matrix (1 x 5)
        svg += `<text x="70" y="90" font-size="11" font-weight="700" fill="#0f172a">R (1×5):</text>`;
        svg += `<text x="140" y="90" font-size="12" font-family="var(--font-mono)" fill="#2563eb">[ 0   1   0   0   0 ]</text>`;

        // Render beta vector
        svg += `<text x="70" y="140" font-size="11" font-weight="700" fill="#0f172a">β (5×1):</text>`;
        svg += `<text x="140" y="140" font-size="12" font-family="var(--font-mono)" fill="#475569">[ β₁, β₂, β₃, β₄, β₅ ]′</text>`;

        // Render q vector
        svg += `<text x="70" y="190" font-size="11" font-weight="700" fill="#0f172a">q (1×1):</text>`;
        svg += `<text x="140" y="190" font-size="12" font-family="var(--font-mono)" fill="#059669">[ 0 ]</text>`;

        // Result: R beta - q
        svg += `<rect x="50" y="220" width="440" height="40" fill="#ffffff" stroke="#2563eb" rx="4"/>`;
        svg += `<text x="270" y="245" font-size="13" font-weight="700" font-family="var(--font-mono)" fill="#1d4ed8" text-anchor="middle">Rβ - q = β₂ - 0 = β₂</text>`;
      } else if (currentEx === 2) {
        // Ex 2: R = [0 1 1 0 0], q = 1
        svg += `<text x="270" y="30" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">Matrix Setup for H₀: β₂ + β₃ = 1 (J = 1, K = 5)</text>`;

        svg += `<text x="70" y="90" font-size="11" font-weight="700" fill="#0f172a">R (1×5):</text>`;
        svg += `<text x="140" y="90" font-size="12" font-family="var(--font-mono)" fill="#2563eb">[ 0   1   1   0   0 ]</text>`;

        svg += `<text x="70" y="140" font-size="11" font-weight="700" fill="#0f172a">β (5×1):</text>`;
        svg += `<text x="140" y="140" font-size="12" font-family="var(--font-mono)" fill="#475569">[ β₁, β₂, β₃, β₄, β₅ ]′</text>`;

        svg += `<text x="70" y="190" font-size="11" font-weight="700" fill="#0f172a">q (1×1):</text>`;
        svg += `<text x="140" y="190" font-size="12" font-family="var(--font-mono)" fill="#059669">[ 1 ]</text>`;

        svg += `<rect x="50" y="220" width="440" height="40" fill="#ffffff" stroke="#2563eb" rx="4"/>`;
        svg += `<text x="270" y="245" font-size="13" font-weight="700" font-family="var(--font-mono)" fill="#1d4ed8" text-anchor="middle">Rβ - q = (β₂ + β₃) - 1</text>`;
      } else {
        // Ex 3: R = [0 1 0 0 0; 0 0 1 -1 0], q = [0; 0]
        svg += `<text x="270" y="26" font-size="12.5" font-weight="700" fill="#1e3a8a" text-anchor="middle">Matrix Setup for H₀: β₂ = 0 &amp; β₃ = β₄ (J = 2, K = 5)</text>`;

        // R matrix
        svg += `<text x="50" y="75" font-size="11" font-weight="700" fill="#0f172a">R (2×5):</text>`;
        svg += `<text x="115" y="70" font-size="11.5" font-family="var(--font-mono)" fill="#2563eb">⎡ 0   1   0    0   0 ⎤</text>`;
        svg += `<text x="115" y="90" font-size="11.5" font-family="var(--font-mono)" fill="#2563eb">⎣ 0   0   1  -1   0 ⎦</text>`;

        // beta vector
        svg += `<text x="310" y="75" font-size="11" font-weight="700" fill="#0f172a">β (5×1):</text>`;
        svg += `<text x="365" y="62" font-size="10.5" font-family="var(--font-mono)" fill="#475569">[ β₁, β₂, β₃, β₄, β₅ ]′</text>`;

        // q vector
        svg += `<text x="50" y="145" font-size="11" font-weight="700" fill="#0f172a">q (2×1):</text>`;
        svg += `<text x="115" y="138" font-size="11.5" font-family="var(--font-mono)" fill="#059669">⎡ 0 ⎤</text>`;
        svg += `<text x="115" y="156" font-size="11.5" font-family="var(--font-mono)" fill="#059669">⎣ 0 ⎦</text>`;

        // Result: R beta - q
        svg += `<rect x="40" y="185" width="460" height="75" fill="#ffffff" stroke="#2563eb" rx="4"/>`;
        svg += `<text x="270" y="210" font-size="11.5" font-weight="700" fill="#0f172a" text-anchor="middle">Rβ - q Matrix Difference:</text>`;
        svg += `<text x="270" y="232" font-size="12" font-weight="700" font-family="var(--font-mono)" fill="#1d4ed8" text-anchor="middle">⎡ β₂ - 0 ⎤   =   ⎡   β₂   ⎤</text>`;
        svg += `<text x="270" y="250" font-size="12" font-weight="700" font-family="var(--font-mono)" fill="#1d4ed8" text-anchor="middle">⎣ β₃ - β₄ ⎦       ⎣ β₃ - β₄ ⎦</text>`;
      }

      restrSvg.innerHTML = svg;
    }

    if (btnEx1) {
      btnEx1.addEventListener('click', () => {
        currentEx = 1;
        btnEx1.classList.add('active');
        if (btnEx2) btnEx2.classList.remove('active');
        if (btnEx3) btnEx3.classList.remove('active');
        renderRestrictionBuilder();
      });
    }
    if (btnEx2) {
      btnEx2.addEventListener('click', () => {
        currentEx = 2;
        btnEx2.classList.add('active');
        if (btnEx1) btnEx1.classList.remove('active');
        if (btnEx3) btnEx3.classList.remove('active');
        renderRestrictionBuilder();
      });
    }
    if (btnEx3) {
      btnEx3.addEventListener('click', () => {
        currentEx = 3;
        btnEx3.classList.add('active');
        if (btnEx1) btnEx1.classList.remove('active');
        if (btnEx2) btnEx2.classList.remove('active');
        renderRestrictionBuilder();
      });
    }

    renderRestrictionBuilder();
  }

  // =========================================================================
  // 4. LESSON 5.4: F-STATISTIC & MODEL FIT LOSS (#fTestLossSvg)
  // =========================================================================
  const fLossSvg = document.getElementById('fTestLossSvg');
  if (fLossSvg) {
    const sliderR2U = document.getElementById('fSliderR2U');
    const sliderR2R = document.getElementById('fSliderR2R');
    const readoutR2U = document.getElementById('fReadoutR2U');
    const readoutR2R = document.getElementById('fReadoutR2R');
    const readoutF = document.getElementById('fReadoutF');
    const readoutDecision = document.getElementById('fReadoutDecision');

    const J = 2; // Joint restrictions tested
    const n = 100;
    const k = 5;
    const dfResid = n - k; // 95
    const critF = 3.09; // F(2, 95) at 5% alpha

    function renderFTestLab() {
      let r2u = sliderR2U ? parseFloat(sliderR2U.value) : 0.65;
      let r2r = sliderR2R ? parseFloat(sliderR2R.value) : 0.58;

      // Ensure R2_R <= R2_U strictly
      if (r2r > r2u) {
        r2r = r2u;
        if (sliderR2R) sliderR2R.value = r2r.toFixed(2);
      }

      if (readoutR2U) readoutR2U.textContent = r2u.toFixed(2);
      if (readoutR2R) readoutR2R.textContent = r2r.toFixed(2);

      // F = [(R2_U - R2_R) / J] / [(1 - R2_U) / (n - k)]
      const numerator = (r2u - r2r) / J;
      const denominator = (1 - r2u) / dfResid;
      const fStat = denominator > 0 ? numerator / denominator : 0;

      if (readoutF) readoutF.textContent = fStat.toFixed(2);

      const isReject = fStat > critF;
      if (readoutDecision) {
        if (isReject) {
          readoutDecision.textContent = 'REJECT H₀ (F > 3.09)';
          readoutDecision.style.color = '#dc2626';
        } else {
          readoutDecision.textContent = 'FAIL TO REJECT H₀ (F ≤ 3.09)';
          readoutDecision.style.color = '#059669';
        }
      }

      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 280 - padT - padB;

      let svg = '';

      // Two visual comparison bars: Unrestricted Model vs Restricted Model
      const barH = 34;
      const barY1 = padT + 30;
      const barY2 = padT + 100;

      // Label 1: Unrestricted Model
      svg += `<text x="${padL}" y="${barY1 - 8}" font-size="11" font-weight="700" fill="#0f172a">Unrestricted Model (5 regressors): R²_U = ${r2u.toFixed(2)}</text>`;
      // Base track
      svg += `<rect x="${padL}" y="${barY1}" width="${plotW}" height="${barH}" fill="var(--color-bg, #f1f5f9)" rx="4" stroke="var(--border-subtle, #e2e8f0)"/>`;
      // Explained portion
      svg += `<rect x="${padL}" y="${barY1}" width="${plotW * r2u}" height="${barH}" fill="#2563eb" rx="4"/>`;
      svg += `<text x="${padL + plotW * r2u - 8}" y="${barY1 + 22}" font-size="11" font-weight="700" fill="#ffffff" text-anchor="end">Explained: ${(r2u * 100).toFixed(0)}%</text>`;

      // Label 2: Restricted Model
      svg += `<text x="${padL}" y="${barY2 - 8}" font-size="11" font-weight="700" fill="#0f172a">Restricted Model (Imposes H₀, J = 2): R²_R = ${r2r.toFixed(2)}</text>`;
      // Base track
      svg += `<rect x="${padL}" y="${barY2}" width="${plotW}" height="${barH}" fill="var(--color-bg, #f1f5f9)" rx="4" stroke="var(--border-subtle, #e2e8f0)"/>`;
      // Explained portion
      svg += `<rect x="${padL}" y="${barY2}" width="${plotW * r2r}" height="${barH}" fill="#059669" rx="4"/>`;
      svg += `<text x="${padL + plotW * r2r - 8}" y="${barY2 + 22}" font-size="11" font-weight="700" fill="#ffffff" text-anchor="end">Explained: ${(r2r * 100).toFixed(0)}%</text>`;

      // Highlight Loss of Fit Gap (R2_U - R2_R)
      const lossW = plotW * (r2u - r2r);
      if (lossW > 2) {
        svg += `<rect x="${padL + plotW * r2r}" y="${barY2}" width="${lossW}" height="${barH}" fill="rgba(239, 68, 68, 0.45)" rx="2"/>`;
        svg += `<text x="${padL + plotW * r2r + lossW / 2}" y="${barY2 + 22}" font-size="10" font-weight="700" fill="#b91c1c" text-anchor="middle">ΔR² = ${((r2u - r2r) * 100).toFixed(1)}%</text>`;
      }

      // Decision and summary are displayed in external HTML metric status bar
      fLossSvg.innerHTML = svg;
    }

    if (sliderR2U) sliderR2U.addEventListener('input', renderFTestLab);
    if (sliderR2R) sliderR2R.addEventListener('input', renderFTestLab);
    renderFTestLab();
  }

  // =========================================================================
  // 5. LESSON 5.5: BINARY DUMMY GROUP EXPECTATIONS (#dummyGroupSvg)
  // =========================================================================
  const dummySvg = document.getElementById('dummyGroupSvg');
  if (dummySvg) {
    const btnGroup0 = document.getElementById('dummyBtnGroup0');
    const btnGroup1 = document.getElementById('dummyBtnGroup1');
    const btnBoth = document.getElementById('dummyBtnBoth');
    const readoutDiff = document.getElementById('dummyReadoutDiff');

    let viewMode = 'both'; // '0', '1', 'both'

    // Fixed model parameters from source: beta1 = 2.10 (base), beta2 = 0.35 (male premium)
    const beta1 = 2.10;
    const beta2 = 0.35;

    function renderDummyGroupLab() {
      if (readoutDiff) readoutDiff.textContent = `+${beta2.toFixed(2)} (Gap)`;

      const padL = 60, padR = 40, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 280 - padT - padB;

      const minY = 1.6, maxY = 3.0;

      function toY(y) { return padT + plotH - ((y - minY) / (maxY - minY)) * plotH; }

      let svg = '';

      // Grid lines
      for (let y = 1.8; y <= 2.8; y += 0.2) {
        const sy = toY(y);
        svg += `<line x1="${padL}" y1="${sy}" x2="${padL + plotW}" y2="${sy}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${padL - 10}" y="${sy + 4}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="end">${y.toFixed(1)}</text>`;
      }

      // Two category columns: Group 0 (Non-male) at X = 160; Group 1 (Male) at X = 380
      const colX0 = padL + plotW * 0.30;
      const colX1 = padL + plotW * 0.70;

      // Group 0 axis tick & label
      svg += `<line x1="${colX0}" y1="${padT + plotH}" x2="${colX0}" y2="${padT + plotH + 6}" stroke="#64748b" stroke-width="1.5"/>`;
      svg += `<text x="${colX0}" y="${padT + plotH + 20}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">male = 0 (Base Group)</text>`;

      // Group 1 axis tick & label
      svg += `<line x1="${colX1}" y1="${padT + plotH}" x2="${colX1}" y2="${padT + plotH + 6}" stroke="#64748b" stroke-width="1.5"/>`;
      svg += `<text x="${colX1}" y="${padT + plotH + 20}" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">male = 1</text>`;

      // Synthetic sample scatter points
      const points0 = [2.02, 2.18, 1.95, 2.25, 2.08, 2.12];
      const points1 = [2.38, 2.52, 2.41, 2.60, 2.35, 2.44];

      if (viewMode === '0' || viewMode === 'both') {
        points0.forEach(py => {
          svg += `<circle cx="${colX0 + (Math.random() * 20 - 10)}" cy="${toY(py)}" r="3.5" fill="#94a3b8" opacity="0.7"/>`;
        });
        // Group 0 mean dot
        const sy0 = toY(beta1);
        svg += `<circle cx="${colX0}" cy="${sy0}" r="7" fill="#2563eb"/>`;
        svg += `<line x1="${colX0 - 30}" y1="${sy0}" x2="${colX0 + 30}" y2="${sy0}" stroke="#2563eb" stroke-width="2.5"/>`;
        svg += `<text x="${colX0 + 36}" y="${sy0 + 4}" font-size="11" font-weight="700" fill="#1d4ed8">E[ln w | 0] = β₁ (${beta1.toFixed(2)})</text>`;
      }

      if (viewMode === '1' || viewMode === 'both') {
        points1.forEach(py => {
          svg += `<circle cx="${colX1 + (Math.random() * 20 - 10)}" cy="${toY(py)}" r="3.5" fill="#94a3b8" opacity="0.7"/>`;
        });
        // Group 1 mean dot
        const sy1 = toY(beta1 + beta2);
        svg += `<circle cx="${colX1}" cy="${sy1}" r="7" fill="#059669"/>`;
        svg += `<line x1="${colX1 - 30}" y1="${sy1}" x2="${colX1 + 30}" y2="${sy1}" stroke="#059669" stroke-width="2.5"/>`;
        svg += `<text x="${colX1 + 36}" y="${sy1 + 4}" font-size="11" font-weight="700" fill="#047857">E[ln w | 1] = β₁ + β₂ (${(beta1 + beta2).toFixed(2)})</text>`;
      }

      // Vertical difference arrow between group means
      if (viewMode === 'both') {
        const midX = (colX0 + colX1) / 2;
        const yTop = toY(beta1 + beta2);
        const yBot = toY(beta1);
        svg += `<line x1="${midX}" y1="${yBot}" x2="${midX}" y2="${yTop}" stroke="#dc2626" stroke-width="2" stroke-dasharray="3 2"/>`;
        svg += `<circle cx="${midX}" cy="${yBot}" r="3" fill="#dc2626"/>`;
        svg += `<circle cx="${midX}" cy="${yTop}" r="3" fill="#dc2626"/>`;
        svg += `<text x="${midX + 8}" y="${(yTop + yBot) / 2 + 4}" font-size="11.5" font-weight="800" fill="#dc2626">Difference = β₂ (+0.35)</text>`;
      }

      dummySvg.innerHTML = svg;
    }

    if (btnGroup0) {
      btnGroup0.addEventListener('click', () => {
        viewMode = '0';
        btnGroup0.classList.add('active');
        if (btnGroup1) btnGroup1.classList.remove('active');
        if (btnBoth) btnBoth.classList.remove('active');
        renderDummyGroupLab();
      });
    }
    if (btnGroup1) {
      btnGroup1.addEventListener('click', () => {
        viewMode = '1';
        btnGroup1.classList.add('active');
        if (btnGroup0) btnGroup0.classList.remove('active');
        if (btnBoth) btnBoth.classList.remove('active');
        renderDummyGroupLab();
      });
    }
    if (btnBoth) {
      btnBoth.addEventListener('click', () => {
        viewMode = 'both';
        btnBoth.classList.add('active');
        if (btnGroup0) btnGroup0.classList.remove('active');
        if (btnGroup1) btnGroup1.classList.remove('active');
        renderDummyGroupLab();
      });
    }

    renderDummyGroupLab();
  }

  // =========================================================================
  // 6. LESSON 5.6: PARALLEL REGRESSION LINES & CONTROL SHIFTER (#parallelLinesSvg)
  // =========================================================================
  const parSvg = document.getElementById('parallelLinesSvg');
  if (parSvg) {
    const sliderSlope = document.getElementById('parSliderSlope'); // beta3 (educ)
    const sliderGap = document.getElementById('parSliderGap'); // beta2 (male)
    const readoutSlope = document.getElementById('parReadoutSlope');
    const readoutGap = document.getElementById('parReadoutGap');

    const beta1 = 1.2; // Base intercept

    function renderParallelLines() {
      const bEduc = sliderSlope ? parseFloat(sliderSlope.value) : 0.08; // slope
      const bMale = sliderGap ? parseFloat(sliderGap.value) : 0.30; // vertical shift

      if (readoutSlope) readoutSlope.textContent = bEduc.toFixed(2);
      if (readoutGap) readoutGap.textContent = `+${bMale.toFixed(2)}`;

      const padL = 50, padR = 40, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 280 - padT - padB;

      const minX = 8, maxX = 20; // Education years
      const minY = 1.5, maxY = 3.5; // ln(wage)

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - ((y - minY) / (maxY - minY)) * plotH; }

      let svg = '';

      // Grid
      for (let x = 8; x <= 20; x += 2) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x}</text>`;
      }
      for (let y = 1.5; y <= 3.5; y += 0.5) {
        const sy = toY(y);
        svg += `<line x1="${padL}" y1="${sy}" x2="${padL + plotW}" y2="${sy}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${padL - 8}" y="${sy + 4}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="end">${y.toFixed(1)}</text>`;
      }

      // Line 1: male = 0 (Base group): y = beta1 + beta3 * educ
      const y0_start = beta1 + bEduc * minX;
      const y0_end = beta1 + bEduc * maxX;
      svg += `<line x1="${toX(minX)}" y1="${toY(y0_start)}" x2="${toX(maxX)}" y2="${toY(y0_end)}" stroke="#2563eb" stroke-width="2.5"/>`;
      svg += `<text x="${toX(maxX) + 4}" y="${toY(y0_end) + 4}" font-size="10.5" font-weight="700" fill="#2563eb">male = 0</text>`;

      // Line 2: male = 1: y = (beta1 + beta2) + beta3 * educ
      const y1_start = beta1 + bMale + bEduc * minX;
      const y1_end = beta1 + bMale + bEduc * maxX;
      svg += `<line x1="${toX(minX)}" y1="${toY(y1_start)}" x2="${toX(maxX)}" y2="${toY(y1_end)}" stroke="#059669" stroke-width="2.5"/>`;
      svg += `<text x="${toX(maxX) + 4}" y="${toY(y1_end) + 4}" font-size="10.5" font-weight="700" fill="#059669">male = 1</text>`;

      // Vertical distance gap bar at educ = 14 years
      const xEval = 14;
      const sxEval = toX(xEval);
      const sy0Eval = toY(beta1 + bEduc * xEval);
      const sy1Eval = toY(beta1 + bMale + bEduc * xEval);

      svg += `<line x1="${sxEval}" y1="${sy0Eval}" x2="${sxEval}" y2="${sy1Eval}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 2"/>`;
      svg += `<circle cx="${sxEval}" cy="${sy0Eval}" r="4" fill="#2563eb"/>`;
      svg += `<circle cx="${sxEval}" cy="${sy1Eval}" r="4" fill="#059669"/>`;
      svg += `<text x="${sxEval + 8}" y="${(sy0Eval + sy1Eval) / 2 + 4}" font-size="11" font-weight="800" fill="#dc2626">Vertical Gap = β₂ (+${bMale.toFixed(2)})</text>`;

      // Slope callout removed from in-chart; clear labels provided above chart
      parSvg.innerHTML = svg;
    }

    if (sliderSlope) sliderSlope.addEventListener('input', renderParallelLines);
    if (sliderGap) sliderGap.addEventListener('input', renderParallelLines);
    renderParallelLines();
  }

  // =========================================================================
  // 7. LESSON 5.7: LOG-DUMMY EXACT VS APPROXIMATE PERCENTAGE LAB (#exactVsApproxSvg)
  // =========================================================================
  const exactSvg = document.getElementById('exactVsApproxSvg');
  if (exactSvg) {
    const sliderBeta = document.getElementById('exactSliderBeta');
    const readoutBeta = document.getElementById('exactReadoutBeta');
    const readoutApprox = document.getElementById('exactReadoutApprox');
    const readoutExact = document.getElementById('exactReadoutExact');
    const readoutDivergence = document.getElementById('exactReadoutDivergence');
    const btnSource10 = document.getElementById('exactBtnSource10');
    const btnLarge40 = document.getElementById('exactBtnLarge40');
    const btnNegative = document.getElementById('exactBtnNegative');
    const urlParams = new URLSearchParams(window.location.search);
    const betaParam = urlParams.get('beta');
    if (sliderBeta && betaParam && !isNaN(parseFloat(betaParam))) {
      sliderBeta.value = betaParam;
    }

    function renderExactVsApprox() {
      const b2 = sliderBeta ? parseFloat(sliderBeta.value) : 0.10; // Default to example 0.10
      if (readoutBeta) readoutBeta.textContent = b2 >= 0 ? `+${b2.toFixed(2)}` : b2.toFixed(2);

      const approxPct = b2 * 100;
      const exactPct = (Math.exp(b2) - 1) * 100;
      const divergence = exactPct - approxPct;

      if (readoutApprox) readoutApprox.textContent = `${approxPct >= 0 ? '+' : ''}${approxPct.toFixed(1)}%`;
      if (readoutExact) readoutExact.textContent = `${exactPct >= 0 ? '+' : ''}${exactPct.toFixed(1)}%`;
      if (readoutDivergence) readoutDivergence.textContent = `${divergence >= 0 ? '+' : ''}${divergence.toFixed(2)} pts`;

      const padL = 60, padR = 40, padT = 24, padB = 48;
      const plotW = 580 - padL - padR;
      const plotH = 320 - padT - padB;

      const minB = -0.5, maxB = 0.5;
      const minPct = -60, maxPct = 80;

      function toX(b) { return padL + ((b - minB) / (maxB - minB)) * plotW; }
      function toY(p) { return padT + plotH - ((p - minPct) / (maxPct - minPct)) * plotH; }

      let svg = '';

      // Grid Lines & Ticks: Vertical (X-axis)
      const xTicks = [-0.5, -0.4, -0.2, 0.0, 0.2, 0.4, 0.5];
      xTicks.forEach(b => {
        const sx = toX(b);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        const label = b === 0 ? '0.0' : (b > 0 ? '+' + b.toFixed(1) : b.toFixed(1));
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono, monospace)" fill="#64748b" text-anchor="middle">${label}</text>`;
      });

      // Grid Lines & Ticks: Horizontal (Y-axis)
      for (let p = -60; p <= 80; p += 20) {
        const sy = toY(p);
        svg += `<line x1="${padL}" y1="${sy}" x2="${padL + plotW}" y2="${sy}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        const label = p > 0 ? `+${p}%` : `${p}%`;
        svg += `<text x="${padL - 8}" y="${sy + 3.5}" font-size="10" font-family="var(--font-mono, monospace)" fill="#64748b" text-anchor="end">${label}</text>`;
      }

      // Zero axes (prominent reference baselines)
      const syZero = toY(0);
      svg += `<line x1="${padL}" y1="${syZero}" x2="${padL + plotW}" y2="${syZero}" stroke="#94a3b8" stroke-width="1.3"/>`;
      const sxZero = toX(0);
      svg += `<line x1="${sxZero}" y1="${padT}" x2="${sxZero}" y2="${padT + plotH}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/>`;

      // Axis Titles
      svg += `<text x="${padL + plotW / 2}" y="${padT + plotH + 36}" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">Dummy Coefficient (β₂)</text>`;
      svg += `<text transform="rotate(-90)" x="${-(padT + plotH / 2)}" y="16" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">Percentage Effect (%Δy)</text>`;

      // Curve 1: Linear Approximation Line: y = 100 * beta (Dashed Gray)
      const yAppStart = minB * 100;
      const yAppEnd = maxB * 100;
      svg += `<line x1="${toX(minB)}" y1="${toY(yAppStart)}" x2="${toX(maxB)}" y2="${toY(yAppEnd)}" stroke="#64748b" stroke-width="2" stroke-dasharray="5 3"/>`;

      // Curve 2: Exact Percentage Curve: y = 100 * (exp(beta) - 1) (Solid Blue)
      let curveExact = '';
      for (let b = minB; b <= maxB + 0.001; b += 0.01) {
        const p = (Math.exp(b) - 1) * 100;
        const sx = toX(b);
        const sy = toY(p);
        if (curveExact === '') curveExact += `M ${sx.toFixed(1)} ${sy.toFixed(1)} `;
        else curveExact += `L ${sx.toFixed(1)} ${sy.toFixed(1)} `;
      }
      svg += `<path d="${curveExact}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      // Operating point vertical cursor at b2
      const sxB2 = toX(b2);
      const syApprox = toY(approxPct);
      const syExact = toY(exactPct);

      svg += `<line x1="${sxB2}" y1="${padT}" x2="${sxB2}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4 3"/>`;
      svg += `<circle cx="${sxB2}" cy="${syApprox}" r="5" fill="#64748b" stroke="#ffffff" stroke-width="1.5"/>`;
      svg += `<circle cx="${sxB2}" cy="${syExact}" r="5.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>`;

      // Dynamic On-Chart Point Callouts
      const isRightSide = b2 > 0.18;
      const anchor = isRightSide ? 'end' : 'start';
      const calloutX = isRightSide ? sxB2 - 10 : sxB2 + 10;

      // Exact callout label
      svg += `<text x="${calloutX}" y="${syExact - 6}" font-size="10.5" font-weight="700" fill="#2563eb" text-anchor="${anchor}">Exact: ${exactPct >= 0 ? '+' : ''}${exactPct.toFixed(1)}%</text>`;

      // Linear approx callout label
      svg += `<text x="${calloutX}" y="${syApprox + 14}" font-size="10" font-weight="600" fill="#64748b" text-anchor="${anchor}">Linear: ${approxPct >= 0 ? '+' : ''}${approxPct.toFixed(1)}%</text>`;

      // Divergence gap callout along vertical dashed line
      if (Math.abs(divergence) >= 3.0) {
        const midY = (syExact + syApprox) / 2;
        svg += `<text x="${calloutX}" y="${midY + 4}" font-size="9.5" font-weight="700" fill="#dc2626" text-anchor="${anchor}">Δ = ${divergence >= 0 ? '+' : ''}${divergence.toFixed(1)} pts</text>`;
      }

      // If benchmark b2 = 0.10, show highlight badge
      if (Math.abs(b2 - 0.10) < 0.015) {
        const badgeW = 184, badgeH = 26;
        const badgeX = Math.min(sxB2 + 12, padL + plotW - badgeW);
        const badgeY = Math.max(padT + 8, syExact - 34);
        svg += `<rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="${badgeH}" fill="rgba(37, 99, 235, 0.12)" stroke="#2563eb" stroke-width="1.2" rx="4"/>`;
        svg += `<text x="${badgeX + badgeW / 2}" y="${badgeY + 17}" font-size="10" font-weight="700" fill="#2563eb" text-anchor="middle">Benchmark: exp(0.10)−1 ≈ 10.5%</text>`;
      }

      exactSvg.innerHTML = svg;
    }

    if (sliderBeta) sliderBeta.addEventListener('input', renderExactVsApprox);
    if (btnSource10) {
      btnSource10.addEventListener('click', () => {
        if (sliderBeta) sliderBeta.value = '0.10';
        renderExactVsApprox();
      });
    }
    if (btnLarge40) {
      btnLarge40.addEventListener('click', () => {
        if (sliderBeta) sliderBeta.value = '0.40';
        renderExactVsApprox();
      });
    }
    if (btnNegative) {
      btnNegative.addEventListener('click', () => {
        if (sliderBeta) sliderBeta.value = '-0.30';
        renderExactVsApprox();
      });
    }

    renderExactVsApprox();
  }
});
