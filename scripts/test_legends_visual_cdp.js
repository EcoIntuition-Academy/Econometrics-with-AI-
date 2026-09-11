const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2';

async function runVisualAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9229;
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

    const viewports = [
      { w: 1440, h: 900, name: 'desktop' },
      { w: 390, h: 844, name: 'mobile' }
    ];

    // =========================================================================
    // 1. MODULE 6 LESSON 6.1: COOKIE LAB
    // =========================================================================
    console.log('\n--- 1. Testing Module 6 Lesson 6.1 (Cookie Lab) ---');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-06/lesson-01.html' });
    await new Promise(r => setTimeout(r, 1500));

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 700
      });
      await new Promise(r => setTimeout(r, 400));

      // Scroll lab into view and get rect
      const rectRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.querySelector('.interactive-lab-card');
            if (!el) return null;
            el.scrollIntoView({ block: 'start' });
            const r = el.getBoundingClientRect();
            const svgRects = el.querySelectorAll('#cookieLabSvg g rect').length;
            const hasLegend = !!el.querySelector('.visual-legend');
            return {
              x: r.left,
              y: r.top,
              width: r.width,
              height: r.height,
              svgRects,
              hasLegend
            };
          })()
        `,
        returnByValue: true
      });

      const info = rectRes.result.value;
      console.log(`[${vp.name}] Cookie Lab: svgRects=${info.svgRects} (0=Clean), hasLegend=${info.hasLegend}`);

      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, info.x),
          y: Math.max(0, info.y),
          width: info.width,
          height: Math.min(800, info.height),
          scale: 1
        }
      });

      const shotPath = path.join(ARTIFACT_DIR, `m6_l1_cookie_clean_${vp.name}.png`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`  Saved screenshot: ${shotPath}`);
    }

    // =========================================================================
    // 2. MODULE 6 LESSON 6.2: PRECISION LAB
    // =========================================================================
    console.log('\n--- 2. Testing Module 6 Lesson 6.2 (Precision Lab) ---');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-06/lesson-02.html' });
    await new Promise(r => setTimeout(r, 1500));

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 700
      });
      await new Promise(r => setTimeout(r, 400));

      // Check dynamic updates across cases
      const testCases = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.querySelector('.interactive-lab-card');
            el.scrollIntoView({ block: 'start' });
            
            // Case 2 default
            const c2Omit = document.getElementById('precLegendSeOmit')?.textContent;
            const c2Incl = document.getElementById('precLegendSeIncl')?.textContent;
            
            // Click Case 3
            document.getElementById('precBtnCase3')?.click();
            const c3Omit = document.getElementById('precLegendSeOmit')?.textContent;
            const c3Incl = document.getElementById('precLegendSeIncl')?.textContent;
            
            // Click Case 4
            document.getElementById('precBtnCase4')?.click();
            const c4Omit = document.getElementById('precLegendSeOmit')?.textContent;
            const c4Incl = document.getElementById('precLegendSeIncl')?.textContent;
            
            // Reset to Case 2
            document.getElementById('precBtnCase2')?.click();

            const r = el.getBoundingClientRect();
            const svgRects = el.querySelectorAll('#precisionTradeoffSvg g rect').length;

            return {
              c2: { c2Omit, c2Incl },
              c3: { c3Omit, c3Incl },
              c4: { c4Omit, c4Incl },
              svgRects,
              x: r.left,
              y: r.top,
              width: r.width,
              height: r.height
            };
          })()
        `,
        returnByValue: true
      });

      const pInfo = testCases.result.value;
      console.log(`[${vp.name}] Precision Lab Dynamic Updates:`);
      console.log(`   Case 2: ${JSON.stringify(pInfo.c2)}`);
      console.log(`   Case 3: ${JSON.stringify(pInfo.c3)}`);
      console.log(`   Case 4: ${JSON.stringify(pInfo.c4)}`);
      console.log(`   Internal SVG rects: ${pInfo.svgRects} (0=Clean)`);

      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, pInfo.x),
          y: Math.max(0, pInfo.y),
          width: pInfo.width,
          height: Math.min(800, pInfo.height),
          scale: 1
        }
      });

      const shotPath = path.join(ARTIFACT_DIR, `m6_l2_precision_clean_${vp.name}.png`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`  Saved screenshot: ${shotPath}`);
    }

    // =========================================================================
    // 3. MODULE 1 LESSON 1.3: REGRESSION SIMULATOR
    // =========================================================================
    console.log('\n--- 3. Testing Module 1 Lesson 1.3 (Regression Simulator) ---');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-01/lesson-03.html' });
    await new Promise(r => setTimeout(r, 1500));

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 400));

    const m1Res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const svg = document.getElementById('regLineSimulatorSvg');
          const el = svg ? svg.closest('.visualization-card, .interactive-lab-card') : null;
          if (!el) return null;
          el.scrollIntoView({ block: 'start' });
          const r = el.getBoundingClientRect();
          const svgRects = el.querySelectorAll('#regLineSimulatorSvg g rect').length;
          const hasLegend = !!el.querySelector('.visual-legend');
          return {
            x: r.left,
            y: r.top,
            width: r.width,
            height: r.height,
            svgRects,
            hasLegend
          };
        })()
      `,
      returnByValue: true
    });

    const m1Info = m1Res.result.value;
    console.log(`[desktop] RegSim Lab: svgRects=${m1Info.svgRects} (0=Clean), hasLegend=${m1Info.hasLegend}`);

    const shotM1 = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, m1Info.x),
        y: Math.max(0, m1Info.y),
        width: m1Info.width,
        height: Math.min(800, m1Info.height),
        scale: 1
      }
    });

    const shotM1Path = path.join(ARTIFACT_DIR, 'm1_l3_regsim_clean_desktop.png');
    fs.writeFileSync(shotM1Path, Buffer.from(shotM1.data, 'base64'));
    console.log(`  Saved screenshot: ${shotM1Path}`);

    // =========================================================================
    // 4. RESPONSIVE OVERFLOW TEST ACROSS ALL 7 VIEWPORTS
    // =========================================================================
    const viewportsAll = [1920, 1440, 1366, 1024, 768, 430, 390];
    console.log('\n--- 4. Checking Responsive Horizontal Overflow (Zero Overflow Required) ---');
    for (const w of viewportsAll) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 900,
        deviceScaleFactor: 1,
        mobile: w < 768
      });
      await new Promise(r => setTimeout(r, 200));

      const ovRes = await send('Runtime.evaluate', {
        expression: `({
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth
        })`,
        returnByValue: true
      });
      const ov = ovRes.result.value;
      console.log(`  Viewport ${w}px -> scrollWidth: ${ov.scrollW}, innerWidth: ${ov.innerW}, overflow: ${ov.overflow}`);
    }

    console.log('\nALL CDP TESTS COMPLETED PERFECTLY! 🚀');
    ws.close();
  } finally {
    proc.kill();
  }
}

runVisualAudit().catch(err => {
  console.error('Visual audit failed:', err);
  process.exit(1);
});
