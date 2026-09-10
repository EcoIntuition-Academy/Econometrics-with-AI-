/**
 * EcoIntuition Academy — Econometrics with AI
 * Interactive Widgets, Top Nav Dropdown, Math Utilities & Practice Accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 0. TOP LESSON DROPDOWN CONTROLLER
  // =========================================================================
  const dropdownToggle = document.querySelector('.lesson-dropdown-toggle');
  const dropdownMenu = document.querySelector('.lesson-dropdown-menu');

  if (dropdownToggle && dropdownMenu) {
    function closeDropdown() {
      dropdownMenu.classList.remove('active', 'is-open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }

    function openDropdown() {
      dropdownMenu.classList.add('active', 'is-open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
    }

    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = dropdownMenu.classList.contains('active') || dropdownMenu.classList.contains('is-open');
      if (isCurrentlyOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close when clicking any lesson link in the dropdown menu
    dropdownMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDropdown();
      });
    });

    // Close on Escape key and return focus to toggle button
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const isOpen = dropdownMenu.classList.contains('active') || dropdownMenu.classList.contains('is-open');
        if (isOpen) {
          closeDropdown();
          dropdownToggle.focus();
        }
      }
    });
  }

  // =========================================================================
  // 1. PRACTICE SECTION HINTS & SOLUTIONS ACCORDIONS
  // =========================================================================
  const toggleButtons = document.querySelectorAll('[data-toggle-target]');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const isShown = targetEl.classList.toggle('active');
        btn.setAttribute('aria-expanded', isShown);
        if (btn.classList.contains('hint-toggle')) {
          btn.textContent = isShown ? 'Hide Hint' : 'Show Hint';
        } else if (btn.classList.contains('solution-toggle')) {
          btn.textContent = isShown ? 'Hide Solution' : 'Show Solution';
        }
        if (isShown && window.renderEcoMath) {
          window.renderEcoMath(targetEl);
        }
      }
    });
  });

  // Category filter pills for practice questions
  const practicePills = document.querySelectorAll('.practice-pill');
  if (practicePills.length > 0) {
    practicePills.forEach(pill => {
      pill.addEventListener('click', () => {
        practicePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-category');
        const items = document.querySelectorAll('.practice-question-item');
        items.forEach(item => {
          if (cat === 'all' || item.getAttribute('data-category') === cat) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // =========================================================================
  // 2. LESSON 1: CAUSALITY VS PREDICTION TABS
  // =========================================================================
  const purposeTabs = document.querySelectorAll('[data-purpose-tab]');
  if (purposeTabs.length > 0) {
    purposeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-purpose-tab');
        purposeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.purpose-panel').forEach(panel => {
          if (panel.getAttribute('data-purpose-panel') === target) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // =========================================================================
  // 3. LESSON 2: CONFOUNDING & CLASS SIZE SCATTERPLOT TOGGLE
  // =========================================================================
  const confounderToggles = document.querySelectorAll('[data-confounder-btn]');
  const confounderSvg = document.getElementById('confounderSvg');
  const confounderExplanation = document.getElementById('confounderExplanationText');

  if (confounderToggles.length > 0 && confounderSvg) {
    // School districts data: class size, test score, affluent (high parental inv / top teachers)
    const schoolData = [
      { x: 15, y: 84, affluent: true },
      { x: 16, y: 81, affluent: true },
      { x: 17, y: 86, affluent: true },
      { x: 18, y: 80, affluent: true },
      { x: 19, y: 77, affluent: true },
      { x: 20, y: 79, affluent: true },
      { x: 23, y: 68, affluent: false },
      { x: 24, y: 65, affluent: false },
      { x: 25, y: 70, affluent: false },
      { x: 26, y: 62, affluent: false },
      { x: 27, y: 66, affluent: false },
      { x: 28, y: 61, affluent: false }
    ];

    function drawConfounderPlot(showHidden) {
      const W = 620, H = 300, padL = 60, padR = 40, padT = 30, padB = 45;
      const xMin = 12, xMax = 30;
      const yMin = 55, yMax = 92;

      const mapX = x => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
      const mapY = y => H - padB - ((y - yMin) / (yMax - yMin)) * (H - padT - padB);

      let content = `
        <defs>
          <linearGradient id="affluentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10b981"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
          <linearGradient id="disadvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <!-- Axes -->
        <line x1="${padL}" y1="${mapY(yMin)}" x2="${W - padR}" y2="${mapY(yMin)}" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>
        <line x1="${padL}" y1="${mapY(yMin)}" x2="${padL}" y2="${padT}" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>
        <text x="${W - padR}" y="${mapY(yMin) + 30}" font-size="12" fill="currentColor" opacity="0.8" text-anchor="end">Class Size (Students per Class)</text>
        <text x="${padL - 10}" y="${padT + 12}" font-size="12" fill="currentColor" opacity="0.8" text-anchor="end">Test Score</text>
      `;

      // Tick marks
      [15, 20, 25, 30].forEach(tx => {
        content += `
          <line x1="${mapX(tx)}" y1="${mapY(yMin)}" x2="${mapX(tx)}" y2="${mapY(yMin) + 5}" stroke="currentColor" stroke-opacity="0.3"/>
          <text x="${mapX(tx)}" y="${mapY(yMin) + 18}" font-size="11" fill="currentColor" opacity="0.6" text-anchor="middle">${tx}</text>
        `;
      });
      [60, 70, 80, 90].forEach(ty => {
        content += `
          <line x1="${padL - 5}" y1="${mapY(ty)}" x2="${padL}" y2="${mapY(ty)}" stroke="currentColor" stroke-opacity="0.3"/>
          <text x="${padL - 8}" y="${mapY(ty) + 4}" font-size="11" fill="currentColor" opacity="0.6" text-anchor="end">${ty}</text>
        `;
      });

      if (!showHidden) {
        // Naive line across all points (steep negative slope)
        content += `
          <line x1="${mapX(14)}" y1="${mapY(86)}" x2="${mapX(29)}" y2="${mapY(60)}" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,4"/>
          <text x="${mapX(21)}" y="${mapY(76) - 12}" font-size="12" fill="#ef4444" font-weight="600">Naive OLS Slope: β₂ ≈ -1.73 (Confounded)</text>
        `;
        schoolData.forEach(pt => {
          content += `<circle cx="${mapX(pt.x)}" cy="${mapY(pt.y)}" r="5.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5"/>`;
        });
      } else {
        // Show subgroup regression lines + distinct colored clusters
        // Subgroup 1: Affluent (flat mild slope)
        content += `
          <line x1="${mapX(14)}" y1="${mapY(84)}" x2="${mapX(21)}" y2="${mapY(78)}" stroke="#10b981" stroke-width="2.5"/>
          <text x="${mapX(17)}" y="${mapY(86) - 8}" font-size="11" fill="#10b981" font-weight="600">High Parental Inv / Top Teachers (True β₂ ≈ -0.5)</text>

          <line x1="${mapX(22)}" y1="${mapY(68)}" x2="${mapX(29)}" y2="${mapY(62)}" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="${mapX(25)}" y="${mapY(70) + 18}" font-size="11" fill="#f59e0b" font-weight="600">Lower Parental Resources (True β₂ ≈ -0.5)</text>

          <line x1="${mapX(14)}" y1="${mapY(86)}" x2="${mapX(29)}" y2="${mapY(60)}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6"/>
        `;
        schoolData.forEach(pt => {
          const fill = pt.affluent ? 'url(#affluentGrad)' : 'url(#disadvGrad)';
          content += `<circle cx="${mapX(pt.x)}" cy="${mapY(pt.y)}" r="6" fill="${fill}" stroke="#ffffff" stroke-width="1.5"/>`;
        });
      }

      confounderSvg.innerHTML = content;
    }

    confounderToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        confounderToggles.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const showHidden = btn.getAttribute('data-confounder-btn') === 'hidden';
        drawConfounderPlot(showHidden);

        if (confounderExplanation) {
          if (showHidden) {
            confounderExplanation.innerHTML = `
              <strong>Confounders Unveiled:</strong> When conditioning on parental involvement & teacher quality, each group shows a much milder causal slope (approximately &minus;0.5). The naive regression (&minus;1.73) combined the two separate socio-economic strata, misattributing the family and teacher advantages directly to class size!
            `;
          } else {
            confounderExplanation.innerHTML = `
              <strong>Naive Bivariate Association:</strong> The raw scatterplot shows a stark negative slope (slope &approx; &minus;1.73). Policymakers might conclude cutting class sizes drastically raises test scores alone, ignoring that affluent districts simultaneously have smaller classes, master teachers, and higher parental tutoring.
            `;
          }
          if (window.renderEcoMath) window.renderEcoMath(confounderExplanation);
        }
      });
    });

    drawConfounderPlot(false);
  }

  // =========================================================================
  // 4. LESSON 3: REGRESSION LINE SIMULATOR
  // =========================================================================
  const sB1 = document.getElementById('sliderBeta1');
  const sB2 = document.getElementById('sliderBeta2');
  const sNoise = document.getElementById('sliderNoise');
  const regSvg = document.getElementById('regLineSimulatorSvg') || document.getElementById('regSimSvg');

  if (sB1 && sB2 && sNoise && regSvg) {
    const N = 16;
    const basePts = [];
    for (let i = 1; i <= N; i++) {
      const x = 2 + (i - 1) * 1.6;
      const seed = Math.sin(i * 14.23 + 45.1) * 1.8;
      basePts.push({ x, seed });
    }

    function renderRegSim() {
      const b1 = parseFloat(sB1.value);
      const b2 = parseFloat(sB2.value);
      const noise = parseFloat(sNoise.value);

      const b1Val = document.getElementById('valBeta1');
      const b2Val = document.getElementById('valBeta2');
      const nVal = document.getElementById('valNoise');
      const formulaEl = document.getElementById('regFormulaDisplay');

      if (b1Val) b1Val.textContent = b1.toFixed(1);
      if (b2Val) b2Val.textContent = (b2 >= 0 ? '+' : '') + b2.toFixed(1);
      if (nVal) nVal.textContent = noise.toFixed(1);

      if (formulaEl) {
        const sign = b2 >= 0 ? '+' : '−';
        formulaEl.innerHTML = `$$\\mathbb{E}[y \\mid x] = ${b1.toFixed(1)} ${sign} ${Math.abs(b2).toFixed(1)} x_2$$`;
        if (window.renderEcoMath) {
          window.renderEcoMath(formulaEl);
        }
      }

      const W = 620, H = 290, padL = 55, padR = 35, padT = 30, padB = 42;
      const xMin = 0, xMax = 30;
      const yMin = -5, yMax = 85;

      const mapX = x => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
      const mapY = y => H - padB - ((Math.max(yMin, Math.min(yMax, y)) - yMin) / (yMax - yMin)) * (H - padT - padB);

      let svg = `
        <!-- Subtle Background Coordinate Grid -->
        <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3">
          <line x1="${padL}" y1="${mapY(20)}" x2="${W - padR}" y2="${mapY(20)}"/>
          <line x1="${padL}" y1="${mapY(40)}" x2="${W - padR}" y2="${mapY(40)}"/>
          <line x1="${padL}" y1="${mapY(60)}" x2="${W - padR}" y2="${mapY(60)}"/>
          <line x1="${mapX(10)}" y1="${mapY(yMin)}" x2="${mapX(10)}" y2="${padT}"/>
          <line x1="${mapX(20)}" y1="${mapY(yMin)}" x2="${mapX(20)}" y2="${padT}"/>
        </g>

        <!-- Coordinate Axes -->
        <line x1="${padL}" y1="${mapY(yMin)}" x2="${W - padR}" y2="${mapY(yMin)}" stroke="#64748b" stroke-width="2"/>
        <line x1="${padL}" y1="${mapY(yMin)}" x2="${padL}" y2="${padT}" stroke="#64748b" stroke-width="2"/>
        
        <!-- Axis Labels -->
        <text x="${W - padR}" y="${mapY(yMin) - 10}" font-size="12" font-weight="700" fill="#0f172a" text-anchor="end">x₂ (Regressor)</text>
        <text x="${padL + 10}" y="${padT + 12}" font-size="12" font-weight="700" fill="#0f172a">y (Outcome)</text>

        <!-- In-Plot Compact Legend -->
        <g transform="translate(${W - padR - 180}, ${padT + 4})">
          <rect width="180" height="52" rx="6" fill="#ffffff" fill-opacity="0.92" stroke="#cbd5e1" stroke-width="1"/>
          <line x1="12" y1="16" x2="34" y2="16" stroke="#1d4ed8" stroke-width="2.5"/>
          <text x="42" y="20" font-size="10.5" font-weight="600" fill="#1e293b">E[y|x] = β₁ + β₂x</text>
          
          <line x1="12" y1="36" x2="34" y2="36" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="3,2"/>
          <circle cx="23" cy="36" r="3.5" fill="#1e3a8a" stroke="#ffffff" stroke-width="1"/>
          <text x="42" y="40" font-size="10.5" font-weight="600" fill="#475569">Disturbance (εᵢ)</text>
        </g>
      `;

      // True systematic regression line
      const lineX1 = 0;
      const lineY1 = b1 + b2 * lineX1;
      const lineX2 = 28;
      const lineY2 = b1 + b2 * lineX2;

      svg += `
        <line x1="${mapX(lineX1)}" y1="${mapY(lineY1)}" x2="${mapX(lineX2)}" y2="${mapY(lineY2)}" stroke="#1d4ed8" stroke-width="2.8"/>
      `;

      // Disturbance drop lines & observed dots
      basePts.forEach(pt => {
        const yTrue = b1 + b2 * pt.x;
        const eps = pt.seed * noise;
        const yObs = yTrue + eps;

        svg += `
          <line x1="${mapX(pt.x)}" y1="${mapY(yObs)}" x2="${mapX(pt.x)}" y2="${mapY(yTrue)}" stroke="#e11d48" stroke-dasharray="3,2" stroke-width="1.5" opacity="0.85"/>
          <circle cx="${mapX(pt.x)}" cy="${mapY(yObs)}" r="5" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.75"/>
        `;
      });

      regSvg.innerHTML = svg;
    }

    sB1.addEventListener('input', renderRegSim);
    sB2.addEventListener('input', renderRegSim);
    sNoise.addEventListener('input', renderRegSim);
    renderRegSim();
  }

  // =========================================================================
  // 5. LESSON 4: INTERACTIVE OLS SSE MINIMIZER (PLAIN RESPONSIVE SVG)
  // =========================================================================
  const olsB1 = document.getElementById('sliderB1') || document.getElementById('sliderOlsB0');
  const olsB2 = document.getElementById('sliderB2') || document.getElementById('sliderOlsB1');
  const rB1 = document.getElementById('readoutB1');
  const rB2 = document.getElementById('readoutB2');
  const sseDisplay = document.getElementById('sseDisplay') || document.getElementById('olsSseDisplay');
  const optimalSseDisplay = document.getElementById('optimalSseDisplay');
  const olsOptimalBadge = document.getElementById('olsOptimalBadge');
  const btnFindOls = document.getElementById('btnFindOls');
  const olsSvg = document.getElementById('ols-svg') || document.getElementById('sseMinimizerSvg') || document.getElementById('olsMinimizerSvg');

  if (olsB1 && olsB2 && olsSvg) {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Helper to create SVG elements reliably without innerHTML parsing issues
    function createSvgEl(tag, attrs, textContent) {
      const el = document.createElementNS(SVG_NS, tag);
      if (attrs) {
        for (const [key, val] of Object.entries(attrs)) {
          el.setAttribute(key, String(val));
        }
      }
      if (textContent !== undefined && textContent !== null) {
        el.textContent = String(textContent);
      }
      return el;
    }

    // 8 fixed observations calibrated so OLS yields exact b1 = 20.00, b2 = 1.80, and optimal SSE = 32.40
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

    const exactB1 = 20.00;
    const exactB2 = 1.80;
    const optimalSSE = 32.40;

    if (optimalSseDisplay) {
      optimalSseDisplay.textContent = optimalSSE.toFixed(2);
    }

    // Stable geometry bounds for 800 x 420 viewBox
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
      // Invert Y coordinate because browser SVG Y increases downward
      return plotTop + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;
    }

    function renderOLSPlot() {
      const b1 = parseFloat(olsB1.value);
      const b2 = parseFloat(olsB2.value);

      if (!Number.isFinite(b1) || !Number.isFinite(b2)) return;

      if (rB1) rB1.textContent = b1.toFixed(1);
      if (rB2) rB2.textContent = b2.toFixed(2);

      // Compute Current SSE
      let sse = 0;
      observations.forEach(p => {
        const yHat = b1 + b2 * p.x;
        const e = p.y - yHat;
        sse += e * e;
      });

      if (sseDisplay) {
        sseDisplay.textContent = sse.toFixed(2);
      }

      // Show/hide minimum reached indicator based on close tolerance
      const isOptimal = Math.abs(sse - optimalSSE) < 0.15 && Math.abs(b1 - exactB1) < 0.25 && Math.abs(b2 - exactB2) < 0.05;
      if (olsOptimalBadge) {
        olsOptimalBadge.style.display = isOptimal ? 'inline-flex' : 'none';
      }

      // Clear SVG safely
      while (olsSvg.firstChild) {
        olsSvg.removeChild(olsSvg.firstChild);
      }

      // 1. Background
      olsSvg.appendChild(createSvgEl('rect', {
        x: 0,
        y: 0,
        width: 800,
        height: 420,
        fill: '#ffffff',
        rx: 8
      }));

      // 2. Light Grid Lines
      const gridG = createSvgEl('g', {
        stroke: '#e2e8f0',
        'stroke-width': 1,
        'stroke-dasharray': '4,4'
      });
      [10, 20, 30, 40, 50, 60].forEach(yVal => {
        const y = scaleY(yVal);
        gridG.appendChild(createSvgEl('line', {
          x1: plotLeft,
          y1: y,
          x2: plotRight,
          y2: y
        }));
      });
      [4, 8, 12, 16].forEach(xVal => {
        const x = scaleX(xVal);
        gridG.appendChild(createSvgEl('line', {
          x1: x,
          y1: plotBottom,
          x2: x,
          y2: plotTop
        }));
      });
      olsSvg.appendChild(gridG);

      // 3. Axes
      olsSvg.appendChild(createSvgEl('line', {
        x1: plotLeft,
        y1: plotBottom,
        x2: plotRight,
        y2: plotBottom,
        stroke: '#475569',
        'stroke-width': 2
      }));
      olsSvg.appendChild(createSvgEl('line', {
        x1: plotLeft,
        y1: plotBottom,
        x2: plotLeft,
        y2: plotTop,
        stroke: '#475569',
        'stroke-width': 2
      }));

      // 4. Vertical Residual Lines (behind points)
      const resG = createSvgEl('g', {
        stroke: '#dc2626',
        'stroke-width': 2,
        'stroke-dasharray': '4,3'
      });
      observations.forEach(p => {
        const yHat = b1 + b2 * p.x;
        if (Number.isFinite(yHat)) {
          resG.appendChild(createSvgEl('line', {
            x1: scaleX(p.x),
            y1: scaleY(p.y),
            x2: scaleX(p.x),
            y2: scaleY(yHat)
          }));
        }
      });
      olsSvg.appendChild(resG);

      // 5. Candidate Regression Line
      const xEnd = 17.5;
      const yEnd = b1 + b2 * xEnd;
      olsSvg.appendChild(createSvgEl('line', {
        x1: scaleX(0),
        y1: scaleY(b1),
        x2: scaleX(xEnd),
        y2: scaleY(yEnd),
        stroke: '#1d4ed8',
        'stroke-width': 3.2
      }));

      // 6. Scatter Points (on top of residuals & line)
      const ptsG = createSvgEl('g', {
        fill: '#0f172a',
        stroke: '#ffffff',
        'stroke-width': 2
      });
      observations.forEach(p => {
        ptsG.appendChild(createSvgEl('circle', {
          cx: scaleX(p.x),
          cy: scaleY(p.y),
          r: 6
        }));
      });
      olsSvg.appendChild(ptsG);

      // 7. Tick Marks & Tick Labels
      const tickG = createSvgEl('g', {
        'font-size': 13,
        fill: '#475569',
        'font-family': 'system-ui, -apple-system, sans-serif'
      });
      // X ticks
      [0, 4, 8, 12, 16].forEach(val => {
        const x = scaleX(val);
        tickG.appendChild(createSvgEl('line', {
          x1: x,
          y1: plotBottom,
          x2: x,
          y2: plotBottom + 6,
          stroke: '#475569',
          'stroke-width': 1.5
        }));
        tickG.appendChild(createSvgEl('text', {
          x: x,
          y: plotBottom + 22,
          'text-anchor': 'middle'
        }, String(val)));
      });
      // Y ticks
      [0, 10, 20, 30, 40, 50, 60].forEach(val => {
        const y = scaleY(val);
        tickG.appendChild(createSvgEl('line', {
          x1: plotLeft - 6,
          y1: y,
          x2: plotLeft,
          y2: y,
          stroke: '#475569',
          'stroke-width': 1.5
        }));
        tickG.appendChild(createSvgEl('text', {
          x: plotLeft - 10,
          y: y + 4,
          'text-anchor': 'end'
        }, String(val)));
      });
      olsSvg.appendChild(tickG);

      // 8. Axis Titles
      olsSvg.appendChild(createSvgEl('text', {
        x: plotRight,
        y: plotBottom + 42,
        'font-size': 13,
        'font-weight': 700,
        fill: '#0f172a',
        'text-anchor': 'end',
        'font-family': 'system-ui, -apple-system, sans-serif'
      }, 'Regressor X'));

      olsSvg.appendChild(createSvgEl('text', {
        x: plotLeft,
        y: plotTop - 14,
        'font-size': 13,
        'font-weight': 700,
        fill: '#0f172a',
        'text-anchor': 'start',
        'font-family': 'system-ui, -apple-system, sans-serif'
      }, 'Outcome Y'));

      // Note: Legend is rendered cleanly outside the SVG in .ols-legend-card to prevent data overlap
    }

    olsB1.addEventListener('input', renderOLSPlot);
    olsB2.addEventListener('input', renderOLSPlot);

    if (btnFindOls) {
      btnFindOls.addEventListener('click', () => {
        olsB1.value = exactB1.toFixed(1);
        olsB2.value = exactB2.toFixed(1);
        renderOLSPlot();
      });
    }

    renderOLSPlot();

    // ResizeObserver ensures SVG redraws properly on container layout changes
    if (typeof ResizeObserver !== 'undefined' && olsSvg.parentElement) {
      const ro = new ResizeObserver(() => {
        renderOLSPlot();
      });
      ro.observe(olsSvg.parentElement);
    }
  }

  // =========================================================================
  // 6. LESSON 5: LINEARITY IN PARAMETERS QUIZ
  // =========================================================================
  const linearityBtns = document.querySelectorAll('[data-linearity-choice]');
  if (linearityBtns.length > 0) {
    linearityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const parentCard = btn.closest('.linearity-quiz-item');
        const isLinear = parentCard.getAttribute('data-is-linear') === 'true';
        const userChoice = btn.getAttribute('data-linearity-choice') === 'true';
        const feedbackEl = parentCard.querySelector('.quiz-feedback');

        parentCard.querySelectorAll('[data-linearity-choice]').forEach(b => b.disabled = true);

        if (userChoice === isLinear) {
          btn.classList.add('btn-success');
          feedbackEl.innerHTML = `<span style="color:#10b981; font-weight:600;">✓ Correct!</span> ${parentCard.getAttribute('data-explanation')}`;
        } else {
          btn.classList.add('btn-danger');
          feedbackEl.innerHTML = `<span style="color:#ef4444; font-weight:600;">✗ Incorrect.</span> ${parentCard.getAttribute('data-explanation')}`;
        }
        feedbackEl.style.display = 'block';
      });
    });
  }

  // =========================================================================
  // 7. LESSON 6: EXOGENEITY, HETEROSKEDASTICITY & AUTOCORRELATION
  // =========================================================================
  // Exogeneity Toggle
  const exoBtns = document.querySelectorAll('[data-exo-mode]');
  const exoSvg = document.getElementById('exogeneitySvg');
  if (exoBtns.length > 0 && exoSvg) {
    function drawExoPlot(mode) {
      const W = 620, H = 260, padL = 50, padR = 30, padT = 25, padB = 35;
      const xMin = 0, xMax = 20, eMin = -15, eMax = 15;
      const mapX = x => padL + (x / xMax) * (W - padL - padR);
      const mapY = e => H - padB - ((e - eMin) / (eMax - eMin)) * (H - padT - padB);

      let svg = `
        <line x1="${padL}" y1="${mapY(0)}" x2="${W - padR}" y2="${mapY(0)}" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="4,4"/>
        <line x1="${padL}" y1="${mapY(eMin)}" x2="${padL}" y2="${padT}" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>
        <text x="${W - padR}" y="${mapY(0) - 8}" font-size="11" fill="currentColor" opacity="0.7">xᵢ</text>
        <text x="${padL + 8}" y="${padT + 12}" font-size="11" fill="currentColor" opacity="0.7">εᵢ (Error)</text>
      `;

      for (let i = 1; i <= 24; i++) {
        const x = 1 + (i - 1) * 0.8;
        let e;
        if (mode === 'valid') {
          // Pure zero-mean noise independent of X
          e = Math.sin(i * 17.13 + 5.2) * 8;
        } else {
          // Systematic violation: omitted variable creates trend with X
          e = -10 + (x * 1.1) + Math.sin(i * 12.3) * 3;
        }
        svg += `<circle cx="${mapX(x)}" cy="${mapY(e)}" r="4.5" fill="${mode === 'valid' ? '#10b981' : '#ef4444'}" opacity="0.8"/>`;
      }
      exoSvg.innerHTML = svg;
    }

    exoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        exoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawExoPlot(btn.getAttribute('data-exo-mode'));
      });
    });
    drawExoPlot('valid');
  }

  // Heteroskedasticity Toggle
  const hetBtns = document.querySelectorAll('[data-het-mode]');
  const hetSvg = document.getElementById('heteroDemoSvg');
  if (hetBtns.length > 0 && hetSvg) {
    function drawHetPlot(mode) {
      const W = 620, H = 260, padL = 50, padR = 30, padT = 25, padB = 35;
      const xMin = 0, xMax = 20, eMin = -20, eMax = 20;
      const mapX = x => padL + (x / xMax) * (W - padL - padR);
      const mapY = e => H - padB - ((e - eMin) / (eMax - eMin)) * (H - padT - padB);

      let svg = `
        <line x1="${padL}" y1="${mapY(0)}" x2="${W - padR}" y2="${mapY(0)}" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="4,4"/>
        <line x1="${padL}" y1="${mapY(eMin)}" x2="${padL}" y2="${padT}" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>
        <text x="${W - padR}" y="${mapY(0) - 8}" font-size="11" fill="currentColor" opacity="0.7">xᵢ (e.g. State Population)</text>
        <text x="${padL + 8}" y="${padT + 12}" font-size="11" fill="currentColor" opacity="0.7">εᵢ</text>
      `;

      for (let i = 1; i <= 28; i++) {
        const x = 1 + (i - 1) * 0.68;
        const seed = Math.sin(i * 19.41 + 11.2);
        let e;
        if (mode === 'homo') {
          // Constant variance band
          e = seed * 6;
        } else {
          // Fan-shaped spreading variance Var(e) proportional to x
          const spread = 2 + (x * 0.85);
          e = seed * spread;
        }
        svg += `<circle cx="${mapX(x)}" cy="${mapY(e)}" r="4.5" fill="${mode === 'homo' ? '#3b82f6' : '#f59e0b'}" opacity="0.8"/>`;
      }
      hetSvg.innerHTML = svg;
    }

    hetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        hetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawHetPlot(btn.getAttribute('data-het-mode'));
      });
    });
    drawHetPlot('homo');
  }

  // =========================================================================
  // 8. LESSON 8: QUADRATIC MARGINAL EFFECT CALCULATOR & CURVE
  // =========================================================================
  const sQuadB2 = document.getElementById('sliderQuadB2');
  const sQuadB3 = document.getElementById('sliderQuadB3');
  const sQuadX = document.getElementById('sliderQuadX');
  const quadSvg = document.getElementById('quadraticSimulatorSvg');

  if (sQuadB2 && sQuadB3 && sQuadX && quadSvg) {
    function renderQuadratic() {
      const b2 = parseFloat(sQuadB2.value);
      const b3 = parseFloat(sQuadB3.value);
      const curX = parseFloat(sQuadX.value);
      const b1 = 15; // fixed intercept

      const curSlope = b2 + 2 * b3 * curX;
      const curY = b1 + b2 * curX + b3 * curX * curX;

      const vB2 = document.getElementById('valQuadB2');
      const vB3 = document.getElementById('valQuadB3');
      const vX = document.getElementById('valQuadX');
      const slopeOut = document.getElementById('quadMarginalEffectOutput');

      if (vB2) vB2.textContent = b2.toFixed(1);
      if (vB3) vB3.textContent = b3.toFixed(2);
      if (vX) vX.textContent = curX.toFixed(1);
      if (slopeOut) {
        slopeOut.innerHTML = `$$\\frac{\\partial y}{\\partial x} = ${b2.toFixed(1)} + 2(${b3.toFixed(2)})(${curX.toFixed(1)}) = \\mathbf{${curSlope.toFixed(2)}}$$`;
        if (window.renderEcoMath) {
          window.renderEcoMath(slopeOut);
        }
      }

      const W = 620, H = 300, padL = 50, padR = 30, padT = 25, padB = 40;
      const xMin = 0, xMax = 20, yMin = 0, yMax = 90;
      const mapX = x => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
      const mapY = y => H - padB - ((Math.max(yMin, Math.min(yMax, y)) - yMin) / (yMax - yMin)) * (H - padT - padB);

      let polyPath = '';
      for (let x = 0; x <= 20; x += 0.5) {
        const y = b1 + b2 * x + b3 * x * x;
        const px = mapX(x);
        const py = mapY(y);
        polyPath += (x === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`);
      }

      // Tangent line through (curX, curY)
      const tangX1 = Math.max(0, curX - 3.5);
      const tangY1 = curY + curSlope * (tangX1 - curX);
      const tangX2 = Math.min(20, curX + 3.5);
      const tangY2 = curY + curSlope * (tangX2 - curX);

      let svg = `
        <line x1="${padL}" y1="${mapY(0)}" x2="${W - padR}" y2="${mapY(0)}" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>
        <line x1="${padL}" y1="${mapY(0)}" x2="${padL}" y2="${padT}" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>
        <text x="${W - padR}" y="${mapY(0) - 8}" font-size="11" fill="currentColor" opacity="0.7">x (e.g. Experience)</text>
        <text x="${padL + 8}" y="${padT + 12}" font-size="11" fill="currentColor" opacity="0.7">y (e.g. Wage)</text>

        <!-- Quadratic Curve -->
        <path d="${polyPath}" fill="none" stroke="#2563eb" stroke-width="3"/>

        <!-- Tangent Line -->
        <line x1="${mapX(tangX1)}" y1="${mapY(tangY1)}" x2="${mapX(tangX2)}" y2="${mapY(tangY2)}" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3,3"/>

        <!-- Current Operating Point -->
        <circle cx="${mapX(curX)}" cy="${mapY(curY)}" r="6" fill="#f43f5e" stroke="#ffffff" stroke-width="2"/>
      `;

      quadSvg.innerHTML = svg;
    }

    sQuadB2.addEventListener('input', renderQuadratic);
    sQuadB3.addEventListener('input', renderQuadratic);
    sQuadX.addEventListener('input', renderQuadratic);
    renderQuadratic();
  }

  // =========================================================================
  // 9. LESSON 9: DUMMY VARIABLE LOG EFFECT CALCULATOR
  // =========================================================================
  const dummyInput = document.getElementById('inputDummyBeta');
  const dummyCalcBtn = document.getElementById('btnCalculateDummy');
  const approxOut = document.getElementById('dummyApproxOutput');
  const exactOut = document.getElementById('dummyExactOutput');
  const diffOut = document.getElementById('dummyDiscrepancyOutput');

  if (dummyInput && dummyCalcBtn) {
    function computeDummy() {
      const b1 = parseFloat(dummyInput.value);
      if (isNaN(b1)) return;

      const approx = b1 * 100;
      const exact = (Math.exp(b1) - 1) * 100;
      const discrepancy = Math.abs(exact - approx);

      if (approxOut) approxOut.textContent = `${approx.toFixed(2)}%`;
      if (exactOut) exactOut.textContent = `${exact.toFixed(2)}%`;
      if (diffOut) diffOut.textContent = `${discrepancy.toFixed(2)} percentage points`;
    }

    dummyCalcBtn.addEventListener('click', computeDummy);
    dummyInput.addEventListener('input', computeDummy);
    computeDummy();
  }
});
