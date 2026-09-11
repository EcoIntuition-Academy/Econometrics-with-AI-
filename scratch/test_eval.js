const { spawn } = require('child_process');

async function test() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9337',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  try {
    const res = await fetch('http://localhost:9337/json');
    const list = await res.json();
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        console.log('CONSOLE:', data.params.type, data.params.args);
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.log('EXCEPTION:', data.params.exceptionDetails);
      }
    };

    ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
    ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
    ws.send(JSON.stringify({
      id: 3,
      method: 'Page.navigate',
      params: { url: 'http://localhost:8126/temp_pdf_render/render_export7.html?page=1' }
    }));

    await new Promise(r => setTimeout(r, 3000));
    
    ws.send(JSON.stringify({
      id: 4,
      method: 'Runtime.evaluate',
      params: { expression: 'document.getElementById("status").textContent', returnByValue: true }
    }));

    await new Promise(r => {
      const oldHandler = ws.onmessage;
      ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === 4) {
          console.log('STATUS IS:', d.result.result.value);
          r();
        } else {
          oldHandler(e);
        }
      };
    });

  } finally {
    edge.kill();
  }
}
test().catch(console.error);
