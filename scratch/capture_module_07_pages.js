const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9445;
const outDir = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2\\scratch\\m7_screenshots';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
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

    const testPages = [
      { name: 'm7_hub', path: 'modules/module-07/index.html' },
      { name: 'm7_l01', path: 'modules/module-07/lesson-01.html' },
      { name: 'm7_l02', path: 'modules/module-07/lesson-02.html' },
      { name: 'm7_l03', path: 'modules/module-07/lesson-03.html' },
      { name: 'm7_l04', path: 'modules/module-07/lesson-04.html' },
      { name: 'm7_l05', path: 'modules/module-07/lesson-05.html' },
      { name: 'home_curriculum', path: 'index.html' }
    ];

    for (const page of testPages) {
      console.log(`\nTesting ${page.name} (${page.path})...`);

      // 1. Desktop Viewport (1440x900)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
      });

      await send('Page.navigate', { url: `http://localhost:8126/${page.path}` });
      await new Promise(r => setTimeout(r, 1400));

      const overflowEval = await send('Runtime.evaluate', {
        expression: '({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, hasOverflow: document.documentElement.scrollWidth > window.innerWidth })',
        returnByValue: true
      });
      console.log('  Desktop overflow check:', overflowEval.result?.value);

      const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${page.name}_desktop.png`), Buffer.from(shotDesktop.result.data, 'base64'));

      // 2. Mobile Viewport (430x932 - iPhone 14 Pro Max)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 430,
        height: 932,
        deviceScaleFactor: 2,
        mobile: true
      });

      await new Promise(r => setTimeout(r, 600));

      const mobileOverflowEval = await send('Runtime.evaluate', {
        expression: '({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, hasOverflow: document.documentElement.scrollWidth > window.innerWidth })',
        returnByValue: true
      });
      console.log('  Mobile overflow check:', mobileOverflowEval.result?.value);

      const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${page.name}_mobile.png`), Buffer.from(shotMobile.result.data, 'base64'));
    }

    console.log('\nAll captures completed successfully!');
    ws.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    edgeProc.kill();
  }
}

capture();
