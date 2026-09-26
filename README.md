# Abhishek Ezhava — Play the work

A portfolio built as four playable demos rather than case studies. Break an MCP
tool call and see what the model gets back, edit a product spec and watch the
backlog rewrite itself, set rules for an audience segment, or type LaTeX and read
the page.

React 18, TypeScript and Vite. Statically prerendered, no backend, no tracker.

## Getting started

Requires Node.js `^20.19` or `>=22.12`.

```bash
npm install
npm run dev
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check, bundle, prerender every route, write robots and sitemap |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint with jsx-a11y, zero warnings allowed |

## Routes

| Route | Page |
| --- | --- |
| `/` | Hero, all four playable chapters, results, experience, code, about, contact |
| `/work` | Project index |
| `/work/:slug` | A project chapter and its stage |
| `/experience` `/code` `/about` `/contact` | Standing pages |

Unknown paths render an explicit not-found page. Every route is prerendered to
static HTML at build time, and the chapter copy is readable without JavaScript.

## Editing content

| File | Holds |
| --- | --- |
| `src/v3/site.json` | Canonical URL, name, email, profile links |
| `src/v3/content/` | All copy: projects, experience, results, repositories, about |
| `src/v3/route-data.json` | Route paths, titles and descriptions |
| `src/v3/demos/logic/` | The demo behaviour, as pure functions |

`scripts/prerender.mjs` reads the same content and site modules, so the static
HTML and the React bundle cannot drift apart. Adding a route is one row in
`route-data.json` plus one entry in `src/v3/routes/pages.tsx`.

### The demos

Demo logic is deliberately separate from the UI, with no React, DOM or network
dependency:

- `demos/logic/mcp.ts` — `planCall(config)` and the five failure paths
- `demos/logic/backlog.ts` — `buildBacklog(spec)`, sentence to ticket plus CSV
- `demos/logic/audience.ts` — `generatePeople()` and `segmentMatch(people, rules)`
- `demos/logic/tex.ts` — `texRender(source)`, a small safe LaTeX subset

Each stage is labelled on the page. The audience is generated locally from a
fixed seed and is not real data. Visitor input is escaped before it reaches the
DOM and is never sent anywhere.

## Deploying

Static output in `dist/`. `vercel.json` enables clean URLs, so `/work/crowdly`
and `/work/crowdly.html` both resolve.
