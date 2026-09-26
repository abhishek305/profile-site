/**
 * Writes the static HTML for every route.
 *
 * The prerendered markup is a no-JavaScript fallback: the same copy and the
 * same routes as the React app, minus the interactive stages. Reading the
 * content from `src/v3/content` and the origin from `src/v3/site` keeps the two
 * from drifting apart, which is what previously let the abridged copy here fall
 * behind the real text.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadTypeScriptModules, readJson } from "./load-content.mjs";

const dist = join(process.cwd(), "dist");

const { SITE_URL, identity, links } = await loadTypeScriptModules(["src/v3/site.ts"]);
const {
  EMPLOYMENT,
  aboutDefinitions,
  aboutParagraphs,
  contactIntro,
  email,
  experience,
  experienceIntro,
  githubProfile,
  linkedinProfile,
  projectBySlug,
  projects,
  repositories,
  resultClaims,
  resumeContact,
  resumeHighlights,
  resumeName,
  resumeSummary,
  resumeTitle,
} = await loadTypeScriptModules(["src/v3/content/index.ts"]);

const routes = await readJson("src/v3/route-data.json");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

/** Outbound link, with the visually hidden new-tab notice the React app uses. */
const link = (href, label) =>
  `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}<span class="vh"> (opens in a new tab)</span></a>`;

const MOST_STARRED = {
  name: "PyBot",
  description: "A chatbot that answers Python questions using NLP.",
  stars: "90+",
  href: "https://github.com/abhishek305/PyBot-A-ChatBot-For-Answering-Python-Queries-Using-NLP",
};

const stageFallback = (text) =>
  `<div class="static-fallback"><strong>Interactive stage.</strong> ${escapeHtml(text)}</div>`;

/**
 * Outbound links in a row. The separator is drawn by CSS via `.linklist`, so it
 * is not read out as part of the link text, matching the React component.
 */
const linkList = (items) => `<span class="linklist">${items.map((item) => link(item.href, item.label)).join("")}</span>`;

/* --------------------------------------------------------------------------
 * Section markup, mirroring the React components in src/v3/components/
 * ----------------------------------------------------------------------- */

/** A `.prose` block, optionally led by a heading and tagline. */
const prose = (paragraphs, lead = "") =>
  `<div class="prose">${lead}${paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}</div>`;

const projectChapter = (project, { standalone = false } = {}) => {
  const lead = standalone
    ? ""
    : `<h2>${escapeHtml(project.title)}</h2><p class="tagline">${escapeHtml(project.tagline)}</p>`;

  return [
    `<section class="chapter ${standalone ? "standalone" : ""}" id="${escapeHtml(project.anchor)}">`,
    prose(project.paragraphs, lead),
    stageFallback(
      `Play the ${project.title} demo: the interactive controls load with JavaScript. The full copy, stack and links are below.`,
    ),
    `<p class="note"><b>Try this.</b> ${escapeHtml(project.tryThis)}</p>`,
    `<p class="facts"><span class="code">${escapeHtml(project.stack.join(" · "))}</span> ${escapeHtml(
      project.facts.join(" "),
    )} ${linkList(project.links)}</p>`,
    "</section>",
  ].join("");
};

/**
 * The section id and heading differ between the home page and a standalone
 * route: at home the section carries the `h2`, but on `/experience` the page
 * head above it already holds the `h1`, so repeating the heading would be a
 * duplicate. Mirrors the `standalone` prop on the React sections.
 */
const sectionHeading = (title, standalone) => (standalone ? "" : `<h2>${escapeHtml(title)}</h2>`);

const results = ({ standalone = false } = {}) =>
  [
    '<section class="chapter" id="results">',
    sectionHeading("Results", standalone),
    `<p>Six measurable outcomes from my time at ${escapeHtml(EMPLOYMENT.company)}. Open a row to see what changed.</p>`,
    // Native details/summary, so the explanations work without JavaScript too.
    '<div class="receipts">',
    resultClaims
      .map(
        (claim) =>
          `<details><summary>${escapeHtml(claim.value)}</summary><p>${escapeHtml(claim.explanation)}</p></details>`,
      )
      .join(""),
    "</div></section>",
  ].join("");

const rolesList = () =>
  '<ol class="roles">' +
  experience
    .map(
      (role) =>
        `<li><div class="role-h"><h3>${escapeHtml(role.title)}</h3><span>${escapeHtml(role.dates)}</span></div><ul>${role.bullets
          .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
          .join("")}</ul></li>`,
    )
    .join("") +
  "</ol>";

const definitionsList = () =>
  '<dl class="defs">' +
  aboutDefinitions.map((item) => `<dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd>`).join("") +
  "</dl>";

const experienceSection = ({ standalone = false } = {}) =>
  [
    `<section class="chapter" id="${standalone ? "experience-details" : "experience"}">`,
    sectionHeading("Experience", standalone),
    `<p>${escapeHtml(EMPLOYMENT.company)}, ${escapeHtml(EMPLOYMENT.from)} to ${escapeHtml(EMPLOYMENT.to)}. ${escapeHtml(experienceIntro)}</p>`,
    rolesList(),
    "</section>",
  ].join("");

const codeSection = ({ standalone = false } = {}) =>
  [
    `<section class="chapter" id="${standalone ? "github-details" : "github"}">`,
    sectionHeading("Code on GitHub", standalone),
    `<p>I have 100+ public repositories at ${link(githubProfile, "github.com/abhishek305")}. These four are the ones I would point you to.</p>`,
    '<ul class="repos">',
    repositories
      .map(
        (repo) =>
          `<li><b>${escapeHtml(repo.name)}</b><p>${escapeHtml(repo.description)}<span class="stack">${escapeHtml(
            repo.stack,
          )}</span></p><span class="lk">${linkList(repo.links)}</span></li>`,
      )
      .join(""),
    "</ul>",
    `<p class="note">Older work: ${link(MOST_STARRED.href, MOST_STARRED.name)}, ${escapeHtml(
      MOST_STARRED.description,
    )} It is my most-starred repository at ${escapeHtml(MOST_STARRED.stars)} stars.</p>`,
    `<div class="contact-links">${link(`${githubProfile}?tab=repositories`, "See all repositories")}</div>`,
    "</section>",
  ].join("");

const aboutSection = ({ standalone = false } = {}) =>
  [
    `<section class="chapter" id="${standalone ? "about-details" : "about"}">`,
    prose(aboutParagraphs, sectionHeading("About", standalone)),
    '<dl class="defs" id="skills">',
    aboutDefinitions
      .map((item) => `<dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd>`)
      .join(""),
    "</dl></section>",
  ].join("");

/** The résumé document, as an article rather than a section. */
const resumeArticle = () =>
  [
    '<article class="chapter resume">',
    "<h2>Summary</h2>",
    resumeSummary.map((text) => `<p>${escapeHtml(text)}</p>`).join(""),
    '<ul class="resume-contact">',
    resumeContact
      .map(
        (item) =>
          `<li><b>${escapeHtml(item.label)}</b>${
            item.href.startsWith("mailto:")
              ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.value)}</a>`
              : link(item.href, item.value)
          }</li>`,
      )
      .join(""),
    "</ul>",
    '<div class="contact-links resume-actions">',
    '<a class="btn primary" href="/resume.pdf" download="Abhishek-Ezhava-resume.pdf">Download PDF</a>',
    link("/resume.pdf", "Open in a new tab"),
    "</div>",
    "<h2>Experience</h2>",
    `<p class="resume-note">${escapeHtml(EMPLOYMENT.company)}, ${escapeHtml(EMPLOYMENT.from)} to ${escapeHtml(EMPLOYMENT.to)}. ${escapeHtml(experienceIntro)}</p>`,
    rolesList(),
    "<h2>Selected impact</h2>",
    '<ul class="resume-highlights">',
    resumeHighlights
      .map(
        (claim) => `<li><b>${escapeHtml(claim.value)}</b><span>${escapeHtml(claim.explanation)}</span></li>`,
      )
      .join(""),
    "</ul>",
    "<h2>Skills, education and recognition</h2>",
    definitionsList(),
    "</article>",
  ].join("");

const contactSection = ({ standalone = false } = {}) =>
  [
    `<section class="chapter" id="${standalone ? "contact-details" : "contact"}">`,
    sectionHeading("Contact", standalone),
    `<p>${escapeHtml(contactIntro)}</p>`,
    '<div class="contact-links">',
    `<a class="btn primary" href="mailto:${escapeHtml(email)}?subject=Hello%20from%20your%20portfolio">Email me</a>`,
    link(githubProfile, "GitHub"),
    link(linkedinProfile, "LinkedIn"),
    "</div></section>",
  ].join("");

/* --------------------------------------------------------------------------
 * Routes
 * ----------------------------------------------------------------------- */

const pageHead = (title, tagline) =>
  `<section class="page-head"><h1>${escapeHtml(title)}</h1><p class="tagline">${escapeHtml(tagline)}</p></section>`;

const bodyFor = (route) => {
  if (route.kind === "home") {
    return [
      '<section class="hero" id="intro">',
      "<h1>I build the platforms that AI clients plug into.</h1>",
      '<p class="lede">Senior software engineer with 6.5 years at Contentstack. I built MCP Profile Hub, a production MCP server with 180+ tools that AI clients like Claude, Cursor and Codex use. Four projects are playable below.</p>',
      '<div class="cta"><a class="btn primary" href="#mcp">Try the demos</a><a class="btn" href="#experience">See my experience</a><a class="btn" href="#contact">Get in touch</a></div>',
      '<ul class="index" aria-label="What you can play with">',
      projects
        .map(
          (project) =>
            `<li><a href="#${escapeHtml(project.anchor)}"><b>${escapeHtml(project.title)}</b><span>${escapeHtml(
              project.highlight,
            )}</span></a></li>`,
        )
        .join(""),
      "</ul></section>",
      ...projects.map((project) => projectChapter(project)),
      results(),
      experienceSection(),
      codeSection(),
      aboutSection(),
      contactSection(),
    ].join("");
  }

  if (route.kind === "work") {
    return [
      pageHead("Work", "Four projects, each with a small playable version of it on the page."),
      '<ul class="index" aria-label="Project chapters">',
      projects
        .map(
          (project) =>
            `<li><a href="/work/${escapeHtml(project.slug)}"><b>${escapeHtml(project.title)}</b><span>${escapeHtml(
              project.tagline,
            )}</span></a></li>`,
        )
        .join(""),
      "</ul>",
    ].join("");
  }

  if (route.kind === "project") {
    const project = projectBySlug(route.projectSlug);
    if (!project) return "<section class=\"not-found\"><h1>That page is not here.</h1></section>";
    return pageHead(project.title, project.tagline) + projectChapter(project, { standalone: true });
  }

  if (route.kind === "experience") {
    return (
      pageHead(
        "Experience",
        `Developer platform work at ${EMPLOYMENT.company}, ${EMPLOYMENT.from} to ${EMPLOYMENT.to}.`,
      ) + experienceSection({ standalone: true })
    );
  }

  if (route.kind === "code") {
    return (
      pageHead("Code on GitHub", "Selected open-source work and the projects I would point you to.") +
      codeSection({ standalone: true })
    );
  }

  if (route.kind === "about") {
    return (
      pageHead("About", "Frontend-heavy, full-stack, and focused on developer platforms.") +
      aboutSection({ standalone: true })
    );
  }

  if (route.kind === "resume") {
    return pageHead(resumeName, resumeTitle) + resumeArticle();
  }

  return pageHead("Contact", "The quickest way to reach me is email.") + contactSection({ standalone: true });
};

/* --------------------------------------------------------------------------
 * Social images, metadata and output
 * ----------------------------------------------------------------------- */

const nav = routes.map((route) => `<a href="${route.path}">${escapeHtml(route.label)}</a>`).join(" ");

const ogSlug = (path) => (path === "/" ? "home" : path.slice(1).replaceAll("/", "-"));
const ogUrl = (route) => `${SITE_URL}/og/${ogSlug(route.path)}.svg`;

const ogSvg = (route) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F1F4F9"/><rect x="64" y="64" width="1072" height="502" fill="#E4EAF4" stroke="#101A30" stroke-width="3"/><text x="112" y="190" fill="#465272" font-family="Arial,sans-serif" font-size="32">${escapeHtml(
    identity.name,
  )}</text><text x="112" y="330" fill="#101A30" font-family="Arial,sans-serif" font-size="64" font-weight="700">${escapeHtml(
    route.label,
  )}</text><rect x="112" y="410" width="240" height="18" fill="#FFD84A"/><text x="112" y="500" fill="#465272" font-family="Arial,sans-serif" font-size="28">Play the work.</text></svg>`;

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  url: SITE_URL,
  jobTitle: identity.jobTitle,
  sameAs: [links.github, links.linkedin],
};

const shell = (route) =>
  `<div class="v3-static-shell"><header><a href="/">${escapeHtml(identity.name)}</a><nav aria-label="Primary">${nav}</nav></header><main id="main">${bodyFor(
    route,
  )}</main><footer>Last updated September 21, 2026. Design prototype: demos use stand-in logic and fictional data.</footer></div>`;

const addMeta = (html, route) => {
  const canonical = `${SITE_URL}${route.path}`;
  return html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${escapeHtml(route.description)}" />`,
    )
    .replace(
      "</head>",
      `<link rel="canonical" href="${escapeHtml(canonical)}" /><meta property="og:title" content="${escapeHtml(
        route.title,
      )}" /><meta property="og:description" content="${escapeHtml(route.description)}" /><meta property="og:type" content="website" /><meta property="og:url" content="${escapeHtml(
        canonical,
      )}" /><meta property="og:image" content="${escapeHtml(ogUrl(route))}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${escapeHtml(
        route.title,
      )}" /><meta name="twitter:description" content="${escapeHtml(route.description)}" /><meta name="twitter:image" content="${escapeHtml(
        ogUrl(route),
      )}" /><script type="application/ld+json">${JSON.stringify(person).replaceAll("<", "\\u003c")}</script></head>`,
    );
};

const template = await readFile(join(dist, "index.html"), "utf8");

await mkdir(join(dist, "og"), { recursive: true });

for (const route of routes) {
  await writeFile(join(dist, "og", `${ogSlug(route.path)}.svg`), ogSvg(route));

  const html = addMeta(template.replace('<div id="root"></div>', `<div id="root">${shell(route)}</div>`), route);

  // Both shapes are written so the site works with cleanUrls on and off.
  const outputs =
    route.path === "/"
      ? [join(dist, "index.html")]
      : [join(dist, route.path.slice(1), "index.html"), join(dist, `${route.path.slice(1)}.html`)];

  for (const output of outputs) {
    await mkdir(join(output, ".."), { recursive: true });
    await writeFile(output, html);
  }
}
