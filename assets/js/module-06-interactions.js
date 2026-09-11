/**
 * EcoIntuition Academy — Econometrics with AI
 * Module 6 Interactive Visualizations Controller
 * 
 * Includes:
 * 1. Lesson 6.1: Sanaz & Mike Cookie Correlation Lab (#cookieLabSvg)
 * 2. Lesson 6.2: Omitted Variables Variance & Precision Trade-Off (#precisionTradeoffSvg)
 * 3. Lesson 6.3: RCT Baseline Controls & Precision Simulator (#rctPrecisionSvg)
 * 4. Lesson 6.4: Interactive 2x2 Difference-in-Differences Calculator (#ddCalculatorSvg)
 * 5. Lesson 6.5: Parallel Trends & Counterfactual Visualizer (#parallelTrendsSvg)
 * 6. Lesson 6.6: Pre-Trend Slope Tester & No-Anticipation Timeline (#trendTestSvg)
 * 7. Lesson 6.7: DDD 3-Layer Decomposition Visualizer (#dddDecompositionSvg)
 * 8. Lesson 6.8: Philadelphia / Pittsburgh DDD 8-Group Means Explorer (#dddWorkedLabSvg)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Helper: Normal PDF
  function normalPdf(x, mu, sigma) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  }

  // =========================================================================
  // 1. LESSON 6.1: SANAZ & MIKE COOKIE CORRELATION LAB (#cookieLabSvg)
  // =========================================================================
  const cookieSvg = document.getElementById('cookieLabSvg');
  if (cookieSvg) {
    const beta1True = -2.0; // Sanaz
    const beta2True = -5.0; // Mike
    let currentScenario = 'together'; // 'together', 'partial', 'uncorr', 'avoid'

    const btnTogether = document.getElementById('cookieBtnTogether');
    const btnPartial = document.getElementById('cookieBtnPartial');
    const btnUncorr = document.getElementById('cookieBtnUncorr');
    const btnAvoid = document.getElementById('cookieBtnAvoid');

    const readoutCorr = document.getElementById('cookieReadoutCorr');
    const readoutSanaz = document.getElementById('cookieReadoutSanaz');
    const readoutBias = document.getElementById('cookieReadoutBias');
    const readoutBeta1Hat = document.getElementById('cookieReadoutBeta1Hat');
    const readoutInterp = document.getElementById('cookieReadoutInterp');

    const scenarios = {
      together: {
        corr: 1.0,
        beta1Hat: -7.0,
        bias: -5.0,
        label: 'Always Together',
        interp: 'Mike accompanies Sanaz on every trip. OLS erroneously attributes Mike’s cookie consumption (-5) to Sanaz. Her estimated coefficient drops to -7!'
      },
      partial: {
        corr: 0.5,
        beta1Hat: -4.5,
        bias: -2.5,
        label: 'Sometimes Together',
        interp: 'Mike and Sanaz take trips together about half the time. Sanaz absorbs half of Mike’s impact, yielding an estimate of -4.5.'
      },
      uncorr: {
        corr: 0.0,
        beta1Hat: -2.0,
        bias: 0.0,
        label: 'Uncorrelated (Independent)',
        interp: 'Trips by Sanaz and Mike are completely independent (X₁\'X₂ = 0). OVB is exactly ZERO. β̂₁ = -2.00 recovers the true parameter!'
      },
      avoid: {
        corr: -0.3,
        beta1Hat: -0.5,
        bias: +1.5,
        label: 'Avoid Each Other (Negative)',
        interp: 'When Sanaz visits the jar, Mike stays away. The negative relationship pulls the bias upward, making Sanaz appear to take fewer cookies (-0.5).'
      }
    };

    function updateScenario(scenKey) {
      currentScenario = scenKey;
      [btnTogether, btnPartial, btnUncorr, btnAvoid].forEach(btn => {
        if (btn) {
          btn.classList.remove('active', 'btn-primary');
          btn.classList.add('btn-outline');
        }
      });

      const activeBtn = {
        together: btnTogether,
        partial: btnPartial,
        uncorr: btnUncorr,
        avoid: btnAvoid
      }[scenKey];

      if (activeBtn) {
        activeBtn.classList.add('active', 'btn-primary');
        activeBtn.classList.remove('btn-outline');
      }

      renderCookieLab();
    }

    if (btnTogether) btnTogether.addEventListener('click', () => updateScenario('together'));
    if (btnPartial) btnPartial.addEventListener('click', () => updateScenario('partial'));
    if (btnUncorr) btnUncorr.addEventListener('click', () => updateScenario('uncorr'));
    if (btnAvoid) btnAvoid.addEventListener('click', () => updateScenario('avoid'));

    function renderCookieLab() {
      const data = scenarios[currentScenario];
      if (readoutCorr) readoutCorr.textContent = data.corr > 0 ? `+${data.corr.toFixed(1)}` : data.corr.toFixed(1);
      if (readoutSanaz) readoutSanaz.textContent = `${beta1True.toFixed(1)} cookies/trip`;
      if (readoutBias) {
        readoutBias.textContent = data.bias === 0 ? '0.00 (No OVB)' : (data.bias > 0 ? `+${data.bias.toFixed(1)}` : `${data.bias.toFixed(1)}`);
        readoutBias.style.color = data.bias === 0 ? '#059669' : '#dc2626';
      }
      if (readoutBeta1Hat) {
        readoutBeta1Hat.textContent = `${data.beta1Hat.toFixed(1)} cookies/trip`;
        readoutBeta1Hat.style.color = data.bias === 0 ? '#059669' : '#dc2626';
      }
      if (readoutInterp) readoutInterp.textContent = data.interp;

      // Draw SVG plot: Cookies remaining vs Sanaz trips
      const padL = 45, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = 0, maxX = 12;
      const minY = 0, maxY = 110;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - ((y - minY) / (maxY - minY)) * plotH; }

      let svg = '';

      // Grid & Axes
      for (let y = 20; y <= 100; y += 20) {
        const sy = toY(y);
        svg += `<line x1="${padL}" y1="${sy}" x2="${padL + plotW}" y2="${sy}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${padL - 8}" y="${sy + 4}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="end">${y}</text>`;
      }
      for (let x = 2; x <= 12; x += 2) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x}</text>`;
      }

      // Axis labels
      svg += `<text x="${padL + plotW / 2}" y="${padT + plotH + 34}" font-size="11" font-weight="600" fill="var(--color-text, #334155)" text-anchor="middle">Sanaz Trips (X₁)</text>`;
      svg += `<text x="14" y="${padT + plotH / 2}" font-size="11" font-weight="600" fill="var(--color-text, #334155)" text-anchor="middle" transform="rotate(-90 14 ${padT + plotH / 2})">Cookies Left (y)</text>`;

      // Baseline true relationship without Mike trips: y = 100 - 2*x
      const x0 = 0, y0True = 100;
      const xMaxTrue = 12, yMaxTrue = 100 + beta1True * 12; // 100 - 24 = 76
      svg += `<line x1="${toX(x0)}" y1="${toY(y0True)}" x2="${toX(xMaxTrue)}" y2="${toY(yMaxTrue)}" stroke="#059669" stroke-width="2.5" stroke-dasharray="4 3"/>`;

      // Estimated slope line: y = 100 + beta1Hat * x
      const xEndEst = data.beta1Hat < -8 ? (100 / Math.abs(data.beta1Hat)) : 12;
      svg += `<line x1="${toX(x0)}" y1="${toY(y0True)}" x2="${toX(xEndEst)}" y2="${toY(Math.max(0, 100 + data.beta1Hat * xEndEst))}" stroke="${data.bias === 0 ? '#059669' : '#dc2626'}" stroke-width="3"/>`;

      // Disturbance drop lines & observed dots
      const points = [
        { s: 1, m: currentScenario === 'together' ? 1 : (currentScenario === 'uncorr' ? 2 : 0) },
        { s: 2, m: currentScenario === 'together' ? 2 : (currentScenario === 'uncorr' ? 0 : 3) },
        { s: 4, m: currentScenario === 'together' ? 4 : (currentScenario === 'uncorr' ? 1 : 1) },
        { s: 6, m: currentScenario === 'together' ? 6 : (currentScenario === 'uncorr' ? 4 : 2) },
        { s: 8, m: currentScenario === 'together' ? 8 : (currentScenario === 'uncorr' ? 2 : 0) },
        { s: 10, m: currentScenario === 'together' ? 10 : (currentScenario === 'uncorr' ? 5 : 1) },
      ];

      points.forEach(pt => {
        const yActual = 100 - 2 * pt.s - 5 * pt.m + (Math.sin(pt.s) * 2);
        if (yActual >= 0) {
          svg += `<circle cx="${toX(pt.s)}" cy="${toY(yActual)}" r="4.5" fill="#3b82f6" opacity="0.85" stroke="#1d4ed8" stroke-width="1"/>`;
        }
      });

      // Update external legend swatch color dynamically
      const estLineEl = document.getElementById('cookieLegendEstLine');
      if (estLineEl) estLineEl.style.background = data.bias === 0 ? '#059669' : '#dc2626';

      // Format Lock: In-plot internal legend removed. The plot area is dedicated exclusively to axes, scatter, and fitted lines.

      cookieSvg.innerHTML = svg;
    }

    updateScenario('together');
  }

  // =========================================================================
  // 2. LESSON 6.2: PRECISION & BIAS TRADE-OFF EXPLORER (#precisionTradeoffSvg)
  // =========================================================================
  const precisionSvg = document.getElementById('precisionTradeoffSvg');
  if (precisionSvg) {
    let activeCase = 'case2'; // 'case1', 'case2', 'case3', 'case4'

    const btnCase1 = document.getElementById('precBtnCase1');
    const btnCase2 = document.getElementById('precBtnCase2');
    const btnCase3 = document.getElementById('precBtnCase3');
    const btnCase4 = document.getElementById('precBtnCase4');

    const readoutCaseTitle = document.getElementById('precReadoutTitle');
    const readoutBiasStatus = document.getElementById('precReadoutBias');
    const readoutSeStatus = document.getElementById('precReadoutSe');
    const readoutOmitImpact = document.getElementById('precReadoutImpact');

    const caseData = {
      case1: {
        title: 'Case 1: Uncorrelated & Irrelevant (X₁\'X₂ = 0, β₂ = 0)',
        bias: 'Unbiased (E[β̂₁] = β₁)',
        biasColor: '#059669',
        se: 'Slightly Lower SE when omitting X₂ (saves 1 df)',
        seColor: '#059669',
        omitImpact: 'Omitting X₂ is harmless and slightly improves precision because X₂ has no relationship with y or X₁.',
        muOmit: 0, seOmit: 0.35,
        muIncl: 0, seIncl: 0.37
      },
      case2: {
        title: 'Case 2: Correlated & Irrelevant (X₁\'X₂ ≠ 0, β₂ = 0)',
        bias: 'Unbiased (E[β̂₁] = β₁, since β₂ = 0)',
        biasColor: '#059669',
        se: 'STRONGLY HELPS PRECISION to Omit X₂',
        seColor: '#059669',
        omitImpact: 'KEY INSIGHT: This is the ONLY case where omitting X₂ unambiguously improves precision! Including collinear but useless X₂ inflates variance via multicollinearity.',
        muOmit: 0, seOmit: 0.28,
        muIncl: 0, seIncl: 0.58
      },
      case3: {
        title: 'Case 3: Uncorrelated & Relevant (X₁\'X₂ = 0, β₂ ≠ 0)',
        bias: 'Unbiased (E[β̂₁] = β₁, since X₁\'X₂ = 0)',
        biasColor: '#059669',
        se: 'HURTS PRECISION to Omit X₂ (SE increases)',
        seColor: '#dc2626',
        omitImpact: 'Leaving X₂ out leaves its variation in the error term (σ² increases). Including X₂ explains y and shrinks the standard error without inducing multicollinearity.',
        muOmit: 0, seOmit: 0.52,
        muIncl: 0, seIncl: 0.30
      },
      case4: {
        title: 'Case 4: Correlated & Relevant (X₁\'X₂ ≠ 0, β₂ ≠ 0)',
        bias: 'BIASED! OVB = (X₁\'X₁)⁻¹X₁\'X₂ β₂ ≠ 0',
        biasColor: '#dc2626',
        se: 'Ambiguous Effect on SE (σ² vs Collinearity)',
        seColor: '#d97706',
        omitImpact: 'SEVERE WARNING: Omitting X₂ causes severe OLS bias! Even if omitting X₂ happens to lower standard errors, an estimator centered on the wrong number is invalid.',
        muOmit: 0.75, seOmit: 0.33,
        muIncl: 0, seIncl: 0.44
      }
    };

    function setCase(cKey) {
      activeCase = cKey;
      [btnCase1, btnCase2, btnCase3, btnCase4].forEach(b => {
        if (b) {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline');
        }
      });
      const currBtn = { case1: btnCase1, case2: btnCase2, case3: btnCase3, case4: btnCase4 }[cKey];
      if (currBtn) {
        currBtn.classList.add('active', 'btn-primary');
        currBtn.classList.remove('btn-outline');
      }
      renderPrecisionLab();
    }

    if (btnCase1) btnCase1.addEventListener('click', () => setCase('case1'));
    if (btnCase2) btnCase2.addEventListener('click', () => setCase('case2'));
    if (btnCase3) btnCase3.addEventListener('click', () => setCase('case3'));
    if (btnCase4) btnCase4.addEventListener('click', () => setCase('case4'));

    function renderPrecisionLab() {
      const d = caseData[activeCase];
      if (readoutCaseTitle) readoutCaseTitle.textContent = d.title;
      if (readoutBiasStatus) {
        readoutBiasStatus.textContent = d.bias;
        readoutBiasStatus.style.color = d.biasColor;
      }
      if (readoutSeStatus) {
        readoutSeStatus.textContent = d.se;
        readoutSeStatus.style.color = d.seColor;
      }
      if (readoutOmitImpact) readoutOmitImpact.textContent = d.omitImpact;

      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = -1.8, maxX = 2.4;
      const maxY = 1.6;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - (y / maxY) * plotH; }

      let svg = '';

      // Grid
      for (let x = -1; x <= 2; x += 0.5) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x > 0 ? '+' + x.toFixed(1) : x.toFixed(1)}</text>`;
      }

      // True parameter vertical line at x = 0
      const xTrue = toX(0);
      svg += `<line x1="${xTrue}" y1="${padT}" x2="${xTrue}" y2="${padT + plotH}" stroke="#059669" stroke-width="2" stroke-dasharray="4 2"/>`;
      svg += `<text x="${xTrue}" y="${padT - 8}" font-size="10" font-weight="700" fill="#059669" text-anchor="middle">True β₁ = 0.0</text>`;

      // Curve 1: Omitting X2
      let polyOmit = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= maxX; x += 0.03) {
        polyOmit += `${toX(x)},${toY(normalPdf(x, d.muOmit, d.seOmit))} `;
      }
      polyOmit += `${toX(maxX)},${toY(0)}`;
      svg += `<polygon points="${polyOmit}" fill="${d.muOmit !== 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(37, 99, 235, 0.25)'}"/>`;
      let pathOmit = '';
      for (let x = minX; x <= maxX; x += 0.03) {
        pathOmit += `${x === minX ? 'M' : 'L'} ${toX(x)} ${toY(normalPdf(x, d.muOmit, d.seOmit))} `;
      }
      svg += `<path d="${pathOmit}" fill="none" stroke="${d.muOmit !== 0 ? '#dc2626' : '#2563eb'}" stroke-width="2.5"/>`;

      // Curve 2: Including X2 (always centered on 0, unbiased)
      let pathIncl = '';
      for (let x = minX; x <= maxX; x += 0.03) {
        pathIncl += `${x === minX ? 'M' : 'L'} ${toX(x)} ${toY(normalPdf(x, d.muIncl, d.seIncl))} `;
      }
      svg += `<path d="${pathIncl}" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5 3"/>`;

      // If biased, draw arrow from true parameter to center of biased estimator
      if (d.muOmit !== 0) {
        const xOmitCenter = toX(d.muOmit);
        svg += `<line x1="${xTrue}" y1="${toY(1.2)}" x2="${xOmitCenter}" y2="${toY(1.2)}" stroke="#dc2626" stroke-width="2"/>`;
        svg += `<text x="${(xTrue + xOmitCenter) / 2}" y="${toY(1.2) - 8}" font-size="10" font-weight="700" fill="#dc2626" text-anchor="middle">OVB Shift</text>`;
      }

      // Update external legend dynamic values (SE and swatch color)
      const legSeOmit = document.getElementById('precLegendSeOmit');
      const legSeIncl = document.getElementById('precLegendSeIncl');
      const legSwatchOmit = document.getElementById('precLegendSwatchOmit');

      if (legSeOmit) legSeOmit.textContent = `SE: ${d.seOmit.toFixed(2)}`;
      if (legSeIncl) legSeIncl.textContent = `SE: ${d.seIncl.toFixed(2)}`;
      if (legSwatchOmit) legSwatchOmit.style.background = d.muOmit !== 0 ? '#dc2626' : '#2563eb';

      // Format Lock: In-plot internal legend removed. Clean plotting area with zero curve overlap.

      precisionSvg.innerHTML = svg;
    }

    setCase('case2');
  }

  // =========================================================================
  // 3. LESSON 6.3: RCT BASELINE CONTROLS & PRECISION SIMULATOR (#rctPrecisionSvg)
  // =========================================================================
  const rctSvg = document.getElementById('rctPrecisionSvg');
  if (rctSvg) {
    let controlsActive = false;
    const btnToggleControls = document.getElementById('rctBtnToggleControls');
    const btnLoadFafsa = document.getElementById('rctBtnLoadFafsa');

    const readoutEstimate = document.getElementById('rctReadoutEstimate');
    const readoutSe = document.getElementById('rctReadoutSe');
    const readoutCi = document.getElementById('rctReadoutCi');
    const readoutPval = document.getElementById('rctReadoutPval');
    const readoutDesc = document.getElementById('rctReadoutDesc');

    function updateRctLab() {
      const betaHat = controlsActive ? 0.027 : 0.030;
      const se = controlsActive ? 0.015 : 0.017;
      const ciLower = betaHat - 1.96 * se;
      const ciUpper = betaHat + 1.96 * se;
      const pVal = controlsActive ? 0.071 : 0.078;

      if (readoutEstimate) readoutEstimate.textContent = `+${betaHat.toFixed(3)}`;
      if (readoutSe) {
        readoutSe.textContent = se.toFixed(3);
        readoutSe.style.color = controlsActive ? '#059669' : '#334155';
      }
      if (readoutCi) readoutCi.textContent = `[${ciLower.toFixed(3)}, ${ciUpper.toFixed(3)}]`;
      if (readoutPval) readoutPval.textContent = `p ≈ ${pVal.toFixed(3)}`;
      if (readoutDesc) {
        readoutDesc.textContent = controlsActive
          ? 'WITH CONTROLS: Baseline academic and socioeconomic covariates absorb error variance. Residual σ̂² falls, shrinking SE from 0.017 to 0.015, while the treatment effect stays virtually unchanged (0.027 vs 0.030) due to randomization!'
          : 'WITHOUT CONTROLS: Because treatment was randomly assigned, D is orthogonal to omitted covariates in expectation. The point estimate (0.030) is unbiased, but unabsorbed variation leaves SE wider (0.017).';
      }

      if (btnToggleControls) {
        btnToggleControls.textContent = controlsActive ? 'Remove Baseline Controls' : 'Include Baseline Controls';
        if (controlsActive) {
          btnToggleControls.classList.add('btn-primary');
          btnToggleControls.classList.remove('btn-outline');
        } else {
          btnToggleControls.classList.remove('btn-primary');
          btnToggleControls.classList.add('btn-outline');
        }
      }

      // Draw SVG
      const padL = 40, padR = 25, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minX = -0.03, maxX = 0.09;
      const minY = 0, maxY = 30;

      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toY(y) { return padT + plotH - ((y - minY) / (maxY - minY)) * plotH; }

      let svg = '';

      // Grid
      for (let x = -0.02; x <= 0.08; x += 0.02) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x.toFixed(2)}</text>`;
      }

      // Zero threshold line
      const s0 = toX(0);
      svg += `<line x1="${s0}" y1="${padT}" x2="${s0}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      svg += `<text x="${s0}" y="${padT - 8}" font-size="9.5" font-family="var(--font-mono)" fill="#dc2626" text-anchor="middle">No Effect (0.00)</text>`;

      // Curve: Sampling distribution of betaHat
      let poly = `${toX(minX)},${toY(0)} `;
      for (let x = minX; x <= maxX; x += 0.001) {
        poly += `${toX(x)},${toY(normalPdf(x, betaHat, se))} `;
      }
      poly += `${toX(maxX)},${toY(0)}`;
      svg += `<polygon points="${poly}" fill="${controlsActive ? 'rgba(5, 150, 105, 0.25)' : 'rgba(37, 99, 235, 0.25)'}"/>`;

      let curvePath = '';
      for (let x = minX; x <= maxX; x += 0.001) {
        curvePath += `${x === minX ? 'M' : 'L'} ${toX(x)} ${toY(normalPdf(x, betaHat, se))} `;
      }
      svg += `<path d="${curvePath}" fill="none" stroke="${controlsActive ? '#059669' : '#2563eb'}" stroke-width="2.5"/>`;

      // 95% Confidence interval bracket
      const yCi = toY(4);
      const xCiL = toX(ciLower);
      const xCiR = toX(ciUpper);
      svg += `<line x1="${xCiL}" y1="${yCi}" x2="${xCiR}" y2="${yCi}" stroke="#0f172a" stroke-width="2.5"/>`;
      svg += `<line x1="${xCiL}" y1="${yCi - 6}" x2="${xCiL}" y2="${yCi + 6}" stroke="#0f172a" stroke-width="2.5"/>`;
      svg += `<line x1="${xCiR}" y1="${yCi - 6}" x2="${xCiR}" y2="${yCi + 6}" stroke="#0f172a" stroke-width="2.5"/>`;
      svg += `<circle cx="${toX(betaHat)}" cy="${yCi}" r="4" fill="#0f172a"/>`;
      svg += `<text x="${toX(betaHat)}" y="${yCi + 18}" font-size="10" font-family="var(--font-mono)" font-weight="700" fill="#0f172a" text-anchor="middle">95% CI: [${ciLower.toFixed(3)}, ${ciUpper.toFixed(3)}]</text>`;

      rctSvg.innerHTML = svg;
    }

    if (btnToggleControls) {
      btnToggleControls.addEventListener('click', () => {
        controlsActive = !controlsActive;
        updateRctLab();
      });
    }

    if (btnLoadFafsa) {
      btnLoadFafsa.addEventListener('click', () => {
        controlsActive = true;
        updateRctLab();
      });
    }

    updateRctLab();
  }

  // =========================================================================
  // 4. LESSON 6.4: INTERACTIVE 2x2 DD CALCULATOR (#ddCalculatorSvg)
  // =========================================================================
  const ddSvg = document.getElementById('ddCalculatorSvg');
  if (ddSvg) {
    const sliderBeta1 = document.getElementById('ddSliderBeta1'); // Control Pre
    const sliderBeta2 = document.getElementById('ddSliderBeta2'); // Time shock
    const sliderBeta3 = document.getElementById('ddSliderBeta3'); // Pre diff
    const sliderBeta4 = document.getElementById('ddSliderBeta4'); // DD effect

    const readoutBeta1 = document.getElementById('ddReadoutBeta1');
    const readoutBeta2 = document.getElementById('ddReadoutBeta2');
    const readoutBeta3 = document.getElementById('ddReadoutBeta3');
    const readoutBeta4 = document.getElementById('ddReadoutBeta4');

    // Table elements
    const tblCtrlPre = document.getElementById('ddTblCtrlPre');
    const tblCtrlPost = document.getElementById('ddTblCtrlPost');
    const tblCtrlDiff = document.getElementById('ddTblCtrlDiff');
    const tblTrtPre = document.getElementById('ddTblTrtPre');
    const tblTrtPost = document.getElementById('ddTblTrtPost');
    const tblTrtDiff = document.getElementById('ddTblTrtDiff');
    const tblDiffPre = document.getElementById('ddTblDiffPre');
    const tblDiffPost = document.getElementById('ddTblDiffPost');
    const tblDdFinal = document.getElementById('ddTblDdFinal');

    function renderDdLab() {
      const b1 = sliderBeta1 ? parseFloat(sliderBeta1.value) : 20;
      const b2 = sliderBeta2 ? parseFloat(sliderBeta2.value) : 6;
      const b3 = sliderBeta3 ? parseFloat(sliderBeta3.value) : 10;
      const b4 = sliderBeta4 ? parseFloat(sliderBeta4.value) : 8;

      if (readoutBeta1) readoutBeta1.textContent = b1.toFixed(1);
      if (readoutBeta2) readoutBeta2.textContent = b2 >= 0 ? `+${b2.toFixed(1)}` : b2.toFixed(1);
      if (readoutBeta3) readoutBeta3.textContent = b3 >= 0 ? `+${b3.toFixed(1)}` : b3.toFixed(1);
      if (readoutBeta4) readoutBeta4.textContent = b4 >= 0 ? `+${b4.toFixed(1)}` : b4.toFixed(1);

      // Calculations
      const ctrlPre = b1;
      const ctrlPost = b1 + b2;
      const ctrlDiff = b2;

      const trtPre = b1 + b3;
      const trtCounterfactualPost = b1 + b2 + b3;
      const trtPost = b1 + b2 + b3 + b4;
      const trtDiff = b2 + b4;

      const diffPre = b3;
      const diffPost = b3 + b4;
      const ddEstimate = b4;

      // Update table
      if (tblCtrlPre) tblCtrlPre.textContent = ctrlPre.toFixed(1);
      if (tblCtrlPost) tblCtrlPost.textContent = ctrlPost.toFixed(1);
      if (tblCtrlDiff) tblCtrlDiff.textContent = ctrlDiff >= 0 ? `+${ctrlDiff.toFixed(1)}` : ctrlDiff.toFixed(1);

      if (tblTrtPre) tblTrtPre.textContent = trtPre.toFixed(1);
      if (tblTrtPost) tblTrtPost.textContent = trtPost.toFixed(1);
      if (tblTrtDiff) tblTrtDiff.textContent = trtDiff >= 0 ? `+${trtDiff.toFixed(1)}` : trtDiff.toFixed(1);

      if (tblDiffPre) tblDiffPre.textContent = diffPre >= 0 ? `+${diffPre.toFixed(1)}` : diffPre.toFixed(1);
      if (tblDiffPost) tblDiffPost.textContent = diffPost >= 0 ? `+${diffPost.toFixed(1)}` : diffPost.toFixed(1);
      if (tblDdFinal) tblDdFinal.textContent = ddEstimate >= 0 ? `+${ddEstimate.toFixed(1)}` : ddEstimate.toFixed(1);

      // Render SVG
      const padL = 60, padR = 60, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const minY = Math.min(0, b1 - 10);
      const maxY = Math.max(50, trtPost + 10);

      function toX(t) { return padL + (t === 'pre' ? 0.15 : 0.85) * plotW; }
      function toY(y) { return padT + plotH - ((y - minY) / (maxY - minY)) * plotH; }

      let svg = '';

      // Time axis lines
      const xPre = toX('pre');
      const xPost = toX('post');

      svg += `<line x1="${xPre}" y1="${padT}" x2="${xPre}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
      svg += `<line x1="${xPost}" y1="${padT}" x2="${xPost}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;

      svg += `<text x="${xPre}" y="${padT + plotH + 20}" font-size="12" font-weight="700" fill="var(--color-text)" text-anchor="middle">PRE (Time = 0)</text>`;
      svg += `<text x="${xPost}" y="${padT + plotH + 20}" font-size="12" font-weight="700" fill="var(--color-text)" text-anchor="middle">POST (Time = 1)</text>`;

      // Control Line
      svg += `<line x1="${xPre}" y1="${toY(ctrlPre)}" x2="${xPost}" y2="${toY(ctrlPost)}" stroke="#64748b" stroke-width="2.5"/>`;
      svg += `<circle cx="${xPre}" cy="${toY(ctrlPre)}" r="5" fill="#64748b"/>`;
      svg += `<circle cx="${xPost}" cy="${toY(ctrlPost)}" r="5" fill="#64748b"/>`;
      svg += `<text x="${xPre - 10}" y="${toY(ctrlPre) + 4}" font-size="11" font-family="var(--font-mono)" fill="#64748b" text-anchor="end">β₁ (${ctrlPre.toFixed(0)})</text>`;
      svg += `<text x="${xPost + 10}" y="${toY(ctrlPost) + 4}" font-size="11" font-family="var(--font-mono)" fill="#64748b" text-anchor="start">β₁+β₂ (${ctrlPost.toFixed(0)})</text>`;

      // Treated Counterfactual line
      svg += `<line x1="${xPre}" y1="${toY(trtPre)}" x2="${xPost}" y2="${toY(trtCounterfactualPost)}" stroke="#2563eb" stroke-width="2" stroke-dasharray="5 3" opacity="0.6"/>`;
      svg += `<circle cx="${xPost}" cy="${toY(trtCounterfactualPost)}" r="4" fill="none" stroke="#2563eb" stroke-width="2"/>`;
      svg += `<text x="${xPost + 10}" y="${toY(trtCounterfactualPost) + 14}" font-size="10" font-family="var(--font-mono)" fill="#2563eb" opacity="0.8">Counterfactual (${trtCounterfactualPost.toFixed(0)})</text>`;

      // Treated Observed Line
      svg += `<line x1="${xPre}" y1="${toY(trtPre)}" x2="${xPost}" y2="${toY(trtPost)}" stroke="#2563eb" stroke-width="3"/>`;
      svg += `<circle cx="${xPre}" cy="${toY(trtPre)}" r="6" fill="#2563eb"/>`;
      svg += `<circle cx="${xPost}" cy="${toY(trtPost)}" r="6" fill="#2563eb"/>`;
      svg += `<text x="${xPre - 10}" y="${toY(trtPre) - 8}" font-size="11" font-family="var(--font-mono)" fill="#2563eb" text-anchor="end">β₁+β₃ (${trtPre.toFixed(0)})</text>`;
      svg += `<text x="${xPost + 10}" y="${toY(trtPost) - 6}" font-size="11" font-family="var(--font-mono)" font-weight="700" fill="#2563eb" text-anchor="start">Observed (${trtPost.toFixed(0)})</text>`;

      // Treatment effect bracket β4
      const yCf = toY(trtCounterfactualPost);
      const yObs = toY(trtPost);
      const xBrack = xPost + 6;
      svg += `<line x1="${xBrack}" y1="${yCf}" x2="${xBrack}" y2="${yObs}" stroke="#059669" stroke-width="3"/>`;
      svg += `<line x1="${xBrack - 4}" y1="${yCf}" x2="${xBrack + 4}" y2="${yCf}" stroke="#059669" stroke-width="2"/>`;
      svg += `<line x1="${xBrack - 4}" y1="${yObs}" x2="${xBrack + 4}" y2="${yObs}" stroke="#059669" stroke-width="2"/>`;
      svg += `<text x="${xBrack + 12}" y="${(yCf + yObs) / 2 + 4}" font-size="12" font-family="var(--font-mono)" font-weight="800" fill="#059669">DD: β₄ = ${b4.toFixed(1)}</text>`;

      ddSvg.innerHTML = svg;
    }

    [sliderBeta1, sliderBeta2, sliderBeta3, sliderBeta4].forEach(s => {
      if (s) s.addEventListener('input', renderDdLab);
    });

    renderDdLab();
  }

  // =========================================================================
  // 5. LESSON 6.5: PARALLEL TRENDS & COUNTERFACTUAL VISUALIZER (#parallelTrendsSvg)
  // =========================================================================
  const ptSvg = document.getElementById('parallelTrendsSvg');
  if (ptSvg) {
    let preDivergence = 0; // 0 = parallel, >0 = treated upward trend, <0 = treated downward trend

    const btnParallel = document.getElementById('ptBtnParallel');
    const btnDivergentUp = document.getElementById('ptBtnDivergentUp');
    const btnDivergentDown = document.getElementById('ptBtnDivergentDown');

    const readoutStatus = document.getElementById('ptReadoutStatus');
    const readoutDesc = document.getElementById('ptReadoutDesc');

    function setPreTrend(mode) {
      if (mode === 'parallel') preDivergence = 0;
      if (mode === 'up') preDivergence = 4;
      if (mode === 'down') preDivergence = -4;

      [btnParallel, btnDivergentUp, btnDivergentDown].forEach(b => {
        if (b) {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline');
        }
      });
      const curr = { parallel: btnParallel, up: btnDivergentUp, down: btnDivergentDown }[mode];
      if (curr) {
        curr.classList.add('active', 'btn-primary');
        curr.classList.remove('btn-outline');
      }
      renderParallelTrendsLab();
    }

    if (btnParallel) btnParallel.addEventListener('click', () => setPreTrend('parallel'));
    if (btnDivergentUp) btnDivergentUp.addEventListener('click', () => setPreTrend('up'));
    if (btnDivergentDown) btnDivergentDown.addEventListener('click', () => setPreTrend('down'));

    function renderParallelTrendsLab() {
      const isValid = preDivergence === 0;
      if (readoutStatus) {
        readoutStatus.textContent = isValid ? 'VALID IDENTIFICATION (Parallel Trends Hold)' : 'INVALID IDENTIFICATION (Parallel Trends Violated!)';
        readoutStatus.style.color = isValid ? '#059669' : '#dc2626';
      }
      if (readoutDesc) {
        readoutDesc.textContent = isValid
          ? 'Treated and control units follow parallel trajectories prior to policy implementation. The untreated change in the control group accurately estimates what would have happened to the treated group without the policy.'
          : (preDivergence > 0
            ? 'WARNING: The treated group was already growing faster before treatment. Standard DD will falsely credit this pre-existing trajectory to the policy, biasing β̂₄ UPWARD!'
            : 'WARNING: The treated group was already lagging before treatment. Standard DD will conflate pre-existing decline with policy impact, biasing β̂₄ DOWNWARD!');
      }

      const padL = 45, padR = 30, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      // Time periods: -2, -1, 0 (Pre), +1 (Post)
      const periods = [-2, -1, 0, 1];
      function toX(t) { return padL + ((t + 2) / 3) * plotW; }
      function toY(y) { return padT + plotH - ((y - 10) / 45) * plotH; }

      let svg = '';

      // Vertical line separating Pre and Post
      const xCut = toX(0);
      svg += `<line x1="${xCut}" y1="${padT}" x2="${xCut}" y2="${padT + plotH}" stroke="var(--border-subtle, #cbd5e1)" stroke-width="2" stroke-dasharray="4 3"/>`;
      svg += `<text x="${xCut - 6}" y="${padT + 12}" font-size="10" font-weight="700" fill="#64748b" text-anchor="end">PRE-TREATMENT</text>`;
      svg += `<text x="${xCut + 6}" y="${padT + 12}" font-size="10" font-weight="700" fill="#64748b" text-anchor="start">POST</text>`;

      // Period labels
      periods.forEach(t => {
        const sx = toX(t);
        svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="11" font-family="var(--font-mono)" fill="var(--color-text)" text-anchor="middle">t = ${t}</text>`;
      });

      // Control Group data (linear slope of +2 per period)
      const ctrlPoints = periods.map(t => ({ t, y: 19 + t * 2 }));
      let ctrlPath = '';
      ctrlPoints.forEach((p, idx) => {
        ctrlPath += `${idx === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.y)} `;
      });
      svg += `<path d="${ctrlPath}" fill="none" stroke="#64748b" stroke-width="2.5"/>`;
      ctrlPoints.forEach(p => {
        svg += `<circle cx="${toX(p.t)}" cy="${toY(p.y)}" r="4.5" fill="#64748b"/>`;
      });
      svg += `<text x="${toX(1) + 8}" y="${toY(21) + 4}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b">Control Path</text>`;

      // Treated Group Pre Data
      const trtPrePoints = [-2, -1, 0].map(t => ({ t, y: 28 + t * (2 + preDivergence / 2) }));
      let trtPrePath = '';
      trtPrePoints.forEach((p, idx) => {
        trtPrePath += `${idx === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.y)} `;
      });
      svg += `<path d="${trtPrePath}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;
      trtPrePoints.forEach(p => {
        svg += `<circle cx="${toX(p.t)}" cy="${toY(p.y)}" r="5" fill="#2563eb"/>`;
      });

      // Treated Counterfactual at t=1: parallel to control slope (+2 from t=0)
      const trtCounterfactualY1 = 28 + 2; // 30
      svg += `<line x1="${toX(0)}" y1="${toY(28)}" x2="${toX(1)}" y2="${toY(trtCounterfactualY1)}" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 3" opacity="0.65"/>`;
      svg += `<circle cx="${toX(1)}" cy="${toY(trtCounterfactualY1)}" r="4" fill="none" stroke="#2563eb" stroke-width="2"/>`;
      svg += `<text x="${toX(1) + 8}" y="${toY(trtCounterfactualY1) + 12}" font-size="10" font-family="var(--font-mono)" fill="#2563eb" opacity="0.8">Counterfactual Path</text>`;

      // Treated Observed at t=1 (policy adds +10 effect)
      const trtObservedY1 = (28 + (2 + preDivergence / 2)) + 10;
      svg += `<line x1="${toX(0)}" y1="${toY(28)}" x2="${toX(1)}" y2="${toY(trtObservedY1)}" stroke="#2563eb" stroke-width="3"/>`;
      svg += `<circle cx="${toX(1)}" cy="${toY(trtObservedY1)}" r="6" fill="#2563eb"/>`;
      svg += `<text x="${toX(1) + 8}" y="${toY(trtObservedY1) - 4}" font-size="10.5" font-family="var(--font-mono)" font-weight="700" fill="#2563eb">Observed Treated</text>`;

      // Gap bracket
      const yTop = toY(trtObservedY1);
      const yBot = toY(trtCounterfactualY1);
      const xBrack = toX(1) + 4;
      svg += `<line x1="${xBrack}" y1="${yBot}" x2="${xBrack}" y2="${yTop}" stroke="#059669" stroke-width="3"/>`;
      svg += `<text x="${xBrack + 8}" y="${(yTop + yBot) / 2 + 4}" font-size="11" font-family="var(--font-mono)" font-weight="700" fill="#059669">Causal Effect</text>`;

      ptSvg.innerHTML = svg;
    }

    setPreTrend('parallel');
  }

  // =========================================================================
  // 6. LESSON 6.6: PRE-TREND SLOPE TESTER & NO-ANTICIPATION LAB (#trendTestSvg)
  // =========================================================================
  const trendSvg = document.getElementById('trendTestSvg');
  if (trendSvg) {
    let activeMode = 'testing'; // Single source of truth: 'testing' | 'anticipation'
    let beta3DiffSlope = 0.0; // Differential slope in testing mode (-0.50 to +0.50)
    let anticipationLevel = 'strong'; // 'none' | 'moderate' | 'strong'

    // DOM Elements
    const tabTesting = document.getElementById('trendTabTesting');
    const tabAnticipation = document.getElementById('trendTabAnticipation');
    const controlsTesting = document.getElementById('trendModeTestingControls');
    const controlsAnticipation = document.getElementById('trendModeAnticipationControls');
    const sliderDiff = document.getElementById('trendSliderDiff');
    const readoutDiff = document.getElementById('trendReadoutDiff');
    const antBtnNone = document.getElementById('antBtnNone');
    const antBtnModerate = document.getElementById('antBtnModerate');
    const antBtnStrong = document.getElementById('antBtnStrong');
    const readoutAnticipation = document.getElementById('trendReadoutAnticipation');
    const statusBanner = document.getElementById('trendStatusBanner');
    const readoutDecision = document.getElementById('trendReadoutDecision');
    const readoutExpl = document.getElementById('trendReadoutExpl');
    const legendContainer = document.getElementById('trendLegendContainer');

    // 5-box explanation cards
    const cardSeeing = document.getElementById('trendCardSeeing');
    const cardNotice = document.getElementById('trendCardNotice');
    const cardWhy = document.getElementById('trendCardWhy');
    const cardInterp = document.getElementById('trendCardInterp');
    const cardTry = document.getElementById('trendCardTry');

    function renderTrendLab() {
      // 1. Controls Visibility & Button Active Classes
      if (controlsTesting) controlsTesting.style.display = (activeMode === 'testing') ? 'block' : 'none';
      if (controlsAnticipation) controlsAnticipation.style.display = (activeMode === 'anticipation') ? 'block' : 'none';

      if (tabTesting) {
        if (activeMode === 'testing') {
          tabTesting.classList.add('active', 'btn-primary');
          tabTesting.classList.remove('btn-outline');
        } else {
          tabTesting.classList.remove('active', 'btn-primary');
          tabTesting.classList.add('btn-outline');
        }
      }
      if (tabAnticipation) {
        if (activeMode === 'anticipation') {
          tabAnticipation.classList.add('active', 'btn-primary');
          tabAnticipation.classList.remove('btn-outline');
        } else {
          tabAnticipation.classList.remove('active', 'btn-primary');
          tabAnticipation.classList.add('btn-outline');
        }
      }

      // 2. State & Text Updates
      if (activeMode === 'testing') {
        if (sliderDiff && readoutDiff) {
          beta3DiffSlope = parseFloat(sliderDiff.value);
          readoutDiff.textContent = (beta3DiffSlope >= 0 ? '+' : '') + beta3DiffSlope.toFixed(2);
        }

        const isVisuallyParallel = Math.abs(beta3DiffSlope) <= 0.15;
        if (readoutDecision) {
          readoutDecision.textContent = isVisuallyParallel
            ? 'PARALLEL PRE-TRENDS (β₃ ≈ 0.00)'
            : 'PRE-TREND DIVERGENCE DETECTED';
          readoutDecision.style.color = isVisuallyParallel ? '#059669' : '#dc2626';
        }
        if (statusBanner) {
          statusBanner.style.borderLeftColor = isVisuallyParallel ? '#059669' : '#dc2626';
        }
        if (readoutExpl) {
          readoutExpl.textContent = isVisuallyParallel
            ? 'Control and treated groups track parallel trajectories prior to treatment (Illustrative visual threshold: |β₃| ≤ 0.15).'
            : 'β₃ differs materially from 0 in this illustrative lab. The treated group was already drifting on a different slope prior to any policy intervention.';
        }

        // Legend for Testing Mode
        if (legendContainer) {
          legendContainer.setAttribute('aria-label', 'Pre-Trend Slope Testing Legend');
          legendContainer.innerHTML = `
            <span class="visual-legend-item">
              <span class="visual-legend-swatch--line" style="background: #64748b;" aria-hidden="true"></span>
              <span class="visual-legend-label">Control Group</span>
            </span>
            <span class="visual-legend-item">
              <span class="visual-legend-swatch--line" style="background: ${isVisuallyParallel ? '#2563eb' : '#dc2626'};" aria-hidden="true"></span>
              <span class="visual-legend-label">Treated Group</span>
            </span>
            <span class="visual-legend-item">
              <span class="visual-legend-swatch--dashed" style="border-color: #94a3b8;" aria-hidden="true"></span>
              <span class="visual-legend-label">Parallel Benchmark</span>
            </span>
          `;
        }

        // Explanation Cards for Testing Mode
        if (cardSeeing) cardSeeing.textContent = 'Two groups before treatment. The slider changes the difference between their pre-treatment slopes.';
        if (cardNotice) cardNotice.textContent = 'When β₃ is close to zero, both groups move similarly over time. As β₃ moves away from zero, the treated group develops a visibly different pre-treatment trend.';
        if (cardWhy) cardWhy.textContent = 'Difference-in-Differences requires a credible counterfactual trend. Systematically different pre-treatment slopes cast doubt on the parallel-trends assumption.';
        if (cardInterp) cardInterp.textContent = 'In a regression containing a group-specific time trend, β₃ captures the differential trend between groups under the source specification. Evidence that this term differs from zero suggests the groups may not share the same linear pre-trend.';
        if (cardTry) cardTry.textContent = 'Move β₃ in both positive and negative directions and observe how the two trajectories stop moving in parallel.';

        // Draw SVG: Pre-treatment periods only (t = -3, -2, -1, 0)
        renderTestingSvg(isVisuallyParallel);

      } else {
        // ANTICIPATION MODE
        // Update anticipation buttons
        [
          { btn: antBtnNone, key: 'none' },
          { btn: antBtnModerate, key: 'moderate' },
          { btn: antBtnStrong, key: 'strong' }
        ].forEach(item => {
          if (!item.btn) return;
          if (anticipationLevel === item.key) {
            item.btn.classList.add('active', 'btn-primary');
            item.btn.classList.remove('btn-outline');
          } else {
            item.btn.classList.remove('active', 'btn-primary');
            item.btn.classList.add('btn-outline');
          }
        });

        const hasAnticipation = anticipationLevel !== 'none';
        if (readoutAnticipation) {
          if (anticipationLevel === 'none') {
            readoutAnticipation.textContent = 'None (Clean Pre-Period)';
            readoutAnticipation.style.color = '#059669';
          } else if (anticipationLevel === 'moderate') {
            readoutAnticipation.textContent = 'Moderate Response (Early Decline)';
            readoutAnticipation.style.color = '#d97706';
          } else {
            readoutAnticipation.textContent = 'Strong Response (Contaminated)';
            readoutAnticipation.style.color = '#dc2626';
          }
        }

        if (readoutDecision) {
          if (hasAnticipation) {
            readoutDecision.textContent = '⚠ ANTICIPATION DETECTED';
            readoutDecision.style.color = '#dc2626';
          } else {
            readoutDecision.textContent = '✓ CLEAN PRE-PERIOD (NO ANTICIPATION)';
            readoutDecision.style.color = '#059669';
          }
        }
        if (statusBanner) {
          statusBanner.style.borderLeftColor = hasAnticipation ? '#dc2626' : '#059669';
        }
        if (readoutExpl) {
          readoutExpl.textContent = hasAnticipation
            ? 'The treatment group begins changing before the official policy date. Nominal pre-treatment observations may therefore already contain treatment-related behavior.'
            : 'Treatment group remains on its baseline trajectory until the official policy rollout date. No behavioral adjustment occurs in advance.';
        }

        // Legend for Anticipation Mode: external legend rule
        if (legendContainer) {
          legendContainer.setAttribute('aria-label', 'Cigarette Tax Anticipation Legend');
          legendContainer.innerHTML = `
            <span class="visual-legend-item">
              <span class="visual-legend-swatch--line" style="background: #2563eb;" aria-hidden="true"></span>
              <span class="visual-legend-label">Treated Group</span>
            </span>
            <span class="visual-legend-item">
              <span class="visual-legend-swatch--line" style="background: #64748b;" aria-hidden="true"></span>
              <span class="visual-legend-label">Control Group</span>
            </span>
            <span class="visual-legend-item">
              <span class="visual-legend-swatch--dashed" style="border-color: #f59e0b;" aria-hidden="true"></span>
              <span class="visual-legend-label">Official Policy Rollout (t = 2)</span>
            </span>
          `;
        }

        // Explanation Cards for Anticipation Mode
        if (cardSeeing) cardSeeing.textContent = 'The policy officially begins at t = 2, but the treated group starts responding at t = 1 after learning that the policy is coming.';
        if (cardNotice) cardNotice.textContent = 'The period t = 1 is labelled “pre-treatment” by the official policy date, yet behavior has already changed.';
        if (cardWhy) cardWhy.textContent = 'If t = 1 is used as an untreated baseline, the Difference-in-Differences comparison is contaminated. Part of the treatment response has already occurred before the nominal post period.';
        if (cardInterp) cardInterp.textContent = 'The no-anticipation assumption requires units not to alter outcomes because of the future treatment before treatment officially begins.';
        if (cardTry) cardTry.textContent = 'Compare a case with no anticipatory response against a strong anticipatory response and see how the apparent pre/post difference changes.';

        // Draw SVG: Timeline t = 0 (baseline), t = 1 (announcement), t = 2 (rollout), t = 3 (post)
        renderAnticipationSvg();
      }
    }

    // Helper: Draw Mode 1 Testing SVG (Pre-treatment periods only: t = -3, -2, -1, 0)
    function renderTestingSvg(isVisuallyParallel) {
      const padL = 45, padR = 75, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const prePeriods = [-3, -2, -1, 0];
      function toX(t) { return padL + ((t + 3) / 3) * plotW; }
      function toY(y) { return padT + plotH - ((y - 10) / 40) * plotH; }

      let svg = '';

      // Grid lines & Axis labels
      prePeriods.forEach(t => {
        const sx = toX(t);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="rgba(148, 163, 184, 0.2)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="11" font-family="var(--font-mono)" fill="var(--color-text)" text-anchor="middle">t = ${t}</text>`;
      });

      // Control group: Baseline 18, constant slope +2
      const ctrlPts = prePeriods.map(t => ({ t, y: 18 + (t + 3) * 2 }));
      let pCtrl = '';
      ctrlPts.forEach((p, idx) => pCtrl += `${idx === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.y)} `);
      svg += `<path d="${pCtrl}" fill="none" stroke="#64748b" stroke-width="2.5"/>`;
      ctrlPts.forEach(p => {
        svg += `<circle cx="${toX(p.t)}" cy="${toY(p.y)}" r="4.5" fill="#64748b"/>`;
      });
      // End label for Control (ample margin, not clipped)
      const ctrlLast = ctrlPts[ctrlPts.length - 1];
      svg += `<text x="${toX(ctrlLast.t) + 8}" y="${toY(ctrlLast.y) + 4}" font-size="11" font-weight="700" fill="#64748b">Control</text>`;

      // Parallel Benchmark for Treated: baseline 26, slope +2
      const benchPts = prePeriods.map(t => ({ t, y: 26 + (t + 3) * 2 }));
      let pBench = '';
      benchPts.forEach((p, idx) => pBench += `${idx === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.y)} `);
      svg += `<path d="${pBench}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>`;

      // Treated group: Baseline 26, slope 2 + beta3DiffSlope * 4
      const trtSlope = 2 + beta3DiffSlope * 4;
      const trtPts = prePeriods.map(t => ({ t, y: 26 + (t + 3) * trtSlope }));
      const trtColor = isVisuallyParallel ? '#2563eb' : '#dc2626';
      let pTrt = '';
      trtPts.forEach((p, idx) => pTrt += `${idx === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.y)} `);
      svg += `<path d="${pTrt}" fill="none" stroke="${trtColor}" stroke-width="3"/>`;
      trtPts.forEach(p => {
        svg += `<circle cx="${toX(p.t)}" cy="${toY(p.y)}" r="5" fill="${trtColor}"/>`;
      });
      // End label for Treated (ample margin, not clipped)
      const trtLast = trtPts[trtPts.length - 1];
      svg += `<text x="${toX(trtLast.t) + 8}" y="${toY(trtLast.y) + 4}" font-size="11" font-weight="700" fill="${trtColor}">Treated</text>`;

      // Annotate testing zone
      svg += `<text x="${padL + 6}" y="${padT + 14}" font-size="10" font-family="var(--font-mono)" font-weight="700" fill="#64748b">PRE-TREATMENT DIAGNOSTIC WINDOW</text>`;

      trendSvg.innerHTML = svg;
    }

    // Helper: Draw Mode 2 Anticipation SVG (Timeline: t = 0, 1, 2, 3)
    function renderAnticipationSvg() {
      const padL = 45, padR = 75, padT = 32, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      const periods = [0, 1, 2, 3];
      function toX(t) { return padL + (t / 3) * plotW; }
      function toY(y) { return padT + plotH - ((y - 10) / 40) * plotH; }

      let svg = '';

      // Official Policy Rollout Line at t = 2 (dashed amber)
      const xPol = toX(2);
      svg += `<line x1="${xPol}" y1="${padT}" x2="${xPol}" y2="${padT + plotH}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/>`;
      svg += `<text x="${xPol}" y="${padT - 8}" font-size="10" font-weight="700" fill="#d97706" text-anchor="middle">Official Policy Rollout (t = 2)</text>`;

      // X-Axis tick labels with context
      periods.forEach(t => {
        const sx = toX(t);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="rgba(148, 163, 184, 0.2)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 16}" font-size="11" font-family="var(--font-mono)" fill="var(--color-text)" text-anchor="middle">t = ${t}</text>`;
      });

      // Sublabels under t=0, t=1, t=2, t=3
      svg += `<text x="${toX(0)}" y="${padT + plotH + 28}" font-size="9" fill="var(--color-text-secondary)" text-anchor="middle">Baseline</text>`;
      svg += `<text x="${toX(1)}" y="${padT + plotH + 28}" font-size="9" fill="#dc2626" font-weight="600" text-anchor="middle">Announcement</text>`;
      svg += `<text x="${toX(2)}" y="${padT + plotH + 28}" font-size="9" fill="#d97706" font-weight="600" text-anchor="middle">Implementation</text>`;
      svg += `<text x="${toX(3)}" y="${padT + plotH + 28}" font-size="9" fill="var(--color-text-secondary)" text-anchor="middle">Post-Period</text>`;

      // Control Group: Flat baseline at 20 across all periods
      const ctrlPts = periods.map(t => ({ t, y: 20 }));
      let pCtrl = '';
      ctrlPts.forEach((p, idx) => pCtrl += `${idx === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.y)} `);
      svg += `<path d="${pCtrl}" fill="none" stroke="#64748b" stroke-width="2.5"/>`;
      ctrlPts.forEach(p => {
        svg += `<circle cx="${toX(p.t)}" cy="${toY(p.y)}" r="4.5" fill="#64748b"/>`;
      });
      svg += `<text x="${toX(3) + 8}" y="${toY(20) + 4}" font-size="11" font-weight="700" fill="#64748b">Control</text>`;

      // Treated Group: Baseline y0 = 36
      // In anticipation mode, at t=1 response starts!
      let dropT1 = 0;
      let dropT2 = 14;
      if (anticipationLevel === 'none') {
        dropT1 = 0;
      } else if (anticipationLevel === 'moderate') {
        dropT1 = 4.5;
      } else { // strong
        dropT1 = 8.5;
      }

      const y0 = 36;
      const y1 = 36 - dropT1;
      const y2 = 36 - dropT1 - dropT2;
      const y3 = y2 - 1.5;

      const trtPts = [
        { t: 0, y: y0 },
        { t: 1, y: y1 },
        { t: 2, y: y2 },
        { t: 3, y: y3 }
      ];

      const trtLineColor = anticipationLevel === 'none' ? '#2563eb' : '#dc2626';
      let pTrt = '';
      trtPts.forEach((p, idx) => pTrt += `${idx === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.y)} `);
      svg += `<path d="${pTrt}" fill="none" stroke="${trtLineColor}" stroke-width="3"/>`;
      trtPts.forEach(p => {
        svg += `<circle cx="${toX(p.t)}" cy="${toY(p.y)}" r="5" fill="${trtLineColor}"/>`;
      });
      svg += `<text x="${toX(3) + 8}" y="${toY(y3) + 4}" font-size="11" font-weight="700" fill="${trtLineColor}">Treated</text>`;

      // If anticipation present, draw attention callout at t=1
      if (anticipationLevel !== 'none') {
        const x1 = toX(1);
        const yDrop = toY(y1);
        svg += `<line x1="${x1}" y1="${toY(y0)}" x2="${x1}" y2="${yDrop}" stroke="#dc2626" stroke-width="2" stroke-dasharray="2 2"/>`;
        svg += `<text x="${x1}" y="${yDrop - 12}" font-size="10" font-weight="700" fill="#dc2626" text-anchor="middle">Anticipatory Reaction (t=1)</text>`;
      }

      trendSvg.innerHTML = svg;
    }

    // Event Listeners
    if (sliderDiff) {
      sliderDiff.addEventListener('input', () => {
        renderTrendLab();
      });
    }

    if (tabTesting) {
      tabTesting.addEventListener('click', () => {
        activeMode = 'testing';
        renderTrendLab();
      });
    }

    if (tabAnticipation) {
      tabAnticipation.addEventListener('click', () => {
        activeMode = 'anticipation';
        renderTrendLab();
      });
    }

    if (antBtnNone) {
      antBtnNone.addEventListener('click', () => {
        anticipationLevel = 'none';
        renderTrendLab();
      });
    }

    if (antBtnModerate) {
      antBtnModerate.addEventListener('click', () => {
        anticipationLevel = 'moderate';
        renderTrendLab();
      });
    }

    if (antBtnStrong) {
      antBtnStrong.addEventListener('click', () => {
        anticipationLevel = 'strong';
        renderTrendLab();
      });
    }

    // Initial render
    renderTrendLab();
  }

  // =========================================================================
  // 7. LESSON 6.7: DDD 3-LAYER DECOMPOSITION VISUALIZER (#dddDecompositionSvg)
  // =========================================================================
  const dddSvg = document.getElementById('dddDecompositionSvg');
  if (dddSvg) {
    const sliderShock = document.getElementById('dddSliderShock'); // State shock
    const sliderTrend = document.getElementById('dddSliderTrend'); // Group trend
    const sliderBeta7 = document.getElementById('dddSliderBeta7'); // True DDD effect

    const readoutDd1 = document.getElementById('dddReadoutDd1');
    const readoutDd2 = document.getElementById('dddReadoutDd2');
    const readoutFinal = document.getElementById('dddReadoutFinal');

    function renderDddLab() {
      const shock = sliderShock ? parseFloat(sliderShock.value) : 4.0;
      const trend = sliderTrend ? parseFloat(sliderTrend.value) : 2.0;
      const beta7 = sliderBeta7 ? parseFloat(sliderBeta7.value) : 6.0;

      const dd1 = shock + trend + beta7;
      const dd2 = shock + trend;
      const ddd = dd1 - dd2;

      if (readoutDd1) readoutDd1.textContent = dd1 >= 0 ? `+${dd1.toFixed(1)}` : dd1.toFixed(1);
      if (readoutDd2) readoutDd2.textContent = dd2 >= 0 ? `+${dd2.toFixed(1)}` : dd2.toFixed(1);
      if (readoutFinal) readoutFinal.textContent = ddd >= 0 ? `+${ddd.toFixed(1)}` : ddd.toFixed(1);

      // Draw SVG
      const padL = 30, padR = 30, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      let svg = '';

      const barW = 100;
      const x1 = padL + 30;
      const x2 = padL + 180;
      const x3 = padL + 330;
      const yBase = padT + plotH - 20;

      const scale = 8; // pixels per unit

      function drawBar(x, totalVal, label, color) {
        const barH = totalVal * scale;
        const yTop = yBase - barH;
        let s = `<rect x="${x}" y="${yTop}" width="${barW}" height="${barH}" fill="${color}" rx="4" opacity="0.85"/>`;
        s += `<text x="${x + barW / 2}" y="${yTop - 8}" font-size="12" font-family="var(--font-mono)" font-weight="700" fill="${color}" text-anchor="middle">${totalVal >= 0 ? '+' + totalVal.toFixed(1) : totalVal.toFixed(1)}</text>`;
        s += `<text x="${x + barW / 2}" y="${yBase + 18}" font-size="11" font-weight="600" fill="var(--color-text)" text-anchor="middle">${label}</text>`;
        return s;
      }

      svg += drawBar(x1, dd1, 'DD₁ (Target: Poor)', '#2563eb');
      svg += `<text x="${x1 + barW + 25}" y="${yBase - 40}" font-size="20" font-weight="800" fill="#64748b" text-anchor="middle">−</text>`;
      svg += drawBar(x2, dd2, 'DD₂ (Control: Rich)', '#64748b');
      svg += `<text x="${x2 + barW + 25}" y="${yBase - 40}" font-size="20" font-weight="800" fill="#64748b" text-anchor="middle">=</text>`;
      svg += drawBar(x3, ddd, 'DDD (Causal β₇)', '#059669');

      dddSvg.innerHTML = svg;
    }

    [sliderShock, sliderTrend, sliderBeta7].forEach(s => {
      if (s) s.addEventListener('input', renderDddLab);
    });

    renderDddLab();
  }

  // =========================================================================
  // 8. LESSON 6.8: PHILADELPHIA / PITTSBURGH DDD WORKED EXAMPLE (#dddWorkedLabSvg)
  // =========================================================================
  const workedSvg = document.getElementById('dddWorkedLabSvg');
  if (workedSvg) {
    const sliderBeta5 = document.getElementById('dddWorkedSliderBeta5'); // Philly citywide shock
    const sliderBeta7 = document.getElementById('dddWorkedSliderBeta7'); // Philly Juniors reform effect

    const readoutBeta5 = document.getElementById('dddWorkedReadoutBeta5');
    const readoutBeta7 = document.getElementById('dddWorkedReadoutBeta7');
    const readoutDdJr = document.getElementById('dddWorkedReadoutDdJr');
    const readoutDdSoph = document.getElementById('dddWorkedReadoutDdSoph');
    const readoutNetDdd = document.getElementById('dddWorkedReadoutNetDdd');

    function renderWorkedLab() {
      const b5 = sliderBeta5 ? parseFloat(sliderBeta5.value) : 3.0; // Philly time shock
      const b7 = sliderBeta7 ? parseFloat(sliderBeta7.value) : 7.0; // Triple interaction effect

      if (readoutBeta5) readoutBeta5.textContent = b5 >= 0 ? `+${b5.toFixed(1)}` : b5.toFixed(1);
      if (readoutBeta7) readoutBeta7.textContent = b7 >= 0 ? `+${b7.toFixed(1)}` : b7.toFixed(1);

      const ddJr = b5 + b7;
      const ddSoph = b5;
      const netDdd = ddJr - ddSoph;

      if (readoutDdJr) readoutDdJr.textContent = ddJr >= 0 ? `+${ddJr.toFixed(1)}` : ddJr.toFixed(1);
      if (readoutDdSoph) readoutDdSoph.textContent = ddSoph >= 0 ? `+${ddSoph.toFixed(1)}` : ddSoph.toFixed(1);
      if (readoutNetDdd) readoutNetDdd.textContent = netDdd >= 0 ? `+${netDdd.toFixed(1)}` : netDdd.toFixed(1);

      // Draw SVG comparison
      const padL = 40, padR = 30, padT = 30, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 300 - padT - padB;

      let svg = '';

      const barW = 110;
      const x1 = padL + 40;
      const x2 = padL + 190;
      const x3 = padL + 340;
      const yBase = padT + plotH - 20;
      const scale = 7;

      function drawBar(x, val, title, sub, col) {
        const h = Math.max(4, val * scale);
        const yTop = yBase - h;
        let s = `<rect x="${x}" y="${yTop}" width="${barW}" height="${h}" fill="${col}" rx="4" opacity="0.85"/>`;
        s += `<text x="${x + barW / 2}" y="${yTop - 8}" font-size="12" font-family="var(--font-mono)" font-weight="700" fill="${col}" text-anchor="middle">+${val.toFixed(1)}</text>`;
        s += `<text x="${x + barW / 2}" y="${yBase + 16}" font-size="11" font-weight="700" fill="var(--color-text)" text-anchor="middle">${title}</text>`;
        s += `<text x="${x + barW / 2}" y="${yBase + 30}" font-size="9.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${sub}</text>`;
        return s;
      }

      svg += drawBar(x1, ddJr, 'Junior DD', 'β₅ + β₇', '#2563eb');
      svg += `<text x="${x1 + barW + 20}" y="${yBase - 30}" font-size="20" font-weight="800" fill="#64748b" text-anchor="middle">−</text>`;
      svg += drawBar(x2, ddSoph, 'Sophomore DD', 'β₅ (City Shock)', '#64748b');
      svg += `<text x="${x2 + barW + 20}" y="${yBase - 30}" font-size="20" font-weight="800" fill="#64748b" text-anchor="middle">=</text>`;
      svg += drawBar(x3, netDdd, 'Net DDD', 'β₇ (True Effect)', '#059669');

      workedSvg.innerHTML = svg;
    }

    if (sliderBeta5) sliderBeta5.addEventListener('input', renderWorkedLab);
    if (sliderBeta7) sliderBeta7.addEventListener('input', renderWorkedLab);

    renderWorkedLab();
  }
});
