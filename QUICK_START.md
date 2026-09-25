# Quick start

## Requirements

- Node.js 18+
- npm, yarn or pnpm

## Run the new portfolio

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The default route is the V3 portfolio. The old IDE portfolio is available at
[http://localhost:5173/v1/#home](http://localhost:5173/v1/#home).

## Verify a change

```bash
npm run lint
npm run build
npm run preview
```

In another terminal, with the dev server running:

```bash
npm run smoke
```

The smoke test checks the four V3 stages, the MCP outcomes, backlog generation,
segment filtering, the LaTeX error state, mobile overflow and the legacy `/v1`
shell.

## Where to edit

- Identity and links: `src/constants/profile.ts`
- V3 copy and project facts: `src/v3/content.ts`
- Route metadata: `src/v3/route-data.json`
- Demo logic: `src/v3/logic.ts`
- V3 components: `src/v3/components/`
- V3 styles and tokens: `src/v3/styles.css`
- Legacy V1 content: `src/data/content.ts`

There is no Firebase configuration, backend or environment variable required.
