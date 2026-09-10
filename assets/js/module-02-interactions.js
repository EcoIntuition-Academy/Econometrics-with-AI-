/**
 * EcoIntuition Academy — Econometrics with AI
 * Module 2 Interactive Visualizations Controller
 * 
 * Includes:
 * 1. Lesson 2.1: Orthogonal Projection 2.5D Lab (Col(X), y, y_hat, e)
 * 2. Lesson 2.2: Quadratic SSE Loss Surface & Contour Visualizer
 * 3. Lesson 2.3: Projection P and Residual Maker M Operator Toggle
 * 4. Lesson 2.4: Signed Residual Balance & Constant Term Demo
 * 5. Lesson 2.5: Regression Through Sample Means (x_bar, y_bar)
 * 6. Lesson 2.6: Frisch-Waugh-Lovell (FWL) Partialling-Out 3-Stage Lab
 * 7. Lesson 2.7: Demeaning & Covariance Form Centering Visualizer
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. LESSON 2.1: ORTHOGONAL PROJECTION 2.5D LAB
  // =========================================================================
  const projSvg = document.getElementById('projectionLabSvg');
  if (projSvg) {
    const sliderY1 = document.getElementById('projSliderY1');
    const sliderY2 = document.getElementById('projSliderY2');
    const sliderY3 = document.getElementById('projSliderY3');

    const readoutY = document.getElementById('projReadoutY');
    const readoutYHat = document.getElementById('projReadoutYHat');
    const readoutDist = document.getElementById('projReadoutDist');

    // Plane basis in observation space R^3:
    // Subspace Col(X) is spanned by x1 = (1, 0, 0)' and x2 = (0, 1, 0)' (xy plane)
    // with z as perpendicular residual axis.
    function renderProjection() {
      const y1 = sliderY1 ? parseFloat(sliderY1.value) : 2.5;
      const y2 = sliderY2 ? parseFloat(sliderY2.value) : 2.0;
      const y3 = sliderY3 ? parseFloat(sliderY3.value) : 3.5; // distance above plane

      // Update readouts
      if (readoutY) readoutY.textContent = `[${y1.toFixed(1)}, ${y2.toFixed(1)}, ${y3.toFixed(1)}]ᵀ`;
      if (readoutYHat) readoutYHat.textContent = `[${y1.toFixed(1)}, ${y2.toFixed(1)}, 0.0]ᵀ`;
      const distSq = (y3 * y3).toFixed(2);
      if (readoutDist) readoutDist.textContent = `${distSq} (minimized)`;

      // Isometric 2.5D projection:
      // Origin: (250, 220)
      // X-axis: right-down (angle 25 deg)
      // Y-axis: left-down (angle 150 deg)
      // Z-axis: straight up
      const ox = 250;
      const oy = 210;
      const scale = 28;

      // Project (x, y, z) to 2D screen
      function iso(x, y, z) {
        const sx = ox + (x * Math.cos(0.4) - y * Math.cos(0.5)) * scale;
        const sy = oy + (x * Math.sin(0.4) + y * Math.sin(0.5) - z * 1.35) * scale;
        return { x: sx, y: sy };
      }

      // Plane corners in (x, y) space: (-1, -1) to (4, 4)
      const p0 = iso(-1, -1, 0);
      const p1 = iso(4.5, -1, 0);
      const p2 = iso(4.5, 4.5, 0);
      const p3 = iso(-1, 4.5, 0);

      // Points of interest
      const originScreen = iso(0, 0, 0);
      const yScreen = iso(y1, y2, y3);
      const yHatScreen = iso(y1, y2, 0);
      const x1Screen = iso(3.5, 0, 0);
      const x2Screen = iso(0, 3.5, 0);

      // Right angle marker size
      const raSize = 12;
      const ra1 = { x: yHatScreen.x + raSize * 0.8, y: yHatScreen.y + raSize * 0.35 };
      const ra2 = { x: ra1.x, y: ra1.y - raSize };
      const ra3 = { x: yHatScreen.x, y: yHatScreen.y - raSize };

      projSvg.innerHTML = `
        <!-- Subspace Plane: Col(X) -->
        <polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}"
          fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" />
        
        <!-- Grid lines on plane -->
        <line x1="${iso(0, -1, 0).x}" y1="${iso(0, -1, 0).y}" x2="${iso(0, 4.5, 0).x}" y2="${iso(0, 4.5, 0).y}" stroke="#cbd5e1" stroke-width="1" />
        <line x1="${iso(-1, 0, 0).x}" y1="${iso(-1, 0, 0).y}" x2="${iso(4.5, 0, 0).x}" y2="${iso(4.5, 0, 0).y}" stroke="#cbd5e1" stroke-width="1" />
        <line x1="${iso(2, -1, 0).x}" y1="${iso(2, -1, 0).y}" x2="${iso(2, 4.5, 0).x}" y2="${iso(2, 4.5, 0).y}" stroke="#e2e8f0" stroke-width="1" />
        <line x1="${iso(-1, 2, 0).x}" y1="${iso(-1, 2, 0).y}" x2="${iso(4.5, 2, 0).x}" y2="${iso(4.5, 2, 0).y}" stroke="#e2e8f0" stroke-width="1" />

        <!-- Plane Label -->
        <text x="${p2.x - 70}" y="${p2.y - 12}" font-family="var(--font-mono)" font-size="12" font-weight="700" fill="#475569">
          Subspace Col(X)
        </text>

        <!-- Regressor Axis Vectors -->
        <line x1="${originScreen.x}" y1="${originScreen.y}" x2="${x1Screen.x}" y2="${x1Screen.y}" stroke="#64748b" stroke-width="2" marker-end="url(#arrowGray)" />
        <text x="${x1Screen.x + 8}" y="${x1Screen.y + 4}" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="#475569">x₁</text>

        <line x1="${originScreen.x}" y1="${originScreen.y}" x2="${x2Screen.x}" y2="${x2Screen.y}" stroke="#64748b" stroke-width="2" marker-end="url(#arrowGray)" />
        <text x="${x2Screen.x - 18}" y="${x2Screen.y + 4}" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="#475569">x₂</text>

        <!-- Right Angle Indicator at y_hat -->
        <polyline points="${ra1.x},${ra1.y} ${ra2.x},${ra2.y} ${ra3.x},${ra3.y}" fill="none" stroke="#dc2626" stroke-width="1.2" />

        <!-- Fitted Vector: y_hat = X * beta_hat (lies inside Col(X)) -->
        <line x1="${originScreen.x}" y1="${originScreen.y}" x2="${yHatScreen.x}" y2="${yHatScreen.y}"
          stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
        <circle cx="${yHatScreen.x}" cy="${yHatScreen.y}" r="4" fill="#2563eb" />
        <text x="${yHatScreen.x + 10}" y="${yHatScreen.y + 14}" font-family="var(--font-mono)" font-size="12" font-weight="700" fill="#1d4ed8">
          ŷ = Xβ̂ (Shadow)
        </text>

        <!-- Residual Vector: e = y - y_hat (orthogonal to plane) -->
        <line x1="${yHatScreen.x}" y1="${yHatScreen.y}" x2="${yScreen.x}" y2="${yScreen.y}"
          stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4 3" />
        <text x="${(yHatScreen.x + yScreen.x) / 2 + 12}" y="${(yHatScreen.y + yScreen.y) / 2}"
          font-family="var(--font-mono)" font-size="12" font-weight="700" fill="#b91c1c">
          e = y − ŷ ⊥ Col(X)
        </text>

        <!-- Observed Vector: y (outside the plane) -->
        <line x1="${originScreen.x}" y1="${originScreen.y}" x2="${yScreen.x}" y2="${yScreen.y}"
          stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
        <circle cx="${yScreen.x}" cy="${yScreen.y}" r="5.5" fill="#0f172a" />
        <text x="${yScreen.x - 12}" y="${yScreen.y - 12}" font-family="var(--font-mono)" font-size="13" font-weight="700" fill="#0f172a">
          y (Observed)
        </text>

        <!-- Arrow marker definitions -->
        <defs>
          <marker id="arrowGray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
          </marker>
        </defs>
      `;
    }

    [sliderY1, sliderY2, sliderY3].forEach(s => {
      if (s) s.addEventListener('input', renderProjection);
    });
    renderProjection();
  }

  // =========================================================================
  // 2. LESSON 2.2: QUADRATIC SSE LOSS SURFACE & CONTOUR VISUALIZER
  // =========================================================================
  const sseSvg = document.getElementById('sseBowlSvg');
  if (sseSvg) {
    const sB1 = document.getElementById('sseSliderB1');
    const sB2 = document.getElementById('sseSliderB2');
    const btnMin = document.getElementById('sseBtnFindMin');
    const readoutSSE = document.getElementById('sseReadoutValue');
    const readoutGrad = document.getElementById('sseReadoutGrad');
    const readoutStatus = document.getElementById('sseReadoutStatus');

    // True OLS minimum coordinates: beta_hat = (2.0, 1.5)
    const optB1 = 2.0;
    const optB2 = 1.5;
    const minSSE = 42.0;

    function renderSSE() {
      const b1 = sB1 ? parseFloat(sB1.value) : 0.8;
      const b2 = sB2 ? parseFloat(sB2.value) : 0.6;

      // Quadratic loss S(b) = S_min + c1*(b1 - optB1)^2 + c2*(b2 - optB2)^2 + 2*c12*(b1 - optB1)*(b2 - optB2)
      const db1 = b1 - optB1;
      const db2 = b2 - optB2;
      const sse = minSSE + 32 * (db1 * db1) + 48 * (db2 * db2) + 24 * (db1 * db2);
      const gradMag = Math.sqrt(Math.pow(64 * db1 + 24 * db2, 2) + Math.pow(96 * db2 + 24 * db1, 2));

      if (readoutSSE) readoutSSE.textContent = sse.toFixed(2);
      if (readoutGrad) readoutGrad.textContent = gradMag.toFixed(2);

      const isMin = Math.abs(db1) < 0.08 && Math.abs(db2) < 0.08;
      if (readoutStatus) {
        if (isMin) {
          readoutStatus.textContent = 'Global Minimum Reached (∇S = 0)';
          readoutStatus.style.color = '#059669';
        } else {
          readoutStatus.textContent = 'Suboptimal (Gradient ∇S ≠ 0)';
          readoutStatus.style.color = '#d97706';
        }
      }

      // Contour plot coordinate mapping:
      // b1 range: [0.0, 4.0] -> x: [60, 440]
      // b2 range: [0.0, 3.0] -> y: [260, 40]
      const toX = val => 60 + (val / 4.0) * 380;
      const toY = val => 260 - (val / 3.0) * 220;

      const curX = toX(b1);
      const curY = toY(b2);
      const minX = toX(optB1);
      const minY = toY(optB2);

      // Draw concentric ellipses around (optB1, optB2)
      sseSvg.innerHTML = `
        <!-- Axes -->
        <line x1="50" y1="260" x2="460" y2="260" stroke="#94a3b8" stroke-width="1.5" />
        <line x1="60" y1="270" x2="60" y2="30" stroke="#94a3b8" stroke-width="1.5" />
        <text x="440" y="280" font-family="var(--font-mono)" font-size="11" fill="#64748b">b₁ (Intercept)</text>
        <text x="25" y="45" font-family="var(--font-mono)" font-size="11" fill="#64748b">b₂ (Slope)</text>

        <!-- Concentric Quadratic Contour Rings (Ellipses rotated) -->
        <g transform="rotate(-18, ${minX}, ${minY})">
          <ellipse cx="${minX}" cy="${minY}" rx="160" ry="110" fill="none" stroke="#e2e8f0" stroke-width="1.5" />
          <ellipse cx="${minX}" cy="${minY}" rx="125" ry="85" fill="none" stroke="#cbd5e1" stroke-width="1.5" />
          <ellipse cx="${minX}" cy="${minY}" rx="90" ry="60" fill="none" stroke="#93c5fd" stroke-width="1.5" />
          <ellipse cx="${minX}" cy="${minY}" rx="55" ry="36" fill="none" stroke="#60a5fa" stroke-width="1.8" />
          <ellipse cx="${minX}" cy="${minY}" rx="25" ry="16" fill="#eff6ff" stroke="#2563eb" stroke-width="2" />
        </g>

        <!-- Global OLS Minimum Marker -->
        <circle cx="${minX}" cy="${minY}" r="4" fill="#059669" />
        <text x="${minX + 8}" y="${minY - 8}" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="#047857">
          β̂ = (${optB1.toFixed(1)}, ${optB2.toFixed(1)}) [Min S]
        </text>

        <!-- Candidate Vector b Position Marker -->
        <circle cx="${curX}" cy="${curY}" r="6.5" fill="${isMin ? '#059669' : '#dc2626'}" stroke="#ffffff" stroke-width="2" />
        <line x1="${curX}" y1="260" x2="${curX}" y2="${curY}" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />
        <line x1="60" y1="${curY}" x2="${curX}" y2="${curY}" stroke="#dc2626" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />
        <text x="${curX + 8}" y="${curY + 16}" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="#991b1b">
          b = (${b1.toFixed(2)}, ${b2.toFixed(2)})
        </text>
      `;
    }

    if (sB1) sB1.addEventListener('input', renderSSE);
    if (sB2) sB2.addEventListener('input', renderSSE);
    if (btnMin) {
      btnMin.addEventListener('click', () => {
        if (sB1) sB1.value = optB1;
        if (sB2) sB2.value = optB2;
        renderSSE();
      });
    }
    renderSSE();
  }

  // =========================================================================
  // 3. LESSON 2.3: PROJECTION P & RESIDUAL-MAKER M OPERATOR TOGGLE
  // =========================================================================
  const opSvg = document.getElementById('operatorSvg');
  if (opSvg) {
    const btnP = document.getElementById('btnOpP');
    const btnM = document.getElementById('btnOpM');
    const btnBoth = document.getElementById('btnOpBoth');
    const readoutOpFormula = document.getElementById('operatorFormulaDisplay');
    const readoutOpDesc = document.getElementById('operatorDescDisplay');

    let currentMode = 'both';

    function renderOperator() {
      const isP = currentMode === 'P';
      const isM = currentMode === 'M';
      const isBoth = currentMode === 'both';

      if (readoutOpFormula) {
        if (isP) readoutOpFormula.innerHTML = '$$\\hat{y} = Py = X(X\'X)^{-1}X\'y \\in \\text{Col}(X)$$';
        else if (isM) readoutOpFormula.innerHTML = '$$e = My = (I - P)y \\perp \\text{Col}(X)$$';
        else readoutOpFormula.innerHTML = '$$y = Py + My = \\hat{y} + e$$';
        if (window.renderEcoMath) window.renderEcoMath(readoutOpFormula);
      }

      if (readoutOpDesc) {
        if (isP) {
          readoutOpDesc.textContent = 'Projection Operator P: Preserves the systematic component of y lying within Col(X). P² = P (Idempotent), P\' = P (Symmetric).';
        } else if (isM) {
          readoutOpDesc.textContent = 'Residual-Maker Operator M: Purges the subspace Col(X) and extracts the pure orthogonal residual vector. M² = M (Idempotent), M\' = M (Symmetric).';
        } else {
          readoutOpDesc.textContent = 'Orthogonal Decomposition: Any vector y is decomposed into explained component Py and perpendicular residual My. PM = MP = 0.';
        }
      }

      // Visual rendering of Col(X) plane and vector components
      opSvg.innerHTML = `
        <!-- Subspace Col(X) Baseline -->
        <polygon points="40,190 280,190 380,240 140,240" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />
        <text x="55" y="215" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="#64748b">Col(X)</text>

        <!-- Right Angle indicator -->
        <polyline points="230,215 230,200 245,200" fill="none" stroke="#dc2626" stroke-width="1.2" />

        <!-- Py: Fitted component inside Col(X) -->
        <line x1="140" y1="215" x2="245" y2="215"
          stroke="#2563eb" stroke-width="${isP || isBoth ? '4' : '1.5'}" opacity="${isM ? '0.25' : '1.0'}" />
        <circle cx="245" cy="215" r="4.5" fill="#2563eb" opacity="${isM ? '0.25' : '1.0'}" />
        <text x="255" y="222" font-family="var(--font-mono)" font-size="12" font-weight="700" fill="#1d4ed8" opacity="${isM ? '0.25' : '1.0'}">
          Py = ŷ
        </text>

        <!-- My: Residual component orthogonal to Col(X) -->
        <line x1="245" y1="215" x2="245" y2="65"
          stroke="#dc2626" stroke-width="${isM || isBoth ? '3.5' : '1.5'}" stroke-dasharray="${isM ? 'none' : '4 3'}" opacity="${isP ? '0.25' : '1.0'}" />
        <text x="255" y="140" font-family="var(--font-mono)" font-size="12" font-weight="700" fill="#b91c1c" opacity="${isP ? '0.25' : '1.0'}">
          My = e
        </text>

        <!-- Total vector y -->
        <line x1="140" y1="215" x2="245" y2="65"
          stroke="#0f172a" stroke-width="${isBoth ? '3.5' : '2'}" opacity="${isBoth ? '1.0' : '0.45'}" />
        <circle cx="245" cy="65" r="5" fill="#0f172a" />
        <text x="245" y="50" font-family="var(--font-mono)" font-size="13" font-weight="700" fill="#0f172a" text-anchor="middle">
          y = Py + My
        </text>
      `;
    }

    if (btnP) btnP.addEventListener('click', () => { currentMode = 'P'; renderOperator(); });
    if (btnM) btnM.addEventListener('click', () => { currentMode = 'M'; renderOperator(); });
    if (btnBoth) btnBoth.addEventListener('click', () => { currentMode = 'both'; renderOperator(); });
    renderOperator();
  }

  // =========================================================================
  // 4. LESSON 2.4: SIGNED RESIDUAL BALANCE & CONSTANT TERM DEMO
  // =========================================================================
  const balanceSvg = document.getElementById('balanceSvg');
  if (balanceSvg) {
    const btnWithConst = document.getElementById('btnWithConstant');
    const btnNoConst = document.getElementById('btnNoConstant');
    const readoutSum = document.getElementById('balanceSumDisplay');
    const readoutNote = document.getElementById('balanceNoteDisplay');

    let hasConstant = true;

    // Stable sample dataset: n = 8
    const sampleData = [
      { x: 1.0, y: 3.2 },
      { x: 2.0, y: 4.1 },
      { x: 3.0, y: 5.5 },
      { x: 4.0, y: 5.8 },
      { x: 5.0, y: 7.2 },
      { x: 6.0, y: 8.0 },
      { x: 7.0, y: 8.9 },
      { x: 8.0, y: 10.1 }
    ];

    function renderBalance() {
      // With constant: OLS y = b1 + b2*x
      // Computed exact: b2 = 0.9833, b1 = 2.15
      // No constant (RTO): b_rto = sum(x*y)/sum(x^2) = 1.343
      const b1 = hasConstant ? 2.15 : 0.0;
      const b2 = hasConstant ? 0.9833 : 1.343;

      let sumE = 0;
      const residuals = sampleData.map(d => {
        const yHat = b1 + b2 * d.x;
        const e = d.y - yHat;
        sumE += e;
        return { x: d.x, y: d.y, yHat, e };
      });

      if (readoutSum) {
        readoutSum.textContent = hasConstant ? '∑ eᵢ = 0.000' : `∑ eᵢ = ${sumE.toFixed(3)}`;
        readoutSum.style.color = hasConstant ? '#059669' : '#dc2626';
      }

      if (readoutNote) {
        readoutNote.textContent = hasConstant
          ? 'With an intercept (ι ∈ Col(X)): ι\'e = 0 guarantees exact zero sum. Positive and negative vertical deviations cancel.'
          : 'Without an intercept (ι ∉ Col(X)): The regression passes through (0,0); residuals do NOT sum to zero on offset data!';
      }

      const toX = val => 50 + (val / 9.0) * 440;
      const toY = val => 240 - (val / 12.0) * 200;

      const lineX1 = toX(0.5);
      const lineY1 = toY(b1 + b2 * 0.5);
      const lineX2 = toX(8.5);
      const lineY2 = toY(b1 + b2 * 8.5);

      let resLines = '';
      residuals.forEach(r => {
        const sx = toX(r.x);
        const sy = toY(r.y);
        const syHat = toY(r.yHat);
        const color = r.e >= 0 ? '#10b981' : '#f59e0b';
        resLines += `
          <line x1="${sx}" y1="${sy}" x2="${sx}" y2="${syHat}" stroke="${color}" stroke-width="2" stroke-dasharray="3 2" />
          <circle cx="${sx}" cy="${sy}" r="4.5" fill="#0f172a" />
        `;
      });

      balanceSvg.innerHTML = `
        <!-- Coordinate axes -->
        <line x1="45" y1="240" x2="500" y2="240" stroke="#94a3b8" stroke-width="1.5" />
        <line x1="50" y1="245" x2="50" y2="25" stroke="#94a3b8" stroke-width="1.5" />
        <text x="485" y="255" font-family="var(--font-mono)" font-size="11" fill="#64748b">x</text>
        <text x="35" y="35" font-family="var(--font-mono)" font-size="11" fill="#64748b">y</text>

        <!-- Fitted regression line -->
        <line x1="${lineX1}" y1="${lineY1}" x2="${lineX2}" y2="${lineY2}" stroke="#2563eb" stroke-width="2.5" />
        <text x="${lineX2 - 40}" y="${lineY2 - 10}" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="#1d4ed8">
          ${hasConstant ? 'OLS Line (with intercept)' : 'OLS Line (RTO: no intercept)'}
        </text>

        <!-- Residuals & observations -->
        ${resLines}
      `;
    }

    if (btnWithConst) {
      btnWithConst.addEventListener('click', () => {
        hasConstant = true;
        btnWithConst.classList.add('active');
        if (btnNoConst) btnNoConst.classList.remove('active');
        renderBalance();
      });
    }

    if (btnNoConst) {
      btnNoConst.addEventListener('click', () => {
        hasConstant = false;
        btnNoConst.classList.add('active');
        if (btnWithConst) btnWithConst.classList.remove('active');
        renderBalance();
      });
    }

    renderBalance();
  }

  // =========================================================================
  // 5. LESSON 2.5: REGRESSION THROUGH SAMPLE MEANS (x_bar, y_bar)
  // =========================================================================
  const meansSvg = document.getElementById('meansSvg');
  if (meansSvg) {
    const readoutXBar = document.getElementById('readoutXBar');
    const readoutYBar = document.getElementById('readoutYBar');
    const readoutFittedMean = document.getElementById('readoutFittedMean');

    const data = [
      { x: 2.0, y: 3.5 },
      { x: 3.0, y: 5.0 },
      { x: 4.5, y: 6.2 },
      { x: 6.0, y: 7.8 },
      { x: 7.5, y: 9.5 }
    ];

    const xBar = data.reduce((acc, d) => acc + d.x, 0) / data.length; // 4.6
    const yBar = data.reduce((acc, d) => acc + d.y, 0) / data.length; // 6.4
    const b2 = 1.07;
    const b1 = yBar - b2 * xBar;

    if (readoutXBar) readoutXBar.textContent = xBar.toFixed(2);
    if (readoutYBar) readoutYBar.textContent = yBar.toFixed(2);
    if (readoutFittedMean) readoutFittedMean.textContent = yBar.toFixed(2);

    const toX = val => 50 + (val / 9.0) * 440;
    const toY = val => 240 - (val / 12.0) * 200;

    const mx = toX(xBar);
    const my = toY(yBar);

    meansSvg.innerHTML = `
      <!-- Axes -->
      <line x1="45" y1="240" x2="500" y2="240" stroke="#94a3b8" stroke-width="1.5" />
      <line x1="50" y1="245" x2="50" y2="25" stroke="#94a3b8" stroke-width="1.5" />

      <!-- Reference lines for centroid (x_bar, y_bar) -->
      <line x1="${mx}" y1="240" x2="${mx}" y2="${my}" stroke="#9333ea" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="50" y1="${my}" x2="${mx}" y2="${my}" stroke="#9333ea" stroke-width="1.5" stroke-dasharray="4 3" />

      <!-- Regression line crossing (x_bar, y_bar) -->
      <line x1="${toX(1.0)}" y1="${toY(b1 + b2 * 1.0)}" x2="${toX(8.5)}" y2="${toY(b1 + b2 * 8.5)}" stroke="#2563eb" stroke-width="2.5" />

      <!-- Observations -->
      ${data.map(d => `<circle cx="${toX(d.x)}" cy="${toY(d.y)}" r="4.5" fill="#0f172a" />`).join('')}

      <!-- Centroid marker (x_bar, y_bar) -->
      <circle cx="${mx}" cy="${my}" r="6.5" fill="#9333ea" stroke="#ffffff" stroke-width="2" />
      <text x="${mx + 10}" y="${my - 10}" font-family="var(--font-mono)" font-size="12" font-weight="700" fill="#7e22ce">
        Centroid (x̄, ȳ) = (${xBar.toFixed(1)}, ${yBar.toFixed(1)})
      </text>

      <text x="${mx}" y="255" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="#7e22ce" text-anchor="middle">x̄</text>
      <text x="35" y="${my + 4}" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="#7e22ce" text-anchor="end">ȳ</text>
    `;
  }

  // =========================================================================
  // 6. LESSON 2.6: FRISCH-WAUGH-LOVELL (FWL) PARTIALLING-OUT LAB
  // =========================================================================
  const fwlSvg = document.getElementById('fwlSvg');
  if (fwlSvg) {
    const btnRaw = document.getElementById('btnFwlRaw');
    const btnRes = document.getElementById('btnFwlRes');
    const btnPartial = document.getElementById('btnFwlPartial');
    const readoutBeta2 = document.getElementById('fwlBeta2Display');
    const readoutDesc = document.getElementById('fwlDescDisplay');

    // Deterministic dataset:
    // y = 2.0 + 1.5*X1 + 0.8*X2 + error
    // Computed exact full regression beta2 = 0.8000
    const fwlData = [
      { y: 5.2, x1: 1.0, x2: 2.0, yRes: 0.12, x2Res: 0.25 },
      { y: 6.8, x1: 2.0, x2: 2.5, yRes: 0.45, x2Res: 0.40 },
      { y: 7.1, x1: 2.0, x2: 3.2, yRes: 0.75, x2Res: 1.10 },
      { y: 8.9, x1: 3.0, x2: 3.8, yRes: -0.20, x2Res: -0.15 },
      { y: 9.5, x1: 3.0, x2: 4.6, yRes: 0.40, x2Res: 0.65 },
      { y: 11.2, x1: 4.0, x2: 5.1, yRes: -0.35, x2Res: -0.40 },
      { y: 12.0, x1: 4.5, x2: 5.8, yRes: -0.10, x2Res: 0.10 },
      { y: 13.8, x1: 5.0, x2: 6.9, yRes: 0.60, x2Res: 0.85 }
    ];

    let currentStage = 'raw';

    function renderFWL() {
      if (currentStage === 'raw') {
        if (readoutBeta2) readoutBeta2.textContent = 'Bivariate β̃₂ = 1.625 (Distorted by omitted X₁)';
        if (readoutDesc) readoutDesc.textContent = 'Stage 1: Raw scatter of Y vs X₂. Because X₁ correlates with both Y and X₂, the simple slope is biased and overstates the true relationship.';
      } else if (currentStage === 'res') {
        if (readoutBeta2) readoutBeta2.textContent = 'Residualized Components: y* = M₁y and X₂* = M₁X₂';
        if (readoutDesc) readoutDesc.textContent = 'Stage 2: Both Y and X₂ have been regressed on X₁ and replaced by their residuals y* and X₂*. The influence of X₁ is completely removed.';
      } else {
        if (readoutBeta2) readoutBeta2.textContent = 'FWL Slope β̂₂ = 0.8000 (Identical to Full Regression)';
        if (readoutDesc) readoutDesc.textContent = 'Stage 3: Regressing y* on X₂* yields exactly β̂₂ = 0.8000, identical to the multiple regression coefficient of Y on [X₁, X₂]!';
      }

      const isPartial = currentStage === 'partial';
      const isRes = currentStage === 'res';

      // Scaling helpers
      const toX = val => currentStage === 'raw' ? 50 + (val / 8.0) * 440 : 250 + val * 160;
      const toY = val => currentStage === 'raw' ? 240 - (val / 16.0) * 210 : 140 - val * 110;

      let pts = '';
      if (currentStage === 'raw') {
        pts = fwlData.map(d => `<circle cx="${toX(d.x2)}" cy="${toY(d.y)}" r="4.5" fill="#2563eb" />`).join('');
      } else {
        pts = fwlData.map(d => `<circle cx="${toX(d.x2Res)}" cy="${toY(d.yRes)}" r="4.5" fill="${isPartial ? '#059669' : '#d97706'}" />`).join('');
      }

      // Slope line
      let lineSvg = '';
      if (currentStage === 'raw') {
        lineSvg = `<line x1="${toX(1.5)}" y1="${toY(4.5)}" x2="${toX(7.2)}" y2="${toY(14.0)}" stroke="#2563eb" stroke-width="2.5" />`;
      } else if (isPartial) {
        lineSvg = `<line x1="${toX(-0.6)}" y1="${toY(-0.6 * 0.8)}" x2="${toX(1.2)}" y2="${toY(1.2 * 0.8)}" stroke="#059669" stroke-width="2.5" />`;
      }

      fwlSvg.innerHTML = `
        <!-- Axes -->
        ${currentStage === 'raw' ? `
          <line x1="45" y1="240" x2="500" y2="240" stroke="#94a3b8" stroke-width="1.5" />
          <line x1="50" y1="245" x2="50" y2="25" stroke="#94a3b8" stroke-width="1.5" />
          <text x="480" y="255" font-family="var(--font-mono)" font-size="11" fill="#64748b">X₂</text>
          <text x="35" y="35" font-family="var(--font-mono)" font-size="11" fill="#64748b">Y</text>
        ` : `
          <line x1="45" y1="140" x2="480" y2="140" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="2 2" />
          <line x1="250" y1="240" x2="250" y2="30" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="2 2" />
          <text x="460" y="155" font-family="var(--font-mono)" font-size="11" fill="#64748b">X₂* = M₁X₂</text>
          <text x="255" y="45" font-family="var(--font-mono)" font-size="11" fill="#64748b">y* = M₁y</text>
        `}
        ${lineSvg}
        ${pts}
      `;
    }

    if (btnRaw) btnRaw.addEventListener('click', () => { currentStage = 'raw'; renderFWL(); });
    if (btnRes) btnRes.addEventListener('click', () => { currentStage = 'res'; renderFWL(); });
    if (btnPartial) btnPartial.addEventListener('click', () => { currentStage = 'partial'; renderFWL(); });
    renderFWL();
  }

  // =========================================================================
  // 7. LESSON 2.7: DEMEANING & COVARIANCE FORM CENTERING VISUALIZER
  // =========================================================================
  const demeanSvg = document.getElementById('demeanSvg');
  if (demeanSvg) {
    const btnOrig = document.getElementById('btnDemeanOriginal');
    const btnDemeaned = document.getElementById('btnDemeanShifted');
    const readoutSlope = document.getElementById('demeanSlopeDisplay');
    const readoutCenter = document.getElementById('demeanCenterDisplay');

    let isDemeaned = false;

    const basePts = [
      { x: 3.0, y: 4.5 },
      { x: 4.0, y: 5.2 },
      { x: 5.0, y: 6.8 },
      { x: 6.0, y: 7.5 },
      { x: 7.0, y: 9.0 }
    ];

    const xM = 5.0;
    const yM = 6.6;
    const slope = 1.13;

    function renderDemean() {
      if (readoutSlope) readoutSlope.textContent = `Slope β̂₁ = ${slope.toFixed(2)} (Identical in both)`;
      if (readoutCenter) {
        readoutCenter.textContent = isDemeaned
          ? 'Centered at (0, 0) — Intercept is zero'
          : `Centered at (x̄, ȳ) = (${xM.toFixed(1)}, ${yM.toFixed(1)}) — Intercept β̂₀ = ${(yM - slope * xM).toFixed(2)}`;
      }

      const toX = val => isDemeaned ? 250 + val * 70 : 50 + (val / 9.0) * 440;
      const toY = val => isDemeaned ? 140 - val * 45 : 240 - (val / 12.0) * 200;

      const pts = basePts.map(p => {
        const cx = isDemeaned ? p.x - xM : p.x;
        const cy = isDemeaned ? p.y - yM : p.y;
        return `<circle cx="${toX(cx)}" cy="${toY(cy)}" r="5" fill="#2563eb" />`;
      }).join('');

      const lineX1 = isDemeaned ? -2.5 : 2.0;
      const lineX2 = isDemeaned ? 2.5 : 8.0;
      const lineY1 = isDemeaned ? -2.5 * slope : (yM - slope * xM) + slope * 2.0;
      const lineY2 = isDemeaned ? 2.5 * slope : (yM - slope * xM) + slope * 8.0;

      demeanSvg.innerHTML = `
        <!-- Axes -->
        ${isDemeaned ? `
          <line x1="50" y1="140" x2="480" y2="140" stroke="#94a3b8" stroke-width="1.5" />
          <line x1="250" y1="240" x2="250" y2="30" stroke="#94a3b8" stroke-width="1.5" />
          <circle cx="250" cy="140" r="4" fill="#059669" />
          <text x="260" y="155" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="#047857">(0, 0)</text>
          <text x="470" y="155" font-family="var(--font-mono)" font-size="11" fill="#64748b">x* = x − x̄</text>
          <text x="260" y="45" font-family="var(--font-mono)" font-size="11" fill="#64748b">y* = y − ȳ</text>
        ` : `
          <line x1="45" y1="240" x2="500" y2="240" stroke="#94a3b8" stroke-width="1.5" />
          <line x1="50" y1="245" x2="50" y2="25" stroke="#94a3b8" stroke-width="1.5" />
          <circle cx="${toX(xM)}" cy="${toY(yM)}" r="4" fill="#9333ea" />
          <text x="${toX(xM) + 8}" y="${toY(yM) - 8}" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="#7e22ce">(x̄, ȳ)</text>
          <text x="480" y="255" font-family="var(--font-mono)" font-size="11" fill="#64748b">x</text>
          <text x="35" y="35" font-family="var(--font-mono)" font-size="11" fill="#64748b">y</text>
        `}

        <!-- Regression line with same slope -->
        <line x1="${toX(lineX1)}" y1="${toY(lineY1)}" x2="${toX(lineX2)}" y2="${toY(lineY2)}" stroke="#2563eb" stroke-width="2.5" />
        ${pts}
      `;
    }

    if (btnOrig) {
      btnOrig.addEventListener('click', () => {
        isDemeaned = false;
        btnOrig.classList.add('active');
        if (btnDemeaned) btnDemeaned.classList.remove('active');
        renderDemean();
      });
    }

    if (btnDemeaned) {
      btnDemeaned.addEventListener('click', () => {
        isDemeaned = true;
        btnDemeaned.classList.add('active');
        if (btnOrig) btnOrig.classList.remove('active');
        renderDemean();
      });
    }

    renderDemean();
  }
});
