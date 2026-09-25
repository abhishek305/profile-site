# Setup instructions

## 1. Install

```bash
npm install
```

## 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Routes are served by Vite in development. The new site uses real paths:

- `/`
- `/work`
- `/work/mcp-profile-hub`
- `/work/architect-agent`
- `/work/crowdly`
- `/work/latex-live-editor`
- `/experience`
- `/code`
- `/about`
- `/contact`

The legacy IDE is intentionally isolated at `/v1`.

## 3. Build and preview

```bash
npm run build
npm run preview
```

The build runs three steps:

1. TypeScript type-checking
2. Vite bundling and PWA service-worker generation
3. `scripts/prerender.mjs`, which writes static HTML for every V3 route and the
   legacy `/v1` shell

## 4. Quality checks

```bash
npm run lint
npm run smoke
```

`npm run smoke` expects the development server to be running. It uses Node
22's built-in WebSocket support and system Chrome. Override the defaults with
`SMOKE_URL` and `CHROME_PATH` if needed.

## Content and privacy

All public content is in `src/v3/content.ts`; identity is in
`src/constants/profile.ts`. The demos are local stand-ins and use fictional
data. Do not add customer data, internal endpoints, tokens or private repository
links.

The site intentionally does not publish the phone number, résumé PDF or
optional README links without owner approval.

## Deployment

The project is configured for a static Vercel deployment. Use:

```bash
npm run build
```

`public/robots.txt`, `public/sitemap.xml` and the prerendered route metadata use
`https://profile-site-navy-pi.vercel.app`. Update the site URL in
`src/v3/V3App.tsx` and `scripts/prerender.mjs` if the deployment domain changes.
