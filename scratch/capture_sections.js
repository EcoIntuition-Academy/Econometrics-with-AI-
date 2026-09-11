const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9451;
const outDir = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2\\scratch\\m7_polish_qa';

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
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };
    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    async function captureView(url, selector, filename, width = 1440, height = 900, isMobile = false) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: isMobile });
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 2200));

      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('${selector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        `
      });
      await new Promise(r => setTimeout(r, 600));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, filename), Buffer.from(shot.result.data, 'base64'));
      console.log('Saved:', filename);
    }

    // 1. L7.1 Footer & Pagination
    await captureView('http://localhost:8126/modules/module-07/lesson-01.html', '.lesson-pagination', 'view_l71_pagination_footer.png');

    // 2. L7.2 Tables desktop & mobile
    await captureView('http://localhost:8126/modules/module-07/lesson-02.html', 'section.study-section:nth-of-type(3)', 'view_l72_tables_desktop.png');
    await captureView('http://localhost:8126/modules/module-07/lesson-02.html', 'section.study-section:nth-of-type(3)', 'view_l72_tables_mobile.png', 430, 900, true);

    // 3. L7.3 Visual explanation grid
    await captureView('http://localhost:8126/modules/module-07/lesson-03.html', '.visual-explanation-grid', 'view_l73_grid.png');

    // 4. L7.4 Levels vs changes
    await captureView('http://localhost:8126/modules/module-07/lesson-04.html', 'section.study-section:nth-of-type(3)', 'view_l74_levels_changes.png');

    // 5. L7.5 Assumptions & Formal definition
    await captureView('http://localhost:8126/modules/module-07/lesson-05.html', 'section.study-section:nth-of-type(1)', 'view_l75_assumptions.png');
    await captureView('http://localhost:8126/modules/module-07/lesson-05.html', 'section.study-section:nth-of-type(2)', 'view_l75_synthesis.png');

    console.log('All views captured successfully!');
    ws.close();
    edgeProc.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    edgeProc.kill();
    process.exit(1);
  }
}

run();
