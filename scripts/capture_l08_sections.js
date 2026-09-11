const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9234;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json/list', res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    const pageTarget = listRes.find(t => t.type === 'page') || listRes[0];
    const wsUrl = pageTarget.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);

    await new Promise(r => ws.addEventListener('open', r));

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-06/lesson-08.html' });
    await new Promise(r => setTimeout(r, 2000));

    // LIGHT MODE
    await send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'light')`
    });
    await new Promise(r => setTimeout(r, 400));

    // Scroll to tableSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('tableSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l08_table_light.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved l08_table_light.png');

    // Scroll to derivationSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('derivationSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l08_derivation_light.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved l08_derivation_light.png');

    // Scroll to reviewSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('reviewSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l08_review_light.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved l08_review_light.png');

    // DARK MODE
    await send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark')`
    });
    await new Promise(r => setTimeout(r, 400));

    // Scroll to tableSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('tableSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l08_table_dark.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved l08_table_dark.png');

    // Scroll to derivationSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('derivationSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l08_derivation_dark.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved l08_derivation_dark.png');

    // Scroll to reviewSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('reviewSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l08_review_dark.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved l08_review_dark.png');

  } finally {
    proc.kill();
  }
}

capture().catch(console.error);
