const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'scratch', 'format_lock_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function runVisualAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9228;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  await new Promise(r => setTimeout(r, 1200));

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

    await new Promise(r => ws.onopen = r);

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

    const modules = [
      { id: 'module-01', name: 'm1_hub' },
      { id: 'module-02', name: 'm2_hub' },
      { id: 'module-03', name: 'm3_hub' },
      { id: 'module-04', name: 'm4_hub' },
      { id: 'module-05', name: 'm5_hub' },
      { id: 'module-06', name: 'm6_hub' }
    ];

    console.log('--- CAPTURING DESKTOP & MOBILE HUBS (MODULES 1–6) ---');

    for (const m of modules) {
      const url = `http://localhost:8126/modules/${m.id}/index.html`;

      // 1. Desktop (1440x900)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
      });
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 1200));

      const deskShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${m.name}_desktop.png`), Buffer.from(deskShot.data, 'base64'));

      // Check overflow
      const deskOverflow = await send('Runtime.evaluate', {
        expression: 'document.documentElement.scrollWidth > window.innerWidth',
        returnByValue: true
      });
      console.log(`[${m.id}] Desktop 1440px saved. Horizontal overflow: ${deskOverflow.result.value}`);

      // 2. Mobile (390x844)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true
      });
      await new Promise(r => setTimeout(r, 800));

      const mobShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${m.name}_mobile.png`), Buffer.from(mobShot.data, 'base64'));

      const mobOverflow = await send('Runtime.evaluate', {
        expression: 'document.documentElement.scrollWidth > window.innerWidth',
        returnByValue: true
      });
      console.log(`[${m.id}] Mobile 390px saved. Horizontal overflow: ${mobOverflow.result.value}`);
    }

    // 3. Test Responsive Viewports Matrix on Module 6
    console.log('\n--- TESTING RESPONSIVE VIEWPORTS MATRIX (MODULE 6) ---');
    const viewports = [1920, 1440, 1366, 1024, 768, 430, 390];
    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp,
        height: 800,
        deviceScaleFactor: 1,
        mobile: vp < 768
      });
      await new Promise(r => setTimeout(r, 400));
      const res = await send('Runtime.evaluate', {
        expression: `({
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth
        })`,
        returnByValue: true
      });
      console.log(`Viewport ${vp}px: scrollWidth=${res.result.value.scrollW}, innerWidth=${res.result.value.innerW}, overflow=${res.result.value.overflow}`);
    }

    // 4. Test Navbar Dropdown click/toggle interaction
    console.log('\n--- TESTING NAVBAR DROPDOWN TOGGLE ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-06/index.html' });
    await new Promise(r => setTimeout(r, 1000));

    const ddRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('.nav-dropdown-toggle');
          const dropdown = document.querySelector('.nav-dropdown');
          const menu = document.querySelector('.nav-dropdown-menu');
          
          const initialOpen = dropdown ? dropdown.classList.contains('is-open') : false;
          if (btn) btn.click();
          const afterClickOpen = dropdown ? dropdown.classList.contains('is-open') : false;
          
          // Click outside
          document.body.click();
          const afterOutsideOpen = dropdown ? dropdown.classList.contains('is-open') : false;

          return { initialOpen, afterClickOpen, afterOutsideOpen, hasMenu: !!menu };
        })()
      `,
      returnByValue: true
    });
    console.log('Dropdown interactive test result:', ddRes.result.value);

    console.log('\nSUCCESS: All visual audit and responsiveness checks completed cleanly!');
    ws.close();
  } finally {
    proc.kill();
  }
}

runVisualAudit().catch(err => {
  console.error('Fatal visual audit error:', err);
  process.exit(1);
});
