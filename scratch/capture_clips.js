const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9450;
const outDir = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2\\scratch\\m7_polish_qa';

async function run() {
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1200',
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

    async function captureBox(url, selector, filename, width = 1440, height = 1200, isMobile = false) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: isMobile });
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 2000));

      const boxRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.querySelector('${selector}');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
          })()
        `,
        returnByValue: true
      });

      const box = boxRes.result.value;
      if (box && box.width > 0 && box.height > 0) {
        // Ensure within reasonable bounds
        const shot = await send('Page.captureScreenshot', {
          format: 'png',
          clip: {
            x: Math.max(0, box.x - 10),
            y: Math.max(0, box.y - 10),
            width: Math.min(width, box.width + 20),
            height: box.height + 20,
            scale: 1
          },
          captureBeyondViewport: true
        });
        fs.writeFileSync(path.join(outDir, filename), Buffer.from(shot.result.data, 'base64'));
        console.log('Saved clipped:', filename);
      } else {
        console.log('Could not clip:', selector);
      }
    }

    // 1. L7.1 Footer & Pagination
    await captureBox('http://localhost:8126/modules/module-07/lesson-01.html', '.lesson-pagination', 'clip_l71_pagination.png');
    await captureBox('http://localhost:8126/modules/module-07/lesson-01.html', '.site-footer', 'clip_l71_footer.png');

    // 2. L7.2 Tables desktop & mobile
    await captureBox('http://localhost:8126/modules/module-07/lesson-02.html', 'section.study-section:nth-of-type(3)', 'clip_l72_tables_desktop.png');
    await captureBox('http://localhost:8126/modules/module-07/lesson-02.html', 'section.study-section:nth-of-type(3)', 'clip_l72_tables_mobile.png', 430, 1200, true);

    // 3. L7.3 Visual explanation grid
    await captureBox('http://localhost:8126/modules/module-07/lesson-03.html', '.visual-explanation-grid', 'clip_l73_grid.png');

    // 4. L7.4 Levels vs changes
    await captureBox('http://localhost:8126/modules/module-07/lesson-04.html', 'section.study-section:nth-of-type(3)', 'clip_l74_levels_changes.png');

    // 5. L7.5 Assumptions & Formal definition
    await captureBox('http://localhost:8126/modules/module-07/lesson-05.html', 'section.study-section:nth-of-type(1)', 'clip_l75_assumptions.png');
    await captureBox('http://localhost:8126/modules/module-07/lesson-05.html', 'section.study-section:nth-of-type(2)', 'clip_l75_synthesis.png');

    console.log('All clipped captures complete!');
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
