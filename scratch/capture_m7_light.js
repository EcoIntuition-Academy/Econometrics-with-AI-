const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9448;
const outDir = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2\\scratch\\m7_screenshots';

async function capture() {
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1100',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch(`http://localhost:${port}/json`);
    const targets = await res.json();
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const wsUrl = pageTarget.webSocketDebuggerUrl;

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

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false
    });

    // 1. Hub Light Mode
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/index.html' });
    await new Promise(r => setTimeout(r, 1200));
    await send('Runtime.evaluate', {
      expression: 'document.documentElement.setAttribute("data-theme", "light")'
    });
    await new Promise(r => setTimeout(r, 300));
    const shotHubLight = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'm7_hub_light.png'), Buffer.from(shotHubLight.result.data, 'base64'));

    // 2. Lesson 7.3 Lab Light Mode
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/lesson-03.html#labSection' });
    await new Promise(r => setTimeout(r, 1200));
    await send('Runtime.evaluate', {
      expression: 'document.documentElement.setAttribute("data-theme", "light"); document.getElementById("labSection").scrollIntoView()'
    });
    await new Promise(r => setTimeout(r, 400));
    const shotLabLight = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'm7_l03_lab_light.png'), Buffer.from(shotLabLight.result.data, 'base64'));

    console.log('Light mode screenshots captured!');
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edgeProc.kill();
  }
}

capture();
