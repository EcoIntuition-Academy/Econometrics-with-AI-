const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9449;
const outDir = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2\\scratch\\m7_polish_qa';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch(`http://localhost:${port}/json`);
    const targets = await res.json();
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const wsUrl = pageTarget.webSocketDebuggerUrl;

    console.log('Connected to CDP at:', wsUrl);
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    async function setViewport(width, height, isMobile = false) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: isMobile
      });
      await new Promise(r => setTimeout(r, 400));
    }

    async function captureElement(selector, filename) {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('${selector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        `
      });
      await new Promise(r => setTimeout(r, 600));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, filename), Buffer.from(shot.result.data, 'base64'));
      console.log('Captured:', filename);
    }

    // ==========================================
    // 1. LESSON 7.1 QA
    // ==========================================
    console.log('\n--- Auditing Lesson 7.1 ---');
    await setViewport(1440, 900);
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/lesson-01.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Capture Quick Check initial
    await captureElement('.quick-check-card', 'l71_qc_initial.png');

    // Click Hint and Solution
    await send('Runtime.evaluate', {
      expression: `
        const btns = document.querySelectorAll('.quick-check-actions button');
        if (btns[0]) btns[0].click();
        if (btns[1]) btns[1].click();
      `
    });
    await new Promise(r => setTimeout(r, 600));
    await captureElement('.quick-check-card', 'l71_qc_expanded.png');

    // Capture summary + pagination + footer
    await captureElement('.lesson-pagination', 'l71_bottom_nav_footer.png');

    // ==========================================
    // 2. LESSON 7.2 QA
    // ==========================================
    console.log('\n--- Auditing Lesson 7.2 ---');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/lesson-02.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Capture DDD Specification equation card
    await captureElement('.equation-surface--accent', 'l72_equation_spec.png');

    // Capture desktop table view
    await captureElement('.desktop-table-view', 'l72_table_desktop.png');

    // Test mobile 430px table view
    await setViewport(430, 900, true);
    await captureElement('.mobile-group-cards', 'l72_cards_mobile.png');

    // Test mobile pagination
    await captureElement('.lesson-pagination', 'l72_pagination_mobile.png');

    // ==========================================
    // 3. LESSON 7.3 QA
    // ==========================================
    console.log('\n--- Auditing Lesson 7.3 ---');
    await setViewport(1440, 900);
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/lesson-03.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Capture interactive builder
    await captureElement('#dddBuilderApp', 'l73_interactive_builder.png');

    // Capture 5-box visual explanation grid in baseline
    await captureElement('.visual-explanation-grid', 'l73_grid_baseline.png');

    // Click preset "No Treatment"
    await send('Runtime.evaluate', {
      expression: `document.getElementById('presetNoEffect').click();`
    });
    await new Promise(r => setTimeout(r, 600));
    await captureElement('.visual-explanation-grid', 'l73_grid_no_effect.png');

    // ==========================================
    // 4. LESSON 7.4 QA
    // ==========================================
    console.log('\n--- Auditing Lesson 7.4 ---');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/lesson-04.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Capture Levels vs Changes side-by-side cards
    await captureElement('section.study-section:nth-of-type(3)', 'l74_levels_changes.png');

    // Capture caution card and controls
    await captureElement('.callout-warning', 'l74_controls_caution.png');

    // ==========================================
    // 5. LESSON 7.5 QA
    // ==========================================
    console.log('\n--- Auditing Lesson 7.5 ---');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/lesson-05.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Capture formal definition and synthesis
    await captureElement('section.study-section:nth-of-type(2)', 'l75_synthesis_definition.png');

    // Capture 3 assumptions + causal + failure cards
    await captureElement('section.study-section:nth-of-type(1)', 'l75_assumptions.png');

    // Capture pagination + footer
    await captureElement('.lesson-pagination', 'l75_pagination_footer.png');

    console.log('\nALL SCREENSHOTS CAPTURED SUCCESSFULLY!');

    ws.close();
    edgeProc.kill();
    process.exit(0);

  } catch (err) {
    console.error('Error during capture:', err);
    edgeProc.kill();
    process.exit(1);
  }
}

run();
