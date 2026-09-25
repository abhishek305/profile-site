import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const site = "https://profile-site-navy-pi.vercel.app";
const routeData = JSON.parse(await readFile(join(root, "src/v3/route-data.json"), "utf8"));
const routes = routeData;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const projectAnchors = {
  "mcp-profile-hub": "mcp",
  "architect-agent": "architect-agent",
  crowdly: "crowdly",
  "latex-live-editor": "latex",
};

const projectText = {
  "mcp-profile-hub": {
    title: "MCP Profile Hub",
    tagline: "A production MCP server for Claude, Cursor and Codex.",
    body: "MCP Profile Hub is Contentstack's MCP server for AI clients. It replaced hand-written Management API scripts with a governed, self-serve tool platform. I was the primary engineer and architected and shipped it. When an AI client calls a tool, the call passes through a profile, auth, validation and an event bus before anyone sees a result.",
    fallback: "Interactive simulation: change the profile, token, arguments, consumer and error-message settings, then run the call to see where it stops and what the model receives.",
  },
  "architect-agent": {
    title: "architect-agent",
    tagline: "Spec-to-backlog, automated.",
    body: "An open-source, multi-agent documentation toolkit built on Mastra.ai. It interviews you as a Senior PM or a Principal Engineer, then generates PRDs, TDRs, user stories and Jira-ready CSVs.",
    fallback: "Interactive stand-in: edit a product spec and the prioritised backlog and CSV preview update with it.",
  },
  crowdly: {
    title: "Crowdly",
    tagline: "14 CDP segments, live.",
    body: "A live event discovery and booking platform built on Contentstack's composable DXP. Lytics CDP segmentation and Automate booking workflows sit behind it.",
    fallback: "Interactive stand-in: change interests, city, activity and booking rules to redraw a fictional audience segment.",
  },
  "latex-live-editor": {
    title: "LaTeX Live Editor",
    tagline: "Client-side TeX compilation.",
    body: "A browser-based LaTeX editor with real-time compilation and a side-by-side PDF preview. The TeX engine runs client-side as WebAssembly, so there is no backend and nothing is uploaded.",
    fallback: "Interactive stand-in: type LaTeX on the left and read a small rendered page on the right.",
  },
};

const nav = routes.map((route) => `<a href="${route.path}">${escapeHtml(route.label)}</a>`).join(" ");
const link = (href, label) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}<span class="vh"> (opens in a new tab)</span></a>`;

const ogSlug = (path) => path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
const ogSvg = (route) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F1F4F9"/><rect x="64" y="64" width="1072" height="502" fill="#E4EAF4" stroke="#101A30" stroke-width="3"/><text x="112" y="190" fill="#465272" font-family="Arial,sans-serif" font-size="32">Abhishek Ezhava</text><text x="112" y="330" fill="#101A30" font-family="Arial,sans-serif" font-size="64" font-weight="700">${escapeHtml(route.label)}</text><rect x="112" y="410" width="240" height="18" fill="#FFD84A"/><text x="112" y="500" fill="#465272" font-family="Arial,sans-serif" font-size="28">Play the work.</text></svg>`;
const ogUrl = (route) => `${site}/og/${ogSlug(route.path)}.svg`;

const stageFallback = (text) => `<div class="static-fallback"><strong>Interactive stage.</strong> ${escapeHtml(text)}</div>`;

const projectStatic = (slug, standalone = false) => {
  const project = projectText[slug];
  const heading = standalone ? "" : `<h2>${escapeHtml(project.title)}</h2><p class="tagline">${escapeHtml(project.tagline)}</p>`;
  return `<section class="chapter" id="${escapeHtml(projectAnchors[slug] ?? slug)}"><div class="prose">${heading}<p>${escapeHtml(project.body)}</p></div>${stageFallback(project.fallback)}<p class="facts">The full stage, copy, stack and links are available when JavaScript is enabled.</p></section>`;
};

const roles = [
  ["Senior Software Engineer I", "February 2024 to August 2026", ["Architected and shipped MCP Profile Hub, then extended it so customer automations and agents are callable tools.", "Delivered Phase 2 of the App MCP Server for app developers.", "Built event-driven platform work with NestJS, Kafka, CloudEvents and metadata batching."]],
  ["Software Engineer II", "February 2022 to February 2024", ["Built and maintained the Node.js and Babel source plugin for GatsbyJS.", "Shipped app version control in React, Redux and React Query.", "Extended the App SDK with full TypeScript support."]],
  ["Application Engineer", "January 2020 to February 2022", ["Migrated the marketing website from Express and Nunjucks to React.", "Built Zapier integrations connecting Contentstack APIs with 15+ tools."]],
];
const rolesStatic = `<ol class="roles">${roles.map(([title, dates, bullets]) => `<li><div class="role-h"><h3>${escapeHtml(title)}</h3><span>${escapeHtml(dates)}</span></div><ul>${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul></li>`).join("")}</ol>`;
const repos = [
  ["architect-agent", "A multi-agent documentation toolkit that generates PRDs, TDRs, user stories and Jira-ready CSVs.", "https://github.com/abhishek305/architect-agent"],
  ["Crowdly", "Event discovery and booking on a composable DXP, with Lytics CDP segmentation.", "https://github.com/abhishek305/crowdly"],
  ["LaTeX Live Editor", "A browser-based LaTeX editor with client-side TeX compilation.", "https://github.com/abhishek305/latex-live-editor"],
  ["DotPath", "A developer utility for visually navigating and resolving nested object paths.", "https://github.com/abhishek305/DotPath"],
];
const reposStatic = `<ul class="repos">${repos.map(([name, description, href]) => `<li><b>${escapeHtml(name)}</b><p>${escapeHtml(description)}</p><span class="lk">${link(href, "Source")}</span></li>`).join("")}</ul>`;
const definitions = [
  ["Frontend", "React 19, TypeScript, JavaScript, Next.js App Router, Redux Toolkit, HTML5, CSS3, accessibility."],
  ["Backend and APIs", "Node.js, NestJS, REST APIs, JSON-RPC 2.0, MongoDB, Redis, Kafka, OAuth 2.0, Docker."],
  ["GenAI and MCP", "MCP servers and tool catalogs, agent tooling, Claude Code, Codex, Mastra.ai."],
  ["Testing and delivery", "Jest, Vitest, Playwright, React Testing Library, GitHub Actions, CI/CD."],
  ["Education", "Bachelor of Engineering in Information Technology, Theem College of Engineering, Mumbai, 2019."],
  ["Certifications", "AWS Certified Cloud Practitioner. Anthropic's Intro to MCP and Claude Code in Action."],
  ["Recognition", "Above and Beyond Award at Contentstack, Q1 2023 and Q3 2025."],
];
const definitionsStatic = `<dl class="defs">${definitions.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>`;

const homeStatic = `<section class="hero" id="intro"><h1>I build the platforms that AI clients plug into.</h1><p class="lede">Senior software engineer with 6.5 years at Contentstack. I built MCP Profile Hub, a production MCP server with 180+ tools that AI clients like Claude, Cursor and Codex use. Four projects are playable below.</p><div class="cta"><a class="btn primary" href="#mcp">Try the demos</a><a class="btn" href="#experience">See my experience</a><a class="btn" href="#contact">Get in touch</a></div><ul class="index"><li><a href="#mcp"><b>MCP Profile Hub</b><span>Break a tool call and see what the AI model gets back.</span></a></li><li><a href="#architect-agent"><b>architect-agent</b><span>Edit a product spec and watch the backlog rewrite itself.</span></a></li><li><a href="#crowdly"><b>Crowdly</b><span>Set rules for an audience segment and see who is in it.</span></a></li><li><a href="#latex"><b>LaTeX Live Editor</b><span>Type LaTeX on the left, read the page on the right.</span></a></li></ul></section>${["mcp-profile-hub", "architect-agent", "crowdly", "latex-live-editor"].map(projectStatic).join("")}<section class="chapter" id="results"><h2>Results</h2><p>Six measurable outcomes from my time at Contentstack. Open a row in the interactive page to see what changed.</p><ul><li>40% fewer validation errors</li><li>25% faster extension loads</li><li>40% less manual maintenance</li><li>15% fewer regressions</li><li>30% faster content sourcing</li><li>40% faster page loads and a 92+ Lighthouse score</li></ul></section><section class="chapter" id="experience"><h2>Experience</h2><p>Contentstack, January 2020 to August 2026.</p>${rolesStatic}</section><section class="chapter" id="github"><h2>Code on GitHub</h2><p>I have 100+ public repositories at ${link("https://github.com/abhishek305", "github.com/abhishek305")}. These four are the ones I would point you to.</p>${reposStatic}</section><section class="chapter" id="about"><h2>About</h2><p>I own developer platform products end to end and care about developer experience, performance and scalable UI patterns.</p>${definitionsStatic}</section><section class="chapter" id="contact"><h2>Contact</h2><p>I am happy to talk about MCP and agent tooling, SDK architecture, React and TypeScript, NestJS and Node.js, and developer platforms.</p><p><a class="btn primary" href="mailto:abhishekshaji1994@gmail.com?subject=Hello%20from%20your%20portfolio">Email me</a></p></section>`;

const pageStatic = (route) => {
  if (route.kind === "home") return homeStatic;
  if (route.kind === "work") return `<section class="page-head"><h1>Work</h1><p>Four projects, each with a small playable version of it on the page.</p><ul class="index">${Object.entries(projectText).map(([slug, project]) => `<li><a href="/work/${slug}"><b>${escapeHtml(project.title)}</b><span>${escapeHtml(project.tagline)}</span></a></li>`).join("")}</ul></section>`;
  if (route.kind === "project") {
    const slug = route.projectSlug;
    const project = projectText[slug];
    return `<section class="page-head"><h1>${escapeHtml(project.title)}</h1><p class="tagline">${escapeHtml(project.tagline)}</p></section>${projectStatic(slug, true)}`;
  }
  if (route.kind === "experience") return `<section class="page-head"><h1>Experience</h1><p>Developer platform work at Contentstack, January 2020 to August 2026.</p></section><section class="chapter">${rolesStatic}</section>`;
  if (route.kind === "code") return `<section class="page-head"><h1>Code on GitHub</h1><p>Selected open-source work and the projects I would point you to.</p></section><section class="chapter">${reposStatic}</section>`;
  if (route.kind === "about") return `<section class="page-head"><h1>About</h1><p>Frontend-heavy, full-stack, and focused on developer platforms.</p></section><section class="chapter">${definitionsStatic}</section>`;
  return `<section class="page-head"><h1>Contact</h1><p>The quickest way to reach me is email.</p></section><section class="chapter"><p>I am happy to talk about MCP and agent tooling, SDK architecture, React and TypeScript, NestJS and Node.js, and developer platforms.</p><p><a class="btn primary" href="mailto:abhishekshaji1994@gmail.com?subject=Hello%20from%20your%20portfolio">Email me</a></p></section>`;
};

const shell = (route) => `<div class="v3-static-shell"><header><a href="/">Abhishek Ezhava</a><nav aria-label="Primary">${nav}</nav></header><main id="main">${pageStatic(route)}</main><footer>Last updated September 21, 2026. Design prototype: demos use stand-in logic and fictional data.</footer></div>`;

const criticalStyles = `<style>.v3-static-shell{font:400 1.125rem/1.65 Georgia,serif;max-width:1320px;margin:auto;padding:0 24px}.v3-static-shell header{display:flex;gap:20px;flex-wrap:wrap;padding:16px 0;border-bottom:2px solid #101A30;font-family:Arial,sans-serif}.v3-static-shell main{padding:64px 0}.v3-static-shell h1,.v3-static-shell h2{font-family:Arial,sans-serif;line-height:1.1}.v3-static-shell .chapter,.v3-static-shell .page-head{padding:48px 0;border-top:2px solid #101A30}.v3-static-shell .static-fallback{margin:24px 0;padding:16px;border:1px solid #101A30;background:#E4EAF4;font-family:Arial,sans-serif}</style>`;

const addMeta = (html, route) => {
  const canonical = `${site}${route.path}`;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Abhishek Ezhava",
    url: site,
    jobTitle: "Senior Software Engineer",
    sameAs: ["https://github.com/abhishek305", "https://linkedin.com/in/abhishek-ezhava/"],
  };
  return html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(route.description)}" />`)
    .replace("</head>", `${criticalStyles}<link rel="canonical" href="${escapeHtml(canonical)}" /><meta property="og:title" content="${escapeHtml(route.title)}" /><meta property="og:description" content="${escapeHtml(route.description)}" /><meta property="og:type" content="website" /><meta property="og:url" content="${escapeHtml(canonical)}" /><meta property="og:image" content="${escapeHtml(ogUrl(route))}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${escapeHtml(route.title)}" /><meta name="twitter:description" content="${escapeHtml(route.description)}" /><meta name="twitter:image" content="${escapeHtml(ogUrl(route))}" /><script type="application/ld+json">${JSON.stringify(person).replaceAll("<", "\\u003c")}</script></head>`);
};

const template = await readFile(join(dist, "index.html"), "utf8");
for (const route of routes) {
  await mkdir(join(dist, "og"), { recursive: true });
  await writeFile(join(dist, "og", `${ogSlug(route.path)}.svg`), ogSvg(route));
  const html = addMeta(template.replace('<div id="root"></div>', `<div id="root">${shell(route)}</div>`), route);
  const outputs = route.path === "/"
    ? [join(dist, "index.html")]
    : [
        join(dist, route.path.slice(1), "index.html"),
        join(dist, `${route.path.slice(1)}.html`),
      ];
  for (const output of outputs) {
    await mkdir(join(output, ".."), { recursive: true });
    await writeFile(output, html);
  }
}

const legacyRoute = { path: "/v1", label: "Legacy portfolio", title: "Abhishek Ezhava – Portfolio (legacy)", description: "Legacy IDE portfolio for Abhishek Ezhava." };
const legacy = addMeta(template, legacyRoute);
await mkdir(join(dist, "v1"), { recursive: true });
await writeFile(join(dist, "v1", "index.html"), legacy);
await writeFile(join(dist, "v1.html"), legacy);
await writeFile(join(dist, "og", "legacy.svg"), ogSvg(legacyRoute));
await writeFile(join(dist, "og", "v1.svg"), ogSvg(legacyRoute));
