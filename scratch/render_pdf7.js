const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9339;
const pagesDir = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2\\scratch\\pdf7_pages';

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

async function renderPages() {
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1600,1200',
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

    for (let p = 1; p <= 6; p++) {
      console.log(`Navigating to page ${p}...`);
      await send('Page.navigate', { url: `http://localhost:8126/temp_pdf_render/index_embedded.html?page=${p}` });

      let rendered = false;
      for (let attempt = 0; attempt < 30; attempt++) {
        await new Promise(r => setTimeout(r, 300));
        const evalRes = await send('Runtime.evaluate', { expression: 'Boolean(window.renderDone)' });
        if (evalRes && evalRes.result && evalRes.result.result && evalRes.result.result.value === true) {
          rendered = true;
          break;
        }
      }

      console.log(`Page ${p} render status: ${rendered ? 'DONE' : 'TIMEOUT'}`);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot && shot.result && shot.result.data) {
        const buf = Buffer.from(shot.result.data, 'base64');
        const outPath = path.join(pagesDir, `page_${String(p).padStart(2, '0')}.png`);
        fs.writeFileSync(outPath, buf);
        console.log(`Saved ${outPath} (${buf.length} bytes)`);
      }
    }

    ws.close();
  } finally {
    edgeProc.kill();
  }
}

renderPages().then(() => console.log('All 6 pages of PDF 7 rendered! ✅')).catch(console.error);
