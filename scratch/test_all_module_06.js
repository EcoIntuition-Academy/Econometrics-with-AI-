const { spawn } = require('child_process');
const http = require('http');

async function testAllLessons() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9227;
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

    const allErrors = {};

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        const url = currentUrl || 'unknown';
        if (!allErrors[url]) allErrors[url] = [];
        allErrors[url].push(msg.params.exceptionDetails);
      }
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        const url = currentUrl || 'unknown';
        if (!allErrors[url]) allErrors[url] = [];
        allErrors[url].push(msg.params.entry);
      }
    });

    await send('Runtime.enable');
    await send('Log.enable');
    await send('Page.enable');

    let currentUrl = '';
    const pages = [
      'modules/module-06/index.html',
      'modules/module-06/lesson-01.html',
      'modules/module-06/lesson-02.html',
      'modules/module-06/lesson-03.html',
      'modules/module-06/lesson-04.html',
      'modules/module-06/lesson-05.html',
      'modules/module-06/lesson-06.html',
      'modules/module-06/lesson-07.html',
      'modules/module-06/lesson-08.html'
    ];

    for (const p of pages) {
      currentUrl = p;
      await send('Page.navigate', { url: `http://localhost:8126/${p}` });
      await new Promise(r => setTimeout(r, 1500));
      const evalRes = await send('Runtime.evaluate', {
        expression: 'document.title',
        returnByValue: true
      });
      console.log(`[PASS] ${p} loaded: "${evalRes.result.value}"`);
    }

    const errorCount = Object.keys(allErrors).reduce((acc, k) => acc + allErrors[k].length, 0);
    console.log('\n--- MODULE 6 AUDIT RESULTS ---');
    console.log(`Total Pages Tested: ${pages.length}`);
    console.log(`Total Runtime Exceptions: ${errorCount}`);

    if (errorCount > 0) {
      console.error('Errors by page:', JSON.stringify(allErrors, null, 2));
      process.exit(1);
    } else {
      console.log('SUCCESS: All Module 6 pages loaded cleanly with ZERO runtime exceptions!');
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

testAllLessons().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
