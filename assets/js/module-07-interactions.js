/**
 * EcoIntuition Academy - Econometrics with AI
 * Module 7: Advanced Difference-in-Differences (DDD)
 * Interactive DDD Table Builder & Calculations
 */

document.addEventListener('DOMContentLoaded', () => {
  initDddBuilder();
});

function initDddBuilder() {
  const container = document.getElementById('dddBuilderApp');
  if (!container) return;

  // Input elements
  const inputs = {
    pittSophPre: document.getElementById('pittSophPre'),
    pittSophPost: document.getElementById('pittSophPost'),
    phillySophPre: document.getElementById('phillySophPre'),
    phillySophPost: document.getElementById('phillySophPost'),
    pittJrPre: document.getElementById('pittJrPre'),
    pittJrPost: document.getElementById('pittJrPost'),
    phillyJrPre: document.getElementById('phillyJrPre'),
    phillyJrPost: document.getElementById('phillyJrPost')
  };

  // Check all inputs exist
  for (const key in inputs) {
    if (!inputs[key]) return;
  }

  // Display elements
  const displays = {
    diffPittSoph: document.getElementById('diffPittSoph'),
    diffPhillySoph: document.getElementById('diffPhillySoph'),
    ddSoph: document.getElementById('ddSoph'),
    metricDdSoph: document.getElementById('metricDdSoph'),

    diffPittJr: document.getElementById('diffPittJr'),
    diffPhillyJr: document.getElementById('diffPhillyJr'),
    ddJr: document.getElementById('ddJr'),
    metricDdJr: document.getElementById('metricDdJr'),

    dddValue: document.getElementById('dddValue'),
    metricDdd: document.getElementById('metricDdd'),
    dddFormulaDisplay: document.getElementById('dddFormulaDisplay'),
    insightBox: document.getElementById('dddInsightText')
  };

  // Preset buttons
  const presetBaseline = document.getElementById('presetBaseline');
  const presetNoEffect = document.getElementById('presetNoEffect');
  const presetNoCityShock = document.getElementById('presetNoCityShock');
  const presetReset = document.getElementById('presetReset');

  // Presets definition
  const presets = {
    baseline: {
      pittSophPre: 68,
      pittSophPost: 70,
      phillySophPre: 64,
      phillySophPost: 71,
      pittJrPre: 72,
      pittJrPost: 75,
      phillyJrPre: 70,
      phillyJrPost: 86
    },
    noEffect: {
      pittSophPre: 68,
      pittSophPost: 70,
      phillySophPre: 64,
      phillySophPost: 71,
      pittJrPre: 72,
      pittJrPost: 75,
      phillyJrPre: 70,
      phillyJrPost: 78 // Junior DD becomes 5, exactly equal to Soph DD (5), so DDD = 0
    },
    noCityShock: {
      pittSophPre: 68,
      pittSophPost: 70,
      phillySophPre: 64,
      phillySophPost: 66, // Soph DD = 0 (city shock β5 = 0)
      pittJrPre: 72,
      pittJrPost: 75,
      phillyJrPre: 70,
      phillyJrPost: 81 // Junior DD = 8, DDD = 8 - 0 = 8
    }
  };

  function applyPreset(presetKey) {
    const data = presets[presetKey];
    if (!data) return;

    for (const key in data) {
      if (inputs[key]) {
        inputs[key].value = data[key];
      }
    }
    updateCalculations();
  }

  function formatVal(val, showPlus = false) {
    const num = Number(val);
    if (isNaN(num)) return '—';
    const formatted = Number.isInteger(num) ? num.toString() : num.toFixed(2);
    if (showPlus && num > 0) {
      return `+${formatted}`;
    }
    return formatted;
  }

  function updateCalculations() {
    const v = {
      pittSophPre: parseFloat(inputs.pittSophPre.value) || 0,
      pittSophPost: parseFloat(inputs.pittSophPost.value) || 0,
      phillySophPre: parseFloat(inputs.phillySophPre.value) || 0,
      phillySophPost: parseFloat(inputs.phillySophPost.value) || 0,
      pittJrPre: parseFloat(inputs.pittJrPre.value) || 0,
      pittJrPost: parseFloat(inputs.pittJrPost.value) || 0,
      phillyJrPre: parseFloat(inputs.phillyJrPre.value) || 0,
      phillyJrPost: parseFloat(inputs.phillyJrPost.value) || 0
    };

    // 1. Sophomores (Placebo Subgroup)
    const diffPittSoph = v.pittSophPost - v.pittSophPre;
    const diffPhillySoph = v.phillySophPost - v.phillySophPre;
    const ddSoph = diffPhillySoph - diffPittSoph;

    // 2. Juniors (Treated Subgroup)
    const diffPittJr = v.pittJrPost - v.pittJrPre;
    const diffPhillyJr = v.phillyJrPost - v.phillyJrPre;
    const ddJr = diffPhillyJr - diffPittJr;

    // 3. Triple Difference (DDD)
    const ddd = ddJr - ddSoph;

    // Update in-table cells
    if (displays.diffPittSoph) displays.diffPittSoph.textContent = formatVal(diffPittSoph, true);
    if (displays.diffPhillySoph) displays.diffPhillySoph.textContent = formatVal(diffPhillySoph, true);
    if (displays.ddSoph) displays.ddSoph.textContent = formatVal(ddSoph, true);

    if (displays.diffPittJr) displays.diffPittJr.textContent = formatVal(diffPittJr, true);
    if (displays.diffPhillyJr) displays.diffPhillyJr.textContent = formatVal(diffPhillyJr, true);
    if (displays.ddJr) displays.ddJr.textContent = formatVal(ddJr, true);

    // Update Top Metric Badges
    if (displays.metricDdSoph) displays.metricDdSoph.textContent = formatVal(ddSoph, true);
    if (displays.metricDdJr) displays.metricDdJr.textContent = formatVal(ddJr, true);
    if (displays.metricDdd) displays.metricDdd.textContent = formatVal(ddd, true);
    if (displays.dddValue) displays.dddValue.textContent = formatVal(ddd, true);

    // Update formula breakdown
    if (displays.dddFormulaDisplay) {
      displays.dddFormulaDisplay.innerHTML = `
        DDD = DD<sub>Juniors</sub> − DD<sub>Sophomores</sub> = 
        <strong>(${formatVal(ddJr, true)})</strong> − <strong>(${formatVal(ddSoph, true)})</strong> = 
        <span style="color: var(--accent-primary); font-weight: 700;">${formatVal(ddd, true)}</span>
      `;
    }

    // Dynamic insight interpretation
    if (displays.insightBox) {
      if (Math.abs(ddd) < 0.001) {
        displays.insightBox.innerHTML = `
          <strong>Zero Treatment Effect (β₇ = 0):</strong> Philadelphia juniors improved by <em>${formatVal(ddJr, true)}</em> points relative to Pittsburgh juniors, but Philadelphia sophomores improved by the exact same <em>${formatVal(ddSoph, true)}</em> points. The entire junior gain is accounted for by the city-wide shock (β₅), leaving no differential tutoring effect.
        `;
      } else if (Math.abs(ddSoph) < 0.001) {
        displays.insightBox.innerHTML = `
          <strong>Zero City Shock (β₅ = 0):</strong> Philadelphia sophomores changed at the exact same rate as Pittsburgh sophomores (DD<sub>Soph</sub> = 0). Here, the standard DD on juniors (<em>${formatVal(ddJr, true)}</em>) is identical to the DDD estimate (<em>${formatVal(ddd, true)}</em>) because there was no confounding city shock.
        `;
      } else if (ddd > 0) {
        displays.insightBox.innerHTML = `
          <strong>Positive Tutoring Effect (β₇ = ${formatVal(ddd, true)}):</strong> Philadelphia juniors gained <em>${formatVal(diffPhillyJr, true)}</em> pts vs <em>${formatVal(diffPittJr, true)}</em> for Pittsburgh juniors (DD<sub>Jr</sub> = <em>${formatVal(ddJr, true)}</em>). Because Philadelphia sophomores also experienced a city-wide gain of <em>${formatVal(ddSoph, true)}</em> pts (DD<sub>Soph</sub> = β₅), subtracting this placebo DD leaves a net differential treatment effect of <strong>${formatVal(ddd, true)} points</strong>.
        `;
      } else {
        displays.insightBox.innerHTML = `
          <strong>Negative Differential Effect (β₇ = ${formatVal(ddd, true)}):</strong> Philadelphia juniors improved by <em>${formatVal(ddJr, true)}</em> points relative to Pittsburgh juniors, which is <em>smaller</em> than the city-wide gain experienced by sophomores (<em>${formatVal(ddSoph, true)}</em>). The net DDD estimate is negative.
        `;
      }
    }

    // Synchronize Try This box text
    const tryThisEl = document.getElementById('tryThisText');
    if (tryThisEl) {
      if (Math.abs(ddd) < 0.001) {
        tryThisEl.innerHTML = `Active State: <strong>No Treatment (β₇ = 0)</strong>. Juniors gained DD = <em>${formatVal(ddJr, true)}</em> and sophomores gained DD = <em>${formatVal(ddSoph, true)}</em>. Both groups experienced the same city shock, so the net DDD estimate drops to exactly <strong>0.0</strong>.`;
      } else if (Math.abs(ddSoph) < 0.001) {
        tryThisEl.innerHTML = `Active State: <strong>Zero City Shock (β₅ = 0)</strong>. Sophomores experienced zero differential change (DD = <em>0.0</em>). The junior DD (<em>${formatVal(ddJr, true)}</em>) is identical to the net DDD estimate (<strong>${formatVal(ddd, true)}</strong>).`;
      } else if (Math.abs(ddd - 8.0) < 0.001 && Math.abs(ddSoph - 5.0) < 0.001) {
        tryThisEl.innerHTML = `Active State: <strong>Baseline Case (β₇ = +8.0)</strong>. Notice that juniors gained <em>+13.0</em> in Philadelphia, but because sophomores also gained <em>+5.0</em> from the city shock, DDD isolates the true treatment gain of <strong>+8.0</strong>. Try clicking <strong>No Treatment (β₇ = 0)</strong> above.`;
      } else {
        tryThisEl.innerHTML = `Active State: <strong>Custom Values</strong>. Junior DD = <em>${formatVal(ddJr, true)}</em>, Sophomore DD = <em>${formatVal(ddSoph, true)}</em>. Subtracting the placebo difference leaves a net DDD estimate of <strong>${formatVal(ddd, true)}</strong>.`;
      }
    }
  }

  // Attach input listeners
  for (const key in inputs) {
    inputs[key].addEventListener('input', updateCalculations);
    inputs[key].addEventListener('change', updateCalculations);
  }

  // Attach preset listeners
  if (presetBaseline) {
    presetBaseline.addEventListener('click', () => applyPreset('baseline'));
  }
  if (presetNoEffect) {
    presetNoEffect.addEventListener('click', () => applyPreset('noEffect'));
  }
  if (presetNoCityShock) {
    presetNoCityShock.addEventListener('click', () => applyPreset('noCityShock'));
  }
  if (presetReset) {
    presetReset.addEventListener('click', () => applyPreset('baseline'));
  }

  // Initial calculation
  updateCalculations();
}
