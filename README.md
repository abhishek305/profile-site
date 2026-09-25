# Abhishek Ezhava — Play the work

A path-based, interactive portfolio built with React, TypeScript, Vite and Redux Toolkit.

The default site is a calm, editorial scroll with four playable project stages. The
original VS Code-style portfolio is retained at [`/v1`](http://localhost:5173/v1/)
for reference and old links.

## What is here

- **Playable work** — MCP Profile Hub, architect-agent, Crowdly and LaTeX Live Editor
- **No IDE chrome as the main UI** — the V3 shell is a top bar, section rail, progress line and content
- **Real path routes** — `/`, `/work`, `/work/[slug]`, `/experience`, `/code`, `/about`, `/contact`
- **Progressive enhancement** — chapter copy and prerendered HTML are available without JavaScript
- **Light and dark themes** — system preference by default, with a persisted manual toggle
- **Keyboard accessible stages** — segmented controls, chips, reset actions, live regions and visible focus
- **Reduced-motion support** — the MCP simulation runs instantly when motion is reduced
- **SEO and sharing metadata** — route-specific titles, descriptions, canonical URLs, Open Graph, Twitter cards and `Person` JSON-LD
- **PWA shell** — offline caching and an installable manifest
- **Legacy redirect** — old root hash links such as `/#projects` go to the new path routes; the old IDE remains at `/v1`

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hero, playable index, all four project chapters, results, experience, code, about and contact |
| `/work` | Project index |
| `/work/mcp-profile-hub` | MCP Profile Hub chapter and simulation |
| `/work/architect-agent` | architect-agent chapter and spec-to-backlog stand-in |
| `/work/crowdly` | Crowdly chapter and audience-segment stand-in |
| `/work/latex-live-editor` | LaTeX Live Editor chapter and small renderer stand-in |
| `/experience` | Experience page |
| `/code` | Featured GitHub repositories |
| `/about` | About, skills, education and recognition |
| `/contact` | Contact links and copy-email action |
| `/v1` | Retained legacy IDE portfolio |

Unknown V3 paths render an explicit not-found page. The prerender step writes a
static `index.html` for every known route.

## Getting started

Requirements: Node.js 18+ and npm, yarn or pnpm.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To exercise the retained legacy site, open
[http://localhost:5173/v1/#home](http://localhost:5173/v1/#home).

## Commands

```bash
npm run dev       # Vite development server
npm run build     # type-check, bundle, generate the service worker and prerender routes
npm run preview   # serve the production build locally
npm run lint      # ESLint, with zero warnings allowed
npm run smoke     # headless Chrome smoke test against the dev server
```

`npm run smoke` uses the built-in WebSocket client in Node 22 and drives system
Chrome over the DevTools Protocol. It checks the V3 stages, the four demo
outcomes, mobile overflow and the retained `/v1` shell. Set `SMOKE_URL` or
`CHROME_PATH` to override its defaults.

## Project structure

```text
src/
├── components/              # retained V1 IDE components
│   ├── ActivityBar/
│   ├── CommandPalette/
│   ├── Editor/
│   │   └── pages/
│   ├── Matrix/
│   ├── SEO/
│   ├── StatusBar/
│   ├── TabsBar/
│   └── Terminal/
├── data/                    # legacy V1 portfolio content
├── hooks/                   # legacy V1 hooks
├── store/                   # legacy Redux store and slices
├── styles/                  # legacy V1 styles
├── types/                   # shared legacy types
├── constants/               # identity and theme constants
├── v3/                      # new portfolio
│   ├── components/
│   │   ├── DemoStages.tsx
│   │   ├── LazyStage.tsx
│   │   └── Stage.tsx
│   ├── content.ts           # typed V3 project and page content
│   ├── logic.ts             # pure, typed demo logic
│   ├── route-data.json      # single route metadata source
│   ├── routes.ts            # route helpers and legacy redirects
│   ├── styles.css           # prototype design system
│   ├── types.ts
│   └── V3App.tsx
├── App.tsx                  # retained V1 app
└── main.tsx                 # V1/V3 entry switch
```

## Editing content

Identity and links live in [`src/constants/profile.ts`](src/constants/profile.ts).
V3 copy, project facts, results, experience, repositories and contact content
live in [`src/v3/content.ts`](src/v3/content.ts).

The demo logic is deliberately separated from the UI:

- `buildBacklog(spec)` — sentence-to-ticket rules and CSV export
- `planCall(config)` — the five MCP failure/success paths
- `generatePeople()` and `segmentMatch(people, rules)` — deterministic fictional audience
- `texRender(source)` — the small, safe LaTeX subset renderer

Every simulation is labelled on the page. The audience is generated locally from
seed 42; it is not attendee data. No visitor input is evaluated or sent to a
server.

## Content decisions

The current site follows the approved handoff:

- Contentstack dates come from the résumé and end in **August 2026**. The site
  uses neutral wording such as “6.5 years at Contentstack” and does not claim
  current employment or availability.
- The stack stays on **Vite + React with static prerendering**. A Next.js
  migration is not required for this revamp.
- The architect-agent, Crowdly and LaTeX stages start as clearly labelled
  stand-ins. No live endpoint, third-party embed or external service is shipped.
- The phone number, résumé PDF and optional README links are intentionally not
  published.
- Old root hash links redirect to the new V3 routes; `/v1` remains available as
  the legacy archive.

### Owner TODOs

These are deliberately visible or tracked until the owner supplies public-safe
answers:

- How the six Results figures were measured.
- A public-safe breakdown of the 66 Profile Hub test suites.
- Whether a public deployment of the real LaTeX editor may be embedded.
- Any optional public links or a phone-free résumé PDF.
- Final confirmation of the employment dates.

## SEO and deployment

`npm run build` runs `scripts/prerender.mjs` after the Vite build. The script
writes route-specific static HTML, metadata, `Person` structured data and the
`/v1` archive shell. `public/sitemap.xml` and `public/robots.txt` point at the
Vercel deployment.

For Vercel, use the project root and the standard build command:

```bash
npm run build
```

The site is a static deployment; there is no backend, tracker or visitor
database.
