const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2';

async function testEdgePdf() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9338',
    '--window-size=1200,1600',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  try {
    const res = await fetch('http://localhost:9338/json');
    const list = await res.json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = Math.floor(Math.random() * 100000);
        const handler = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === id) {
            ws.removeEventListener('message', handler);
            resolve(d.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Page.navigate', { url: 'file:///g:/Econometrics-with-AI-/Econometrics%20(7).pdf' });
    await new Promise(r => setTimeout(r, 2500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'pdf7_direct_edge.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved pdf7_direct_edge.png!');
  } finally {
    edge.kill();
  }
}
testEdgePdf().catch(console.error);
