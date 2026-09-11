const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9448;
const outDir = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2\\scratch\\m7_screenshots';

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

    // Test 1: Desktop 1440px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-07/lesson-01.html' });
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to the problem section
    await send('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('.equation-surface--warning');
        if (el) el.scrollIntoView({ block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // Measure scrollWidth vs clientWidth of the equation surface and container
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const surf = document.querySelector('.equation-surface--warning');
          const math = surf ? surf.querySelector('.equation-surface-math') : null;
          const mjx = surf ? surf.querySelector('mjx-container') : null;
          return {
            surfClientWidth: surf ? surf.clientWidth : 0,
            surfScrollWidth: surf ? surf.scrollWidth : 0,
            mathClientWidth: math ? math.clientWidth : 0,
            mathScrollWidth: math ? math.scrollWidth : 0,
            mjxClientWidth: mjx ? mjx.clientWidth : 0,
            mjxScrollWidth: mjx ? mjx.scrollWidth : 0,
            bodyScrollWidth: document.body.scrollWidth,
            windowInnerWidth: window.innerWidth
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Desktop 1440px measurements:', JSON.stringify(evalRes.result.value, null, 2));

    const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'l71_reform_desktop.png'), Buffer.from(shotDesktop.result.data, 'base64'));
    console.log('Saved l71_reform_desktop.png');

    // Test 2: Mobile 430px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 900,
      deviceScaleFactor: 1,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 500));

    const evalMobile = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('.equation-surface--warning');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
            const rect = el.getBoundingClientRect();
            return { top: rect.top, height: rect.height, pageY: window.pageYOffset };
          }
          return null;
        })()
      `,
      returnByValue: true
    });
    console.log('Mobile 430 scroll info:', evalMobile.result.result.value);
    await new Promise(r => setTimeout(r, 1000));

    const shotMobile430 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'l71_reform_430.png'), Buffer.from(shotMobile430.result.data, 'base64'));
    console.log('Saved l71_reform_430.png');

    // Test 3: Mobile 390px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 500));

    await send('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('.equation-surface--warning');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const shotMobile390 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'l71_reform_390.png'), Buffer.from(shotMobile390.result.data, 'base64'));
    console.log('Saved l71_reform_390.png');

    ws.close();
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    edgeProc.kill();
  }
}

run();
