/**
 * End-to-end smoke check for the V3 portfolio.
 * Zero dependencies: Node 22's built-in WebSocket driving system Chrome over CDP.
 *
 *   npm run dev            # in one terminal
 *   npm run smoke          # in another
 */
import { spawn } from "node:child_process";

const URL_BASE = process.env.SMOKE_URL ?? "http://localhost:5173";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu",
  "--user-data-dir=/tmp/portfolio-smoke-profile",
], { stdio: "ignore" });

let ws;
const cleanup = () => {
  ws?.close();
  chrome.kill();
};

async function evaluate(url, expression, viewport = { width: 1440, height: 900 }) {
  let targets;
  for (let i = 0; i < 40; i += 1) {
    await sleep(250);
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      if (targets.some((target) => target.type === "page")) break;
    } catch {
      // Chrome is still booting.
    }
  }
  const target = targets?.find((item) => item.type === "page");
  if (!target) throw new Error("Chrome never exposed a page target");

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 0;
  const pending = new Map();
  const problems = [];
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
    if (message.method === "Runtime.exceptionThrown") {
      problems.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    }
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const messageId = ++id;
    pending.set(messageId, resolve);
    ws.send(JSON.stringify({ id: messageId, method, params }));
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    ...viewport,
    deviceScaleFactor: 1,
    mobile: viewport.width < 768,
  });
  await send("Page.navigate", { url });
  await sleep(2500);

  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.result?.exceptionDetails) throw new Error(result.result.exceptionDetails.text);
  ws.close();
  return { value: result.result?.result?.value, problems };
}

const failures = [];
const check = (name, ok, detail) => {
  if (ok) return console.log(`  ok   ${name}`);
  failures.push(name);
  console.log(`  FAIL ${name}${detail === undefined ? "" : ` — got ${JSON.stringify(detail)}`}`);
};

const V3_DRIVE = `(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const setValue = (element, value) => {
    Object.getOwnPropertyDescriptor(element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, "value").set.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const out = {};
  const approach = async (id) => {
    document.getElementById(id)?.scrollIntoView();
    await sleep(900);
  };
  out.url = location.pathname;
  out.title = document.title;
  out.hero = document.querySelector("h1")?.textContent?.trim();
  out.sections = [...document.querySelectorAll("main section")].map((section) => section.id);
  out.stageCount = document.querySelectorAll(".stage").length;
  out.progressBefore = document.querySelector("#progress")?.style.transform;

  const theme = document.querySelector(".themebtn");
  theme?.click();
  await sleep(50);
  out.themeAfterToggle = document.documentElement.dataset.theme;
  out.themeStored = localStorage.getItem("portfolio-v3-theme");

  await approach("mcp");
  const run = [...document.querySelectorAll("button")].find((button) => button.textContent?.trim() === "Run the call");
  run?.click();
  await sleep(4300);
  out.mcpMessage = document.querySelector(".msg")?.textContent?.trim();
  out.mcpStates = [...document.querySelectorAll(".flow li")].map((item) => item.querySelector("em")?.textContent?.trim());

  const excluded = document.querySelector('input[name="mcp-profile"][value="out"]');
  excluded?.click();
  await sleep(4300);
  out.excludedMessage = document.querySelector(".msg")?.textContent?.trim();

  await approach("architect-agent");
  const spec = document.querySelector("#spec");
  if (spec) setValue(spec, "Users must log in. Users should reset passwords.");
  await sleep(80);
  out.backlogSummary = document.querySelector(".summary")?.textContent?.trim();
  out.ticketCount = document.querySelectorAll(".tickets li").length;

  await approach("crowdly");
  const days = document.querySelector("#segment-days");
  if (days) setValue(days, "7");
  await sleep(80);
  out.segmentCount = document.querySelector(".count")?.textContent?.trim();

  await approach("latex");
  const tex = document.querySelector("#tex-source");
  if (tex) setValue(tex, "\\\\textbf{Bold");
  await sleep(80);
  out.texStatus = document.querySelector(".status")?.textContent?.trim();

  out.progressAfter = document.querySelector("#progress")?.style.transform;
  out.errors = [...document.querySelectorAll("[aria-invalid='true']")].length;
  return out;
})()`;

const LEGACY_DRIVE = `(() => ({
  url: location.pathname,
  hasActivityBar: !!document.querySelector(".activity-bar"),
  hasTerminal: !!document.querySelector("#bottom-panel"),
  hasEditor: !!document.querySelector(".editor-window")
}))()`;

const MOBILE = `(() => {
  const viewport = document.documentElement.clientWidth;
  const unclipped = (element) => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (getComputedStyle(parent).overflowX !== "visible") return false;
    }
    return true;
  };
  const leaks = [...document.querySelectorAll("*")]
    .filter((element) => element.getBoundingClientRect().right > viewport + 1 && unclipped(element))
    .map((element) => element.tagName.toLowerCase() + "." + (typeof element.className === "string" ? element.className.trim().split(/\\s+/)[0] : ""));
  return { viewport, bodyScrollWidth: document.body.scrollWidth, leaks };
})()`;

try {
  console.log(`\nsmoke: ${URL_BASE}\n\nV3 desktop`);
  const v3 = await evaluate(URL_BASE, V3_DRIVE);
  const v = v3.value;
  check("home renders the V3 shell", v?.hero?.includes("platforms"), v?.hero);
  check("home has all ten sections", v?.sections?.length === 10, v?.sections);
  check("four playable stages render", v?.stageCount === 4, v?.stageCount);
  check("theme toggle persists", ["light", "dark"].includes(v?.themeAfterToggle) && ["light", "dark"].includes(v?.themeStored), v);
  check("MCP simulation completes", v?.mcpMessage?.includes("201 Created"), v?.mcpMessage);
  check("flow state is written as words", v?.mcpStates?.length === 7 && v.mcpStates.every((state) => state === "Done"), v?.mcpStates);
  check("excluded profile returns Tool not found", v?.excludedMessage === "Tool not found", v?.excludedMessage);
  check("spec produces backlog tickets", v?.ticketCount === 2, v?.ticketCount);
  check("backlog summary updates", v?.backlogSummary?.includes("2 tickets"), v?.backlogSummary);
  check("segment count responds to rules", typeof v?.segmentCount === "string" && /\d+ of 240 people/.test(v.segmentCount), v?.segmentCount);
  check("LaTeX reports unbalanced braces", v?.texStatus?.includes("1 opened, 0 closed"), v?.texStatus);
  check("no uncaught page exceptions", v3.problems.length === 0, v3.problems);

  console.log("\nV3 mobile (390px)");
  const mobile = await evaluate(URL_BASE, MOBILE, { width: 390, height: 780 });
  const m = mobile.value;
  check("viewport really is 390px", m?.viewport === 390, m?.viewport);
  check("no horizontal page overflow", m?.bodyScrollWidth <= m?.viewport, m);
  check("no unclipped content past the viewport", m?.leaks?.length === 0, m?.leaks);

  console.log("\nlegacy shell at /v1");
  const legacy = await evaluate(`${URL_BASE}/v1/#home`, LEGACY_DRIVE);
  check("V1 remains available at /v1", legacy.value?.hasActivityBar && legacy.value?.hasEditor, legacy.value);
} catch (error) {
  failures.push(String(error.message ?? error));
  console.error(`\nsmoke aborted: ${error.message ?? error}`);
} finally {
  cleanup();
}

console.log(failures.length ? `\n${failures.length} check(s) failed\n` : "\nall checks passed\n");
process.exit(failures.length ? 1 : 0);
