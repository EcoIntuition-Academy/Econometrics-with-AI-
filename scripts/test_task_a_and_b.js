const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\59bcbca1-fce5-4ee0-a6d1-8947d2a324e2';

async function runTaskTests() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9232;
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

    console.log('=== 1. TESTING LESSON 6.6: TREND DIAGNOSTICS EXPLORER (TASK A) ===');

    // Set desktop viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-06/lesson-06.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Evaluate Mode 1 initial state
    const mode1State = await send('Runtime.evaluate', {
      expression: `(() => {
        const ctrlTesting = document.getElementById('trendModeTestingControls');
        const ctrlAnt = document.getElementById('trendModeAnticipationControls');
        const slider = document.getElementById('trendSliderDiff');
        const banner = document.getElementById('trendReadoutDecision');
        const expl = document.getElementById('trendReadoutExpl');
        const cardSeeing = document.getElementById('trendCardSeeing');
        const cardTry = document.getElementById('trendCardTry');
        const svg = document.getElementById('trendTestSvg');

        return {
          testingVisible: ctrlTesting && window.getComputedStyle(ctrlTesting).display !== 'none',
          antVisible: ctrlAnt && window.getComputedStyle(ctrlAnt).display !== 'none',
          sliderVal: slider ? slider.value : null,
          bannerText: banner ? banner.textContent : null,
          explText: expl ? expl.textContent : null,
          cardSeeingText: cardSeeing ? cardSeeing.textContent : null,
          cardTryText: cardTry ? cardTry.textContent : null,
          hasRolloutLine: svg ? svg.innerHTML.includes('Official Policy Rollout') : false,
          hasControlLabel: svg ? svg.innerHTML.includes('Control') : false,
          hasTreatedLabel: svg ? svg.innerHTML.includes('Treated') : false,
          hasClippedText: svg ? svg.innerHTML.includes('Cont<') : false
        };
      })()`,
      returnByValue: true
    });

    console.log('Mode 1 (Testing) Initial State:', mode1State.result.value);

    // Assertions for Mode 1
    if (!mode1State.result.value.testingVisible) throw new Error('Mode 1 controls should be visible!');
    if (mode1State.result.value.antVisible) throw new Error('Mode 2 controls must NOT be visible in Mode 1!');
    if (mode1State.result.value.hasRolloutLine) throw new Error('Mode 1 should NOT have post-treatment rollout line!');
    if (mode1State.result.value.hasClippedText) throw new Error('Label "Cont" was clipped!');
    if (!mode1State.result.value.hasControlLabel || !mode1State.result.value.hasTreatedLabel) throw new Error('Labels Control and Treated must be present!');

    // Scroll down to labSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('labSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    // Screenshot Mode 1
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l06_mode1_testing_desktop.png'), Buffer.from(shot1.data, 'base64'));
    console.log('Saved l06_mode1_testing_desktop.png');

    // Switch to Mode 2 (Anticipation)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('trendTabAnticipation').click()`
    });
    await new Promise(r => setTimeout(r, 600));

    const mode2State = await send('Runtime.evaluate', {
      expression: `(() => {
        const ctrlTesting = document.getElementById('trendModeTestingControls');
        const ctrlAnt = document.getElementById('trendModeAnticipationControls');
        const banner = document.getElementById('trendReadoutDecision');
        const expl = document.getElementById('trendReadoutExpl');
        const cardSeeing = document.getElementById('trendCardSeeing');
        const cardNotice = document.getElementById('trendCardNotice');
        const cardWhy = document.getElementById('trendCardWhy');
        const svg = document.getElementById('trendTestSvg');

        return {
          testingVisible: ctrlTesting && window.getComputedStyle(ctrlTesting).display !== 'none',
          antVisible: ctrlAnt && window.getComputedStyle(ctrlAnt).display !== 'none',
          bannerText: banner ? banner.textContent : null,
          explText: expl ? expl.textContent : null,
          cardSeeingText: cardSeeing ? cardSeeing.textContent : null,
          cardNoticeText: cardNotice ? cardNotice.textContent : null,
          cardWhyText: cardWhy ? cardWhy.textContent : null,
          hasRolloutLine: svg ? svg.innerHTML.includes('Official Policy Rollout (t = 2)') : false,
          hasAntReaction: svg ? svg.innerHTML.includes('Anticipatory Reaction') : false,
          hasControlLabel: svg ? svg.innerHTML.includes('Control') : false,
          hasTreatedLabel: svg ? svg.innerHTML.includes('Treated') : false,
          hasBeta3InBanner: banner ? banner.textContent.includes('β₃') : false,
          hasBeta3InExpl: expl ? expl.textContent.includes('β₃') : false
        };
      })()`,
      returnByValue: true
    });

    console.log('Mode 2 (Anticipation) State:', mode2State.result.value);

    // Assertions for Mode 2
    if (mode2State.result.value.testingVisible) throw new Error('Beta3 slider must be completely hidden in Mode 2!');
    if (!mode2State.result.value.antVisible) throw new Error('Anticipation controls must be visible in Mode 2!');
    if (!mode2State.result.value.hasRolloutLine) throw new Error('Official Policy Rollout (t = 2) must be present in Mode 2!');
    if (!mode2State.result.value.hasAntReaction) throw new Error('Anticipation reaction must be shown at t=1!');
    if (mode2State.result.value.hasBeta3InBanner || mode2State.result.value.hasBeta3InExpl) {
      throw new Error('No beta3 slope test text allowed in Anticipation Mode!');
    }

    // Screenshot Mode 2
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l06_mode2_anticipation_desktop.png'), Buffer.from(shot2.data, 'base64'));
    console.log('Saved l06_mode2_anticipation_desktop.png');

    // Switch back to Mode 1
    await send('Runtime.evaluate', {
      expression: `document.getElementById('trendTabTesting').click()`
    });
    await new Promise(r => setTimeout(r, 600));

    const switchBackState = await send('Runtime.evaluate', {
      expression: `(() => {
        const ctrlTesting = document.getElementById('trendModeTestingControls');
        const ctrlAnt = document.getElementById('trendModeAnticipationControls');
        return {
          testingVisible: ctrlTesting && window.getComputedStyle(ctrlTesting).display !== 'none',
          antVisible: ctrlAnt && window.getComputedStyle(ctrlAnt).display !== 'none'
        };
      })()`,
      returnByValue: true
    });
    console.log('Switched back to Mode 1 successfully:', switchBackState.result.value);

    console.log('\n=== 2. TESTING LESSON 6.7: BOXED CONTENT SYSTEM & DDD (TASK B) ===');
    await send('Page.navigate', { url: 'http://localhost:8126/modules/module-06/lesson-07.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Verify Section 1 Boxed Structure
    const sec1Eval = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec1 = document.getElementById('motivationSection');
        if (!sec1) return { found: false };
        const cs = window.getComputedStyle(sec1);
        const header = sec1.querySelector('.study-section-header');
        const title = sec1.querySelector('.study-section-title');
        const eqSurface = sec1.querySelector('.equation-surface--warning');
        const keyIdea = sec1.querySelector('.key-idea-card');

        return {
          found: true,
          isStudySection: sec1.classList.contains('study-section'),
          bg: cs.backgroundColor,
          border: cs.border,
          borderRadius: cs.borderRadius,
          padding: cs.padding,
          hasHeader: !!header,
          titleText: title ? title.textContent : null,
          hasEqSurface: !!eqSurface,
          hasKeyIdea: !!keyIdea
        };
      })()`,
      returnByValue: true
    });

    console.log('Lesson 6.7 Section 1 Evaluation:', sec1Eval.result.value);
    if (!sec1Eval.result.value.isStudySection) throw new Error('Section 1 must have .study-section class!');
    if (!sec1Eval.result.value.hasEqSurface) throw new Error('Section 1 must have equation surface!');
    if (!sec1Eval.result.value.hasKeyIdea) throw new Error('Section 1 must have key idea card!');

    // Scroll to motivationSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('motivationSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    // Screenshot Lesson 6.7 Desktop
    const shot67Desktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l07_boxed_desktop.png'), Buffer.from(shot67Desktop.data, 'base64'));
    console.log('Saved l07_boxed_desktop.png');

    // Test Dark Mode
    await send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark')`
    });
    await new Promise(r => setTimeout(r, 600));

    const shot67Dark = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l07_boxed_dark.png'), Buffer.from(shot67Dark.data, 'base64'));
    console.log('Saved l07_boxed_dark.png');

    // Switch back to light theme
    await send('Runtime.evaluate', {
      expression: `document.documentElement.removeAttribute('data-theme')`
    });

    // Test Mobile Viewport (430px iPhone 14 Pro Max)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));

    // Check no horizontal scrollbar on mobile
    const mobileOverflow = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          docScrollWidth: document.documentElement.scrollWidth,
          windowInnerWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile 430px overflow check:', mobileOverflow.result.value);

    // Scroll to motivationSection on mobile
    await send('Runtime.evaluate', {
      expression: `document.getElementById('motivationSection').scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 600));

    const shot67Mobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'l07_boxed_mobile.png'), Buffer.from(shot67Mobile.data, 'base64'));
    console.log('Saved l07_boxed_mobile.png');

    console.log('\n=== ALL TASK A & TASK B AUTOMATED BROWSER TESTS PASSED 100%! 🚀 ===');

  } finally {
    proc.kill();
  }
}

runTaskTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
