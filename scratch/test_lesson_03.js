const { spawn } = require('child_process');
const http = require('http');

async function testPage() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9226;
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

    const errors = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params.exceptionDetails);
      }
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        errors.push(msg.params.entry);
      }
    });

    await send('Runtime.enable');
    await send('Log.enable');
    await send('Page.enable');

    console.log('Navigating to lesson-03.html...');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-06/lesson-03.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Check DOM element and click interactions
    const checkRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const svg = document.getElementById('rctPrecisionSvg');
          const toggle = document.getElementById('rctBtnToggleControls');
          const fafsa = document.getElementById('rctBtnLoadFafsa');
          const readoutSe = document.getElementById('rctReadoutSe');
          
          const initialSe = readoutSe ? readoutSe.textContent : '';
          const initialSvgLen = svg ? svg.innerHTML.length : 0;
          
          // Click toggle
          if (toggle) toggle.click();
          const toggledSe = readoutSe ? readoutSe.textContent : '';
          const toggledSvgLen = svg ? svg.innerHTML.length : 0;
          
          // Click again to untoggle
          if (toggle) toggle.click();
          const untoggledSe = readoutSe ? readoutSe.textContent : '';

          // Click FAFSA benchmark
          if (fafsa) fafsa.click();
          const fafsaSe = readoutSe ? readoutSe.textContent : '';
          const fafsaSvgLen = svg ? svg.innerHTML.length : 0;

          return {
            initialSe,
            toggledSe,
            untoggledSe,
            fafsaSe,
            initialSvgLen,
            toggledSvgLen,
            fafsaSvgLen
          };
        })()
      `,
      returnByValue: true
    });

    console.log('DOM Evaluation Result:', checkRes.result.value);
    console.log('Runtime Errors Count:', errors.length);
    if (errors.length > 0) {
      console.error('Errors found:', JSON.stringify(errors, null, 2));
      process.exit(1);
    } else {
      console.log('SUCCESS: Zero errors detected in Lesson 6.3!');
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

testPage().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
