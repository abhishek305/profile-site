/**
 * End-to-end smoke check. Zero dependencies: node 22's built-in WebSocket
 * driving the system Chrome over the DevTools Protocol.
 *
 *   npm run dev            # in one terminal
 *   npm run smoke          # in another
 *
 * Covers the logic that isn't obvious from reading it: the #hash <-> tab sync
 * (which had a stale-state race), command-palette filtering, terminal history
 * and tab completion, and that the mobile layout doesn't overflow.
 */
import { spawn } from 'node:child_process';

const URL_BASE = process.env.SMOKE_URL ?? 'http://localhost:5173';
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9334;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--user-data-dir=/tmp/portfolio-smoke-profile',
  ],
  { stdio: 'ignore' }
);

let ws;
const cleanup = () => {
  ws?.close();
  chrome.kill();
};

/** Open a CDP session, run `expression` against `url`, return its value. */
async function evaluate(url, expression, viewport = { width: 1440, height: 900 }) {
  let targets;
  for (let i = 0; i < 40; i++) {
    await sleep(250);
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      if (targets.some((t) => t.type === 'page')) break;
    } catch {
      /* chrome still booting */
    }
  }
  const target = targets?.find((t) => t.type === 'page');
  if (!target) throw new Error('Chrome never exposed a page target');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 0;
  const pending = new Map();
  const problems = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      problems.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const n = ++id;
      pending.set(n, res);
      ws.send(JSON.stringify({ id: n, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  // Emulate, don't resize: Chrome enforces a minimum real window width on macOS,
  // so --window-size silently yields a wider viewport than requested.
  await send('Emulation.setDeviceMetricsOverride', {
    ...viewport,
    deviceScaleFactor: 1,
    mobile: viewport.width < 768,
  });
  await send('Page.navigate', { url });
  await sleep(2500);

  const res = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.result?.exceptionDetails) throw new Error(res.result.exceptionDetails.text);
  ws.close();
  return { value: res.result?.result?.value, problems };
}

const failures = [];
const check = (name, ok, detail) => {
  if (ok) return console.log(`  ok   ${name}`);
  failures.push(name);
  console.log(`  FAIL ${name}${detail === undefined ? '' : ` — got ${JSON.stringify(detail)}`}`);
};

const DRIVE = `(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const setValue = (el, v) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const out = {};

  // Deep link honoured on load (regression guard: an effect-based route lost this).
  out.deepLinkTab = document.querySelector('.tab.active')?.textContent;

  // Command palette: opens, fuzzy-filters, runs, closes.
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', ctrlKey: true, bubbles: true }));
  await sleep(150);
  out.paletteOpens = !!document.querySelector('.palette');
  const pin = document.querySelector('.palette-input');
  setValue(pin, 'gh');
  await sleep(150);
  out.paletteTopHit = document.querySelector('.palette-item-label')?.textContent;
  pin.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await sleep(250);
  out.paletteRan = location.hash;
  out.paletteClosed = !document.querySelector('.palette');

  // Terminal: Ctrl+\` opens it; history and tab completion behave.
  window.dispatchEvent(new KeyboardEvent('keydown', { key: '\`', ctrlKey: true, bubbles: true }));
  await sleep(300);
  out.terminalOpens = document.querySelector('#bottom-panel')?.classList.contains('open');
  const tin = document.querySelector('.terminal-input');
  const key = async (k) => { tin.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true })); await sleep(180); };

  setValue(tin, 'projects'); await key('Enter');
  out.terminalNav = location.hash;

  setValue(tin, 'theme monokai'); await key('Enter');
  out.terminalTheme = document.body.getAttribute('data-theme');

  setValue(tin, ''); await key('ArrowUp');
  out.historyNewestFirst = tin.value;

  setValue(tin, 'exp'); await key('Tab');
  out.tabCompletes = tin.value;

  // Terminal lines render via dangerouslySetInnerHTML. Typed input must never
  // reach that sink unescaped — this payload used to execute.
  window.__pwned = false;
  setValue(tin, '<img src=x onerror="window.__pwned=true">'); await key('Enter');
  await sleep(400);
  out.xssExecuted = window.__pwned;
  out.xssInjectedNodes = document.querySelectorAll('.terminal-line img, .terminal-line script').length;

  // ...while author-written markup must still render.
  setValue(tin, 'contact'); await key('Enter');
  await sleep(500);
  out.contactLinks = document.querySelectorAll('.terminal-line a').length;

  return out;
})()`;

const GITHUB = `(() => {
  const num = (el) => Number((el?.textContent ?? '').replace(/[^0-9]/g, ''));
  return {
    tiles: [...document.querySelectorAll('.gh-tile-value')].map(num),
    langSegs: document.querySelectorAll('.gh-lang-seg').length,
    repos: document.querySelectorAll('.gh-repo').length,
    // The page used to lean on third-party image services that are now dead.
    // Any <img> here means someone reintroduced one; also catches genuine breaks.
    brokenImages: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
    imgCount: document.images.length,
    errorShown: !!document.querySelector('.gh-fallback'),
  };
})()`;

const MOBILE = `(() => {
  const vw = document.documentElement.clientWidth;
  // An element only really leaks if it sticks out past the viewport AND no
  // ancestor clips it. Sticking out inside a deliberate scroller is fine.
  const unclipped = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (getComputedStyle(p).overflowX !== 'visible') return false;
    }
    return true;
  };
  const leaks = [...document.querySelectorAll('*')]
    .filter((el) => el.getBoundingClientRect().right > vw + 1 && unclipped(el))
    .map((el) => el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className.trim().split(/\\s+/)[0] : ''));
  return { vw, bodyScrollW: document.body.scrollWidth, leaks };
})()`;

try {
  console.log(`\nsmoke: ${URL_BASE}\n\ndesktop`);
  const desktop = await evaluate(`${URL_BASE}/#projects`, DRIVE);
  const d = desktop.value;
  check('deep link #projects opens that tab', d.deepLinkTab?.includes('projects.json'), d.deepLinkTab);
  check('Ctrl+P opens the command palette', d.paletteOpens);
  check('palette fuzzy "gh" ranks GitHub Stats first', d.paletteTopHit?.includes('GitHub Stats'), d.paletteTopHit);
  check('palette Enter navigates', d.paletteRan === '#github', d.paletteRan);
  check('palette closes after running', d.paletteClosed);
  check('Ctrl+` opens the terminal', d.terminalOpens);
  check('terminal nav command routes', d.terminalNav === '#projects', d.terminalNav);
  check('terminal `theme monokai` applies', d.terminalTheme === 'monokai', d.terminalTheme);
  check('ArrowUp recalls newest command', d.historyNewestFirst === 'theme monokai', d.historyNewestFirst);
  check('Tab completes a unique prefix', d.tabCompletes === 'experience', d.tabCompletes);
  check('typed HTML does NOT execute (XSS)', d.xssExecuted === false, d.xssExecuted);
  check('typed HTML injects no nodes', d.xssInjectedNodes === 0, d.xssInjectedNodes);
  check('author markup still renders', d.contactLinks === 3, d.contactLinks);
  check('no uncaught page exceptions', desktop.problems.length === 0, desktop.problems);

  console.log('\ngithub stats (live API)');
  const gh = await evaluate(`${URL_BASE}/#github`, GITHUB);
  const g = gh.value;
  if (g.errorShown) {
    console.log('  skip  GitHub API unreachable or rate-limited — fallback shown, which is correct behaviour');
  } else {
    check('four stat tiles render', g.tiles.length === 4, g.tiles);
    check('stat tiles hold real numbers', g.tiles.every((n) => n > 0), g.tiles);
    check('language bar has segments', g.langSegs > 0, g.langSegs);
    check('top repos render', g.repos > 0, g.repos);
    check('no images (dead third-party services stay gone)', g.imgCount === 0, g.imgCount);
    check('no broken images', g.brokenImages === 0, g.brokenImages);
  }

  console.log('\nmobile (390px)');
  const mobile = await evaluate(`${URL_BASE}/#experience`, MOBILE, { width: 390, height: 780 });
  const m = mobile.value;
  check('viewport really is 390px', m.vw === 390, m.vw);
  check('no horizontal page overflow', m.bodyScrollW <= m.vw, m);
  check('no unclipped content past the viewport', m.leaks.length === 0, m.leaks);
} catch (err) {
  failures.push(String(err.message ?? err));
  console.error(`\nsmoke aborted: ${err.message ?? err}`);
} finally {
  cleanup();
}

console.log(failures.length ? `\n${failures.length} check(s) failed\n` : '\nall checks passed\n');
process.exit(failures.length ? 1 : 0);
