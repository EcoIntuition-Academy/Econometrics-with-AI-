/**
 * EcoIntuition Academy — Econometrics with AI
 * Module 3 Interactive Visualizations Controller
 * 
 * Includes:
 * 1. Lesson 3.1: R² & Sum of Squares Visualizer (#r2LabSvg)
 * 2. Lesson 3.2: Model Comparison & Regressor Penalty Lab (#modelCompSvg)
 * 3. Lesson 3.3: F-Statistic & Restriction Testing Visualizer (#fTestSvg)
 * 4. Lesson 3.4: OVB Mechanics & Bias Table Lab (#ovbLabSvg)
 * 5. Lesson 3.5: Standard Error & Precision Lab (#varianceLabSvg)
 * 6. Lesson 3.6: BLUE Sampling Distribution Comparison Lab (#blueLabSvg)
 * 7. Lesson 3.7: Normal vs Student's t Distribution Explorer (#normalityTsvg)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. LESSON 3.1: R² & SUM OF SQUARES VISUALIZER (#r2LabSvg)
  // =========================================================================
  const r2Svg = document.getElementById('r2LabSvg');
  if (r2Svg) {
    const btnLow = document.getElementById('r2BtnLow');
    const btnMed = document.getElementById('r2BtnMed');
    const btnHigh = document.getElementById('r2BtnHigh');

    const devTotal = document.getElementById('r2DevTotal');
    const devExplained = document.getElementById('r2DevExplained');
    const devResidual = document.getElementById('r2DevResidual');

    const readoutSst = document.getElementById('r2ReadoutSst');
    const readoutSsr = document.getElementById('r2ReadoutSsr');
    const readoutSse = document.getElementById('r2ReadoutSse');
    const readoutR2 = document.getElementById('r2ReadoutR2');

    let currentPreset = 'med'; // 'low', 'med', 'high'
    let currentMode = 'residual'; // 'total', 'explained', 'residual'

    // Fixed deterministic datasets with x in [1..10], y_bar = 20
    const xVals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const yBar = 20.0;

    const datasets = {
      low: {
        // High residual scatter, R² ≈ 0.23
        b0: 16.5, b1: 0.64,
        y: [19.2, 13.5, 23.4, 16.2, 25.1, 15.8, 24.3, 17.5, 23.8, 21.2],
        sst: 154.2, ssr: 35.5, sse: 118.7, r2: 0.230
      },
      med: {
        // Moderate scatter, R² ≈ 0.68
        b0: 10.1, b1: 1.80,
        y: [12.2, 14.8, 14.2, 18.5, 17.8, 22.4, 21.6, 25.8, 24.9, 27.8],
        sst: 236.4, ssr: 160.8, sse: 75.6, r2: 0.680
      },
      high: {
        // Very tight fit, R² ≈ 0.95
        b0: 6.8, b1: 2.40,
        y: [9.1, 11.8, 13.9, 16.6, 18.7, 21.1, 23.8, 25.9, 28.5, 30.6],
        sst: 452.0, ssr: 429.4, sse: 22.6, r2: 0.950
      }
    };

    function renderR2Plot() {
      const data = datasets[currentPreset];
      if (readoutSst) readoutSst.textContent = data.sst.toFixed(1);
      if (readoutSsr) readoutSsr.textContent = data.ssr.toFixed(1);
      if (readoutSse) readoutSse.textContent = data.sse.toFixed(1);
      if (readoutR2) readoutR2.textContent = data.r2.toFixed(3);

      // SVG coordinates: viewBox 0 0 540 320
      const padL = 55, padR = 25, padT = 30, padB = 45;
      const plotW = 540 - padL - padR;
      const plotH = 320 - padT - padB;

      const minX = 0, maxX = 11;
      const minY = 5, maxY = 35;

      function toSvgX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      function toSvgY(y) { return padT + plotH - ((y - minY) / (maxY - minY)) * plotH; }

      let svgContent = '';

      // Grid lines
      for (let y = 10; y <= 30; y += 10) {
        const sy = toSvgY(y);
        svgContent += `<line x1="${padL}" y1="${sy}" x2="${padL + plotW}" y2="${sy}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svgContent += `<text x="${padL - 10}" y="${sy + 4}" font-size="10" font-family="var(--font-mono)" fill="var(--color-text-secondary, #64748b)" text-anchor="end">${y}</text>`;
      }
      for (let x = 2; x <= 10; x += 2) {
        const sx = toSvgX(x);
        svgContent += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="var(--border-subtle, #e2e8f0)" stroke-width="1" stroke-dasharray="3 3"/>`;
        svgContent += `<text x="${sx}" y="${padT + plotH + 18}" font-size="10" font-family="var(--font-mono)" fill="var(--color-text-secondary, #64748b)" text-anchor="middle">${x}</text>`;
      }

      // Sample mean line y = ȳ
      const syBar = toSvgY(yBar);
      svgContent += `<line x1="${padL}" y1="${syBar}" x2="${padL + plotW}" y2="${syBar}" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5 4"/>`;
      svgContent += `<text x="${padL + plotW - 6}" y="${syBar - 6}" font-size="10.5" font-weight="600" font-family="var(--font-mono)" fill="#64748b" text-anchor="end">ȳ = ${yBar.toFixed(1)}</text>`;

      // Fitted regression line ŷ = b0 + b1*x
      const x1 = 0.5, yHat1 = data.b0 + data.b1 * x1;
      const x2 = 10.5, yHat2 = data.b0 + data.b1 * x2;
      svgContent += `<line x1="${toSvgX(x1)}" y1="${toSvgY(yHat1)}" x2="${toSvgX(x2)}" y2="${toSvgY(yHat2)}" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>`;

      // Deviation bars according to current mode
      data.y.forEach((yVal, i) => {
        const xVal = xVals[i];
        const yHatVal = data.b0 + data.b1 * xVal;
        const sx = toSvgX(xVal);
        const syObs = toSvgY(yVal);
        const syHat = toSvgY(yHatVal);

        if (currentMode === 'total') {
          // Total deviation (y_i - ȳ)
          svgContent += `<line x1="${sx}" y1="${syObs}" x2="${sx}" y2="${syBar}" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>`;
        } else if (currentMode === 'explained') {
          // Explained deviation (ŷ_i - ȳ)
          svgContent += `<line x1="${sx}" y1="${syHat}" x2="${sx}" y2="${syBar}" stroke="#059669" stroke-width="2" stroke-linecap="round"/>`;
        } else if (currentMode === 'residual') {
          // Residual deviation (y_i - ŷ_i)
          svgContent += `<line x1="${sx}" y1="${syObs}" x2="${sx}" y2="${syHat}" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>`;
        }

        // Observation point
        svgContent += `<circle cx="${sx}" cy="${syObs}" r="4.5" fill="#1e293b" stroke="#ffffff" stroke-width="1.5"/>`;
        // Fitted point on line
        svgContent += `<circle cx="${sx}" cy="${syHat}" r="3" fill="#2563eb"/>`;
      });

      // Axis borders
      svgContent += `<line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5"/>`;
      svgContent += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5"/>`;
      svgContent += `<text x="${padL + plotW / 2}" y="${padT + plotH + 34}" font-size="11" font-weight="600" fill="#334155" text-anchor="middle">Regressors (x)</text>`;
      svgContent += `<text x="${padL - 32}" y="${padT + plotH / 2}" font-size="11" font-weight="600" fill="#334155" text-anchor="middle" transform="rotate(-90 ${padL - 32} ${padT + plotH / 2})">Outcome (y)</text>`;

      r2Svg.innerHTML = svgContent;
    }

    if (btnLow) btnLow.addEventListener('click', () => {
      currentPreset = 'low';
      [btnLow, btnMed, btnHigh].forEach(b => b && b.classList.remove('active'));
      btnLow.classList.add('active');
      renderR2Plot();
    });
    if (btnMed) btnMed.addEventListener('click', () => {
      currentPreset = 'med';
      [btnLow, btnMed, btnHigh].forEach(b => b && b.classList.remove('active'));
      btnMed.classList.add('active');
      renderR2Plot();
    });
    if (btnHigh) btnHigh.addEventListener('click', () => {
      currentPreset = 'high';
      [btnLow, btnMed, btnHigh].forEach(b => b && b.classList.remove('active'));
      btnHigh.classList.add('active');
      renderR2Plot();
    });

    if (devTotal) devTotal.addEventListener('click', () => {
      currentMode = 'total';
      [devTotal, devExplained, devResidual].forEach(b => b && b.classList.remove('active'));
      devTotal.classList.add('active');
      renderR2Plot();
    });
    if (devExplained) devExplained.addEventListener('click', () => {
      currentMode = 'explained';
      [devTotal, devExplained, devResidual].forEach(b => b && b.classList.remove('active'));
      devExplained.classList.add('active');
      renderR2Plot();
    });
    if (devResidual) devResidual.addEventListener('click', () => {
      currentMode = 'residual';
      [devTotal, devExplained, devResidual].forEach(b => b && b.classList.remove('active'));
      devResidual.classList.add('active');
      renderR2Plot();
    });

    renderR2Plot();
  }

  // =========================================================================
  // 2. LESSON 3.2: MODEL COMPARISON & REGRESSOR PENALTY LAB (#modelCompSvg)
  // =========================================================================
  const modelCompSvg = document.getElementById('modelCompSvg');
  if (modelCompSvg) {
    const btnModelA = document.getElementById('compBtnModelA');
    const btnModelB = document.getElementById('compBtnModelB');
    const sampleSizeSlider = document.getElementById('compSampleSize');
    const sampleSizeVal = document.getElementById('compSampleSizeVal');

    const readoutR2A = document.getElementById('compReadoutR2A');
    const readoutAdjA = document.getElementById('compReadoutAdjA');
    const readoutR2B = document.getElementById('compReadoutR2B');
    const readoutAdjB = document.getElementById('compReadoutAdjB');
    const alertMsg = document.getElementById('compAlertMsg');

    let activeModel = 'A'; // 'A' or 'B'

    function updateModelComp() {
      const n = sampleSizeSlider ? parseInt(sampleSizeSlider.value, 10) : 30;
      if (sampleSizeVal) sampleSizeVal.textContent = n;

      // Base Model A: K = 2, R² = 0.600
      const kA = 2;
      const r2A = 0.600;
      const adjR2A = 1 - (1 - r2A) * ((n - 1) / (n - kA));

      // Overfitted Model B: adds 3 noise variables -> K = 5
      // Ordinary R² increases very slightly purely by chance from 0.600 to 0.612
      const kB = 5;
      const r2B = 0.612;
      const adjR2B = 1 - (1 - r2B) * ((n - 1) / (n - kB));

      if (readoutR2A) readoutR2A.textContent = r2A.toFixed(3);
      if (readoutAdjA) readoutAdjA.textContent = adjR2A.toFixed(3);
      if (readoutR2B) readoutR2B.textContent = r2B.toFixed(3);
      if (readoutAdjB) readoutAdjB.textContent = adjR2B.toFixed(3);

      if (alertMsg) {
        if (activeModel === 'B') {
          alertMsg.innerHTML = `<strong>Notice:</strong> In Model B, adding 3 irrelevant variables slightly bumped ordinary R² from 0.600 to <strong>0.612</strong> (+0.012), but adjusted R̄² dropped from <strong>${adjR2A.toFixed(3)}</strong> to <strong>${adjR2B.toFixed(3)}</strong> (-${(adjR2A - adjR2B).toFixed(3)}) because the degree-of-freedom penalty outweighed the noise fit!`;
          alertMsg.style.borderColor = '#f59e0b';
          alertMsg.style.background = '#fffbeb';
        } else {
          alertMsg.innerHTML = `<strong>Parsimonious Baseline:</strong> Model A includes only the true economic regressor (K = 2). Both R² and R̄² are balanced. Click "Add 3 Irrelevant Regressors" to observe the penalty mechanism.`;
          alertMsg.style.borderColor = '#3b82f6';
          alertMsg.style.background = '#eff6ff';
        }
      }

      // Render Bar Comparison SVG (viewBox 0 0 540 220)
      const padL = 70, padT = 30, barW = 45;
      const maxVal = 0.70;
      const plotH = 140;

      function h(val) { return Math.max(0, (val / maxVal) * plotH); }

      let svg = '';
      // Axes & grid
      for (let v = 0.2; v <= 0.6; v += 0.2) {
        const yPos = padT + plotH - (v / maxVal) * plotH;
        svg += `<line x1="${padL}" y1="${yPos}" x2="510" y2="${yPos}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${padL - 10}" y="${yPos + 4}" font-size="10" font-family="var(--font-mono)" fill="#64748b" text-anchor="end">${v.toFixed(1)}</text>`;
      }

      // Group A (X = 140)
      const xA = 130;
      const hR2A = h(r2A);
      const hAdjA = h(adjR2A);
      svg += `<rect x="${xA}" y="${padT + plotH - hR2A}" width="${barW}" height="${hR2A}" rx="4" fill="#3b82f6"/>`;
      svg += `<text x="${xA + barW/2}" y="${padT + plotH - hR2A - 6}" font-size="11" font-weight="600" font-family="var(--font-mono)" fill="#1d4ed8" text-anchor="middle">${r2A.toFixed(3)}</text>`;
      svg += `<rect x="${xA + barW + 10}" y="${padT + plotH - hAdjA}" width="${barW}" height="${hAdjA}" rx="4" fill="#059669"/>`;
      svg += `<text x="${xA + barW + 10 + barW/2}" y="${padT + plotH - hAdjA - 6}" font-size="11" font-weight="600" font-family="var(--font-mono)" fill="#047857" text-anchor="middle">${adjR2A.toFixed(3)}</text>`;
      svg += `<text x="${xA + barW + 5}" y="${padT + plotH + 20}" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">Model A (K = 2)</text>`;

      // Group B (X = 350)
      const xB = 340;
      const hR2B = h(r2B);
      const hAdjB = h(adjR2B);
      const activeOpacity = activeModel === 'B' ? '1.0' : '0.4';
      svg += `<g opacity="${activeOpacity}">`;
      svg += `<rect x="${xB}" y="${padT + plotH - hR2B}" width="${barW}" height="${hR2B}" rx="4" fill="#3b82f6"/>`;
      svg += `<text x="${xB + barW/2}" y="${padT + plotH - hR2B - 6}" font-size="11" font-weight="600" font-family="var(--font-mono)" fill="#1d4ed8" text-anchor="middle">${r2B.toFixed(3)}</text>`;
      svg += `<rect x="${xB + barW + 10}" y="${padT + plotH - hAdjB}" width="${barW}" height="${hAdjB}" rx="4" fill="#d97706"/>`;
      svg += `<text x="${xB + barW + 10 + barW/2}" y="${padT + plotH - hAdjB - 6}" font-size="11" font-weight="600" font-family="var(--font-mono)" fill="#b45309" text-anchor="middle">${adjR2B.toFixed(3)}</text>`;
      svg += `<text x="${xB + barW + 5}" y="${padT + plotH + 20}" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">Model B (K = 5: +3 Noise)</text>`;
      svg += `</g>`;

      // Base axis line
      svg += `<line x1="${padL}" y1="${padT + plotH}" x2="510" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5"/>`;

      modelCompSvg.innerHTML = svg;
    }

    if (btnModelA) btnModelA.addEventListener('click', () => {
      activeModel = 'A';
      btnModelA.classList.add('active');
      if (btnModelB) btnModelB.classList.remove('active');
      updateModelComp();
    });
    if (btnModelB) btnModelB.addEventListener('click', () => {
      activeModel = 'B';
      btnModelB.classList.add('active');
      if (btnModelA) btnModelA.classList.remove('active');
      updateModelComp();
    });
    if (sampleSizeSlider) sampleSizeSlider.addEventListener('input', updateModelComp);

    updateModelComp();
  }

  // =========================================================================
  // 3. LESSON 3.3: F-STATISTIC & RESTRICTION TESTING VISUALIZER (#fTestSvg)
  // =========================================================================
  const fTestSvg = document.getElementById('fTestSvg');
  if (fTestSvg) {
    const sliderR2 = document.getElementById('fSliderR2');
    const sliderR2r = document.getElementById('fSliderR2r');
    const sliderJ = document.getElementById('fSliderJ');
    const sliderN = document.getElementById('fSliderN');

    const readoutR2 = document.getElementById('fReadoutR2');
    const readoutR2r = document.getElementById('fReadoutR2r');
    const readoutJ = document.getElementById('fReadoutJ');
    const readoutN = document.getElementById('fReadoutN');
    const readoutF = document.getElementById('fReadoutF');
    const readoutPval = document.getElementById('fReadoutPval');

    function updateFTest() {
      let r2 = sliderR2 ? parseFloat(sliderR2.value) : 0.65;
      let r2r = sliderR2r ? parseFloat(sliderR2r.value) : 0.45;
      const j = sliderJ ? parseInt(sliderJ.value, 10) : 2;
      const n = sliderN ? parseInt(sliderN.value, 10) : 60;
      const k = j + 2; // total parameters in unrestricted

      // Enforce logical constraint: R² >= R²_r
      if (r2r > r2) {
        r2r = r2;
        if (sliderR2r) sliderR2r.value = r2r;
      }

      if (readoutR2) readoutR2.textContent = r2.toFixed(2);
      if (readoutR2r) readoutR2r.textContent = r2r.toFixed(2);
      if (readoutJ) readoutJ.textContent = j;
      if (readoutN) readoutN.textContent = n;

      const num = (r2 - r2r) / j;
      const den = (1 - r2) / (n - k);
      const fStat = den > 0 ? num / den : 0;

      if (readoutF) readoutF.textContent = fStat.toFixed(2);

      // Qualitative decision indicator based on benchmark F critical approx ~3.15
      let pStatus = 'Not Significant (p > 0.05)';
      let pColor = '#dc2626';
      if (fStat > 4.5) {
        pStatus = 'Highly Significant (p < 0.01)';
        pColor = '#059669';
      } else if (fStat > 3.0) {
        pStatus = 'Statistically Significant (p < 0.05)';
        pColor = '#2563eb';
      }
      if (readoutPval) {
        readoutPval.textContent = pStatus;
        readoutPval.style.color = pColor;
      }

      // SVG: Visual decomposition bar (viewBox 0 0 540 220)
      const barY = 40, barH = 34, barW = 440, padX = 50;
      let svg = '';

      // Unrestricted Bar
      svg += `<text x="${padX}" y="${barY - 8}" font-size="11" font-weight="600" fill="#1e293b">Unrestricted Model (Full Fit R² = ${r2.toFixed(2)})</text>`;
      const wExp = barW * r2;
      const wRes = barW * (1 - r2);
      svg += `<rect x="${padX}" y="${barY}" width="${wExp}" height="${barH}" rx="4" fill="#3b82f6"/>`;
      svg += `<text x="${padX + wExp/2}" y="${barY + 22}" font-size="11" font-weight="600" fill="#ffffff" text-anchor="middle">SSR (Explained: ${(r2*100).toFixed(0)}%)</text>`;
      svg += `<rect x="${padX + wExp}" y="${barY}" width="${wRes}" height="${barH}" rx="4" fill="#94a3b8"/>`;
      svg += `<text x="${padX + wExp + wRes/2}" y="${barY + 22}" font-size="11" font-weight="600" fill="#ffffff" text-anchor="middle">SSE (${((1-r2)*100).toFixed(0)}%)</text>`;

      // Restricted Bar
      const barY2 = 120;
      svg += `<text x="${padX}" y="${barY2 - 8}" font-size="11" font-weight="600" fill="#1e293b">Restricted Model (Imposing ${j} Restrictions: R²_r = ${r2r.toFixed(2)})</text>`;
      const wExpR = barW * r2r;
      const wLoss = barW * (r2 - r2r);
      const wResR = barW * (1 - r2);
      svg += `<rect x="${padX}" y="${barY2}" width="${wExpR}" height="${barH}" rx="4" fill="#60a5fa"/>`;
      svg += `<text x="${padX + wExpR/2}" y="${barY2 + 22}" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">Remaining SSR</text>`;
      // Lost fit highlighted in amber
      svg += `<rect x="${padX + wExpR}" y="${barY2}" width="${wLoss}" height="${barH}" rx="4" fill="#f59e0b"/>`;
      if (wLoss > 28) {
        svg += `<text x="${padX + wExpR + wLoss/2}" y="${barY2 + 22}" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">Lost Fit</text>`;
      }
      svg += `<rect x="${padX + wExpR + wLoss}" y="${barY2}" width="${wResR}" height="${barH}" rx="4" fill="#94a3b8"/>`;

      // F Formula visual connector bracket
      svg += `<path d="M ${padX + wExpR} ${barY2 + barH + 5} L ${padX + wExpR} ${barY2 + barH + 15} L ${padX + wExpR + wLoss} ${barY2 + barH + 15} L ${padX + wExpR + wLoss} ${barY2 + barH + 5}" fill="none" stroke="#f59e0b" stroke-width="1.8"/>`;
      svg += `<text x="${padX + wExpR + wLoss/2}" y="${barY2 + barH + 30}" font-size="11" font-weight="600" fill="#b45309" text-anchor="middle">Fit Lost: (R² - R²_r) / ${j} = ${num.toFixed(3)}</text>`;

      fTestSvg.innerHTML = svg;
    }

    if (sliderR2) sliderR2.addEventListener('input', updateFTest);
    if (sliderR2r) sliderR2r.addEventListener('input', updateFTest);
    if (sliderJ) sliderJ.addEventListener('input', updateFTest);
    if (sliderN) sliderN.addEventListener('input', updateFTest);

    updateFTest();
  }

  // =========================================================================
  // 4. LESSON 3.4: OVB MECHANICS & BIAS TABLE LAB (#ovbLabSvg)
  // =========================================================================
  const ovbSvg = document.getElementById('ovbLabSvg');
  if (ovbSvg) {
    const toggleBeta2 = document.getElementById('ovbToggleBeta2');
    const toggleCorr = document.getElementById('ovbToggleCorr');

    const readoutTrue = document.getElementById('ovbReadoutTrue');
    const readoutExp = document.getElementById('ovbReadoutExp');
    const readoutBias = document.getElementById('ovbReadoutBias');
    const readoutStatus = document.getElementById('ovbReadoutStatus');

    // Matrix cell highlights
    const cell11 = document.getElementById('biasCell11');
    const cell12 = document.getElementById('biasCell12');
    const cell21 = document.getElementById('biasCell21');
    const cell22 = document.getElementById('biasCell22');

    const beta1 = 2.0; // true effect of included regressor

    function updateOVB() {
      const beta2Active = toggleBeta2 ? toggleBeta2.checked : true;
      const corrActive = toggleCorr ? toggleCorr.checked : true;

      const beta2 = beta2Active ? 1.5 : 0.0;
      const delta21 = corrActive ? 0.8 : 0.0; // auxiliary regression slope of x2 on x1
      const bias = delta21 * beta2;
      const expectedB1 = beta1 + bias;

      if (readoutTrue) readoutTrue.textContent = beta1.toFixed(2);
      if (readoutExp) readoutExp.textContent = expectedB1.toFixed(2);
      if (readoutBias) {
        readoutBias.textContent = (bias >= 0 ? '+' : '') + bias.toFixed(2);
        readoutBias.style.color = bias === 0 ? '#059669' : '#dc2626';
      }

      if (readoutStatus) {
        if (bias === 0) {
          readoutStatus.textContent = 'Unbiased (E[b₁|X] = β₁)';
          readoutStatus.style.color = '#059669';
        } else {
          readoutStatus.textContent = `Biased by +${bias.toFixed(2)} (Overstates true effect)`;
          readoutStatus.style.color = '#dc2626';
        }
      }

      // Highlight active cell in the 2x2 Bias Table
      const cells = [cell11, cell12, cell21, cell22];
      cells.forEach(c => c && c.classList.remove('active-cell'));

      if (!corrActive && !beta2Active) {
        if (cell11) cell11.classList.add('active-cell');
      } else if (!corrActive && beta2Active) {
        if (cell12) cell12.classList.add('active-cell');
      } else if (corrActive && !beta2Active) {
        if (cell21) cell21.classList.add('active-cell');
      } else {
        if (cell22) cell22.classList.add('active-cell');
      }

      // SVG: Causal Path Diagram (viewBox 0 0 540 220)
      let svg = '';
      const x1X = 120, x1Y = 70;
      const x2X = 270, x2Y = 160;
      const yX = 420, yY = 70;

      // Node X1 (Included)
      svg += `<circle cx="${x1X}" cy="${x1Y}" r="32" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5"/>`;
      svg += `<text x="${x1X}" y="${x1Y - 4}" font-size="14" font-weight="700" fill="#1e40af" text-anchor="middle">X₁</text>`;
      svg += `<text x="${x1X}" y="${x1Y + 12}" font-size="9.5" font-weight="500" fill="#64748b" text-anchor="middle">Included</text>`;

      // Node Y (Outcome)
      svg += `<circle cx="${yX}" cy="${yY}" r="32" fill="#f0fdf4" stroke="#059669" stroke-width="2.5"/>`;
      svg += `<text x="${yX}" y="${yY - 4}" font-size="14" font-weight="700" fill="#065f46" text-anchor="middle">Y</text>`;
      svg += `<text x="${yX}" y="${yY + 12}" font-size="9.5" font-weight="500" fill="#64748b" text-anchor="middle">Outcome</text>`;

      // Direct effect path X1 -> Y: β1 = 2.0
      svg += `<defs><marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"/></marker>`;
      svg += `<marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#059669"/></marker>`;
      svg += `<marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706"/></marker></defs>`;

      svg += `<line x1="${x1X + 32}" y1="${x1Y}" x2="${yX - 32}" y2="${yY}" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow)"/>`;
      svg += `<text x="${(x1X + yX)/2}" y="${x1Y - 10}" font-size="12" font-weight="600" fill="#1e40af" text-anchor="middle">True Direct Effect: β₁ = ${beta1.toFixed(1)}</text>`;

      // Node X2 (Omitted)
      const x2Stroke = beta2Active ? '#d97706' : '#94a3b8';
      const x2Fill = beta2Active ? '#fffbeb' : '#f8fafc';
      svg += `<circle cx="${x2X}" cy="${x2Y}" r="32" fill="${x2Fill}" stroke="${x2Stroke}" stroke-width="2.5" stroke-dasharray="${beta2Active ? 'none' : '4 3'}"/>`;
      svg += `<text x="${x2X}" y="${x2Y - 4}" font-size="14" font-weight="700" fill="${beta2Active ? '#92400e' : '#64748b'}" text-anchor="middle">X₂</text>`;
      svg += `<text x="${x2X}" y="${x2Y + 12}" font-size="9.5" font-weight="500" fill="#64748b" text-anchor="middle">Omitted</text>`;

      // Path X1 <-> X2 (correlation delta21)
      const corrColor = corrActive ? '#d97706' : '#cbd5e1';
      const corrDash = corrActive ? 'none' : '4 4';
      svg += `<line x1="${x1X + 22}" y1="${x1Y + 22}" x2="${x2X - 22}" y2="${x2Y - 22}" stroke="${corrColor}" stroke-width="2" stroke-dasharray="${corrDash}"/>`;
      svg += `<text x="${(x1X + x2X)/2 - 14}" y="${(x1Y + x2Y)/2 + 18}" font-size="10.5" font-weight="600" fill="${corrActive ? '#92400e' : '#94a3b8'}" text-anchor="middle">X₁'X₂: δ₂₁ = ${delta21.toFixed(1)}</text>`;

      // Path X2 -> Y (omitted effect beta2)
      const b2Color = beta2Active ? '#d97706' : '#cbd5e1';
      const b2Dash = beta2Active ? 'none' : '4 4';
      const marker = beta2Active ? 'url(#arrow-amber)' : 'none';
      svg += `<line x1="${x2X + 22}" y1="${x2Y - 22}" x2="${yX - 22}" y2="${yY + 22}" stroke="${b2Color}" stroke-width="2" stroke-dasharray="${b2Dash}" marker-end="${marker}"/>`;
      svg += `<text x="${(x2X + yX)/2 + 14}" y="${(x2Y + yY)/2 + 18}" font-size="10.5" font-weight="600" fill="${beta2Active ? '#92400e' : '#94a3b8'}" text-anchor="middle">β₂ = ${beta2.toFixed(1)}</text>`;

      ovbSvg.innerHTML = svg;
    }

    if (toggleBeta2) toggleBeta2.addEventListener('change', updateOVB);
    if (toggleCorr) toggleCorr.addEventListener('change', updateOVB);

    updateOVB();
  }

  // =========================================================================
  // 5. LESSON 3.5: STANDARD ERROR & PRECISION LAB (#varianceLabSvg)
  // =========================================================================
  const varSvg = document.getElementById('varianceLabSvg');
  if (varSvg) {
    const sliderN = document.getElementById('varSliderN');
    const sliderSigma = document.getElementById('varSliderSigma');
    const sliderVarX = document.getElementById('varSliderVarX');

    const readoutN = document.getElementById('varReadoutN');
    const readoutSigma = document.getElementById('varReadoutSigma');
    const readoutVarX = document.getElementById('varReadoutVarX');
    const readoutVarB = document.getElementById('varReadoutVarB');
    const readoutSeB = document.getElementById('varReadoutSeB');
    const readoutCi = document.getElementById('varReadoutCi');

    const trueBeta = 2.0;

    function updateVariancePlot() {
      const n = sliderN ? parseInt(sliderN.value, 10) : 100;
      const sigmaSq = sliderSigma ? parseFloat(sliderSigma.value) : 2.0;
      const varX = sliderVarX ? parseFloat(sliderVarX.value) : 1.5;

      if (readoutN) readoutN.textContent = n;
      if (readoutSigma) readoutSigma.textContent = sigmaSq.toFixed(1);
      if (readoutVarX) readoutVarX.textContent = varX.toFixed(1);

      const varB = sigmaSq / (n * varX);
      const seB = Math.sqrt(varB);
      const ciHalf = 1.96 * seB;

      if (readoutVarB) readoutVarB.textContent = varB.toFixed(4);
      if (readoutSeB) readoutSeB.textContent = seB.toFixed(4);
      if (readoutCi) readoutCi.textContent = `[${(trueBeta - ciHalf).toFixed(2)}, ${(trueBeta + ciHalf).toFixed(2)}]`;

      // Render Gaussian Bell Curve in SVG (viewBox 0 0 540 240)
      const padL = 40, padR = 40, padT = 25, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 240 - padT - padB;

      const minB = 0.5, maxB = 3.5;
      function toX(b) { return padL + ((b - minB) / (maxB - minB)) * plotW; }

      // Normal PDF
      function pdf(b) {
        const z = (b - trueBeta) / seB;
        return (1 / (seB * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      }

      // Max peak height scales with 1/seB
      const maxPdf = Math.max(pdf(trueBeta), 3.5);
      function toY(density) { return padT + plotH - (density / maxPdf) * plotH; }

      let svg = '';
      // Grid lines on horizontal axis
      for (let b = 1.0; b <= 3.0; b += 0.5) {
        const sx = toX(b);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${b.toFixed(1)}</text>`;
      }

      // Shaded 95% Confidence region (beta +/- 1.96 SE)
      const ciL = Math.max(minB, trueBeta - ciHalf);
      const ciR = Math.min(maxB, trueBeta + ciHalf);
      let shadePath = `M ${toX(ciL)} ${padT + plotH}`;
      const step = 0.02;
      for (let b = ciL; b <= ciR; b += step) {
        shadePath += ` L ${toX(b)} ${toY(pdf(b))}`;
      }
      shadePath += ` L ${toX(ciR)} ${padT + plotH} Z`;
      svg += `<path d="${shadePath}" fill="rgba(37, 99, 235, 0.15)"/>`;

      // Full Bell Curve path
      let curvePath = '';
      for (let b = minB; b <= maxB; b += step) {
        const sx = toX(b);
        const sy = toY(pdf(b));
        if (curvePath === '') curvePath += `M ${sx} ${sy}`;
        else curvePath += ` L ${sx} ${sy}`;
      }
      svg += `<path d="${curvePath}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;

      // Center true mean line (β = 2.0)
      const centerSx = toX(trueBeta);
      svg += `<line x1="${centerSx}" y1="${padT}" x2="${centerSx}" y2="${padT + plotH}" stroke="#1e293b" stroke-width="1.8" stroke-dasharray="4 3"/>`;
      svg += `<text x="${centerSx}" y="${padT - 6}" font-size="11" font-weight="700" font-family="var(--font-mono)" fill="#1e293b" text-anchor="middle">β₁ = 2.00 (Unbiased Center)</text>`;

      // Base line
      svg += `<line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5"/>`;
      svg += `<text x="${padL + plotW / 2}" y="${padT + plotH + 34}" font-size="11" font-weight="600" fill="#334155" text-anchor="middle">Sampling Distribution of OLS Estimator b₁</text>`;

      varSvg.innerHTML = svg;
    }

    if (sliderN) sliderN.addEventListener('input', updateVariancePlot);
    if (sliderSigma) sliderSigma.addEventListener('input', updateVariancePlot);
    if (sliderVarX) sliderVarX.addEventListener('input', updateVariancePlot);

    updateVariancePlot();
  }

  // =========================================================================
  // 6. LESSON 3.6: BLUE SAMPLING DISTRIBUTION LAB (#blueLabSvg)
  // =========================================================================
  const blueSvg = document.getElementById('blueLabSvg');
  if (blueSvg) {
    const sliderPenalty = document.getElementById('blueSliderPenalty');
    const sliderDf = document.getElementById('blueSliderDf');

    const readoutVarOls = document.getElementById('blueReadoutVarOls');
    const readoutVarAlt = document.getElementById('blueReadoutVarAlt');
    const readoutPenalty = document.getElementById('blueReadoutPenalty');
    const readoutDf = document.getElementById('blueReadoutDf');
    const readoutS2 = document.getElementById('blueReadoutS2');

    const varOls = 0.25; // baseline OLS variance

    function updateBluePlot() {
      const penalty = sliderPenalty ? parseFloat(sliderPenalty.value) : 0.60;
      const df = sliderDf ? parseInt(sliderDf.value, 10) : 25;

      const varAlt = varOls + penalty;
      const seOls = Math.sqrt(varOls); // 0.50
      const seAlt = Math.sqrt(varAlt);

      if (readoutVarOls) readoutVarOls.textContent = varOls.toFixed(2);
      if (readoutVarAlt) readoutVarAlt.textContent = varAlt.toFixed(2);
      if (readoutPenalty) readoutPenalty.textContent = `+${penalty.toFixed(2)}`;
      if (readoutDf) readoutDf.textContent = df;

      // Illustration of s² vs biased sigma_naive:
      const trueSigmaSq = 2.0;
      if (readoutS2) readoutS2.textContent = `${trueSigmaSq.toFixed(2)} (unbiased)`;

      // Render Gauss-Markov Distributions in SVG (viewBox 0 0 540 240)
      const padL = 40, padR = 40, padT = 25, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 240 - padT - padB;

      const minVal = -2.5, maxVal = 2.5;
      function toX(v) { return padL + ((v - minVal) / (maxVal - minVal)) * plotW; }

      function pdf(v, se) {
        const z = v / se;
        return (1 / (se * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      }

      const maxPdf = Math.max(pdf(0, seOls), 1.0);
      function toY(dens) { return padT + plotH - (dens / maxPdf) * plotH; }

      let svg = '';
      // Grid lines
      for (let v = -2; v <= 2; v += 1) {
        const sx = toX(v);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${v}</text>`;
      }

      // Alternative Estimator Curve (Purple)
      let altPath = '';
      const step = 0.04;
      for (let v = minVal; v <= maxVal; v += step) {
        const sx = toX(v);
        const sy = toY(pdf(v, seAlt));
        if (altPath === '') altPath += `M ${sx} ${sy}`;
        else altPath += ` L ${sx} ${sy}`;
      }
      svg += `<path d="${altPath}" fill="rgba(147, 51, 234, 0.12)" stroke="#9333ea" stroke-width="2.2" stroke-dasharray="5 3"/>`;

      // OLS Curve (Blue - Best/Minimum Variance)
      let olsPath = '';
      for (let v = minVal; v <= maxVal; v += step) {
        const sx = toX(v);
        const sy = toY(pdf(v, seOls));
        if (olsPath === '') olsPath += `M ${sx} ${sy}`;
        else olsPath += ` L ${sx} ${sy}`;
      }
      svg += `<path d="${olsPath}" fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" stroke-width="2.6"/>`;

      // Center zero line
      const cx = toX(0);
      svg += `<line x1="${cx}" y1="${padT}" x2="${cx}" y2="${padT + plotH}" stroke="#1e293b" stroke-width="1.8" stroke-dasharray="4 3"/>`;
      svg += `<text x="${cx}" y="${padT - 6}" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">True Parameter Center (Both Unbiased)</text>`;

      // Base line
      svg += `<line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5"/>`;

      blueSvg.innerHTML = svg;
    }

    if (sliderPenalty) sliderPenalty.addEventListener('input', updateBluePlot);
    if (sliderDf) sliderDf.addEventListener('input', updateBluePlot);

    updateBluePlot();
  }

  // =========================================================================
  // 7. LESSON 3.7: NORMAL VS STUDENT'S t DISTRIBUTION EXPLORER (#normalityTsvg)
  // =========================================================================
  const tSvg = document.getElementById('normalityTsvg');
  if (tSvg) {
    const dfBtns = [
      document.getElementById('tBtnDf1'),
      document.getElementById('tBtnDf2'),
      document.getElementById('tBtnDf5'),
      document.getElementById('tBtnDf10'),
      document.getElementById('tBtnDf30'),
      document.getElementById('tBtnDfInf')
    ];

    const readoutDf = document.getElementById('tReadoutDf');
    const readoutTailP = document.getElementById('tReadoutTailP');
    const readoutCrit = document.getElementById('tReadoutCrit');
    const readoutSummary = document.getElementById('tReadoutSummary');

    let currentDf = 5; // 1, 2, 5, 10, 30, Infinity

    // Log-gamma approximation for Student's t PDF
    function logGamma(z) {
      const p = [
        676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059,
        12.507343278686905, -0.138571095836526,
        9.9843695780195716e-6, 1.5056327351493116e-7
      ];
      if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
      z -= 1;
      let x = 0.99999999999980993;
      for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
      const t = z + p.length - 0.5;
      return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
    }

    function normalPdf(x) {
      return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    }

    function studentTPdf(x, v) {
      if (!isFinite(v) || v >= 100) return normalPdf(x);
      const coeff = Math.exp(logGamma((v + 1) / 2) - logGamma(v / 2)) / Math.sqrt(v * Math.PI);
      return coeff * Math.pow(1 + (x * x) / v, -((v + 1) / 2));
    }

    const tStatsData = {
      1: { tailP: 0.2952, crit: 12.71, desc: 'Extreme heavy tails (Cauchy). Notice massive tail area.' },
      2: { tailP: 0.1835, crit: 4.30, desc: 'Heavier tails than normal; variance is infinite for df = 2.' },
      5: { tailP: 0.1019, crit: 2.57, desc: 'Moderate tails; typical small experimental sample (n - k = 5).' },
      10: { tailP: 0.0734, crit: 2.23, desc: 'Tails noticeably slim, approaching the standard Gaussian curve.' },
      30: { tailP: 0.0547, crit: 2.04, desc: 'Virtually indistinguishable from normal (CLT rule of thumb).' },
      Infinity: { tailP: 0.0455, crit: 1.96, desc: 'Exact Standard Normal limit N(0,1) as degrees of freedom approach infinity.' }
    };

    function renderTPlot() {
      const info = tStatsData[currentDf] || tStatsData[5];
      if (readoutDf) readoutDf.textContent = isFinite(currentDf) ? currentDf : '∞ (Normal)';
      if (readoutTailP) readoutTailP.textContent = `${(info.tailP * 100).toFixed(2)}%`;
      if (readoutCrit) readoutCrit.textContent = info.crit.toFixed(2);
      if (readoutSummary) readoutSummary.textContent = info.desc;

      // SVG: viewBox 0 0 540 240
      const padL = 40, padR = 40, padT = 25, padB = 40;
      const plotW = 540 - padL - padR;
      const plotH = 240 - padT - padB;

      const minX = -4.0, maxX = 4.0;
      function toX(x) { return padL + ((x - minX) / (maxX - minX)) * plotW; }
      const maxPdf = 0.45;
      function toY(y) { return padT + plotH - (y / maxPdf) * plotH; }

      let svg = '';
      // Grid lines
      for (let x = -3; x <= 3; x += 1) {
        const sx = toX(x);
        svg += `<line x1="${sx}" y1="${padT}" x2="${sx}" y2="${padT + plotH}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>`;
        svg += `<text x="${sx}" y="${padT + plotH + 18}" font-size="10.5" font-family="var(--font-mono)" fill="#64748b" text-anchor="middle">${x}</text>`;
      }

      // Tail rejection zone markers at +/- 2.0
      const tL = toX(-2.0);
      const tR = toX(2.0);
      svg += `<line x1="${tL}" y1="${padT}" x2="${tL}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 3"/>`;
      svg += `<line x1="${tR}" y1="${padT}" x2="${tR}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 3"/>`;

      // Reference Standard Normal Curve (Dashed Blue)
      let normPath = '';
      const step = 0.05;
      for (let x = minX; x <= maxX; x += step) {
        const sx = toX(x);
        const sy = toY(normalPdf(x));
        if (normPath === '') normPath += `M ${sx} ${sy}`;
        else normPath += ` L ${sx} ${sy}`;
      }
      svg += `<path d="${normPath}" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 3"/>`;

      // Student's t Curve (Solid Emerald)
      let tPath = '';
      for (let x = minX; x <= maxX; x += step) {
        const sx = toX(x);
        const sy = toY(studentTPdf(x, currentDf));
        if (tPath === '') tPath += `M ${sx} ${sy}`;
        else tPath += ` L ${sx} ${sy}`;
      }
      svg += `<path d="${tPath}" fill="rgba(5, 150, 105, 0.12)" stroke="#059669" stroke-width="2.6"/>`;

      // Base line
      svg += `<line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5"/>`;

      tSvg.innerHTML = svg;
    }

    const dfMapping = [1, 2, 5, 10, 30, Infinity];
    dfBtns.forEach((btn, idx) => {
      if (btn) {
        btn.addEventListener('click', () => {
          currentDf = dfMapping[idx];
          dfBtns.forEach(b => b && b.classList.remove('active'));
          btn.classList.add('active');
          renderTPlot();
        });
      }
    });

    renderTPlot();
  }
});
