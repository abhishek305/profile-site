# Changelog

## [3.0.0] - 2026-09-25

### Added
- Rebuilt the default portfolio as the approved V3 “Play the work” experience.
- Added real path routes for work, project chapters, experience, code, about and contact.
- Added the MCP Profile Hub, architect-agent, Crowdly and LaTeX Live Editor playable stages.
- Extracted pure typed demo logic into `src/v3/logic.ts`.
- Added route-specific prerendering, metadata, Open Graph/Twitter tags and `Person` JSON-LD.
- Added light/dark theme handling, section rail, reading progress, toast and static fallbacks.
- Added SVG favicon/PWA assets, OG artwork, sitemap and robots configuration.
- Added V1 archive coverage and root hash redirects to the new V3 routes.
- Updated the smoke test to cover V3 interactions and the retained `/v1` shell.

### Decisions
- Kept React + Vite and static prerendering rather than migrating to Next.js.
- Shipped labelled local stand-ins for the demos; no live endpoints or third-party embeds.
- Used résumé dates ending August 2026 with neutral employment wording.
- Kept the phone number, résumé PDF and optional README links unpublished.

## [1.1.0] - 2025-01-27

### Removed
- Firebase dependencies, context, configuration and visitor counter.

### Fixed
- Theme picker click handling and outside-click behavior.

## [1.0.0] - 2025-01-27

### Added
- Initial conversion from HTML to React, Vite and TypeScript.
- Legacy IDE portfolio shell, Redux state, PWA support, SEO metadata and seven themes.
