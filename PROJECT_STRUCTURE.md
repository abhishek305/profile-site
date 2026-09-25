# Project structure

```text
portfolio-ide/
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── og.svg
│   ├── pwa-192x192.svg
│   ├── pwa-512x512.svg
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   ├── prerender.mjs        # static HTML, metadata and JSON-LD
│   └── smoke.mjs            # headless Chrome V3 + V1 checks
├── src/
│   ├── components/          # retained legacy V1 IDE
│   │   ├── ActivityBar/
│   │   ├── CommandPalette/
│   │   ├── Editor/
│   │   │   └── pages/
│   │   ├── icons/
│   │   ├── Matrix/
│   │   ├── SEO/
│   │   ├── StatusBar/
│   │   ├── TabsBar/
│   │   └── Terminal/
│   ├── data/                # legacy V1 content
│   ├── hooks/               # legacy V1 hooks
│   ├── store/               # legacy Redux store and slices
│   ├── styles/              # legacy V1 styles
│   ├── types/               # shared legacy types
│   ├── constants/           # identity and V1 themes
│   ├── v3/                  # current portfolio
│   │   ├── components/
│   │   │   ├── DemoStages.tsx
│   │   │   ├── LazyStage.tsx
│   │   │   └── Stage.tsx
│   │   ├── content.ts
│   │   ├── logic.ts
│   │   ├── route-data.json
│   │   ├── routes.ts
│   │   ├── styles.css
│   │   ├── types.ts
│   │   └── V3App.tsx
│   ├── App.tsx              # legacy V1 app
│   └── main.tsx             # /v1 vs V3 entry switch
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Runtime shape

```text
main.tsx
├── /v1* → App.tsx → legacy IDE shell
└── /*   → v3/V3App.tsx → editorial portfolio shell
```

The V3 route list is the single source of truth in
`src/v3/route-data.json`. `src/v3/routes.ts` adds typed helpers and legacy hash
redirects, while `scripts/prerender.mjs` reads the same JSON when writing static
route HTML.

## V3 state and data flow

- `src/v3/content.ts` holds typed, public portfolio copy.
- `src/v3/logic.ts` contains pure demo functions with no DOM or network access.
- `src/v3/components/DemoStages.tsx` connects those functions to controls.
- `src/v3/components/Stage.tsx` provides the shared stage, hint, toast,
  segmented control, chips, flow and receipts primitives.
- `src/v3/V3App.tsx` owns route lookup, theme, progress, rail scroll-spy and
  page composition.

## State retained for V1

The Redux store under `src/store` is still used by `/v1` for its tabs, themes,
terminal, matrix overlay and command palette. V3 does not depend on Redux.
