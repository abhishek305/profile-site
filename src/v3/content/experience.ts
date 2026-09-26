import type { ExperienceRole, ResultClaim } from "../types";

/** Employment runs from January 2020 to August 2026. Dates come from the résumé. */
export const EMPLOYMENT = {
  company: "Contentstack",
  from: "January 2020",
  to: "August 2026",
} as const;

/** Standfirst above the role list. */
export const experienceIntro = `I started as an application engineer and grew into owning developer platform products end to end.`;

export const experience: ExperienceRole[] = [
  {
    title: "Senior Software Engineer I",
    dates: "February 2024 to August 2026",
    bullets: [
      "Architected and shipped MCP Profile Hub, then extended it so customer automations and agents are callable tools.",
      "Delivered Phase 2 of the App MCP Server for app developers.",
      "Built event-driven platform work: system-app rollout on NestJS, Kafka and CloudEvents, and metadata batching for App Extensions.",
      "Built Product Wiki, a knowledge layer that gives AI agents structured context about developer tools, apps and platform capabilities.",
    ],
  },
  {
    title: "Software Engineer II",
    dates: "February 2022 to February 2024",
    bullets: [
      "Built and maintained the Node.js and Babel source plugin for GatsbyJS.",
      "Shipped app version control in React, Redux and React Query, giving developers rollback, restore and version-based manifest previews.",
      "Extended the App SDK with full TypeScript support and fixed Snyk-flagged vulnerabilities.",
    ],
  },
  {
    title: "Application Engineer",
    dates: "January 2020 to February 2022",
    bullets: [
      "Migrated the marketing website from Express and Nunjucks to React.",
      "Built Zapier integrations in JavaScript that connect Contentstack APIs with 15+ tools, including Slack, Jira and Google Sheets, and with marketplace apps such as OCR, JSON Editor and commercotools.",
    ],
  },
];

/**
 * Six measurable outcomes. Each row explains what changed, so a visitor can
 * expand it rather than take the figure on trust.
 */
export const resultClaims: ResultClaim[] = [
  { value: "40% fewer validation errors", explanation: "Schema-aware validation for App Extensions, across nested field types." },
  { value: "25% faster extension loads", explanation: "Event-driven metadata batching, built on PostRobot, that eliminated redundant requests." },
  { value: "40% less manual maintenance", explanation: "Automated system-app version rollout with NestJS, Kafka and CloudEvents." },
  { value: "15% fewer regressions", explanation: "Wider Playwright end-to-end coverage, with Slack alerting when a run fails." },
  { value: "30% faster content sourcing", explanation: "A Node.js and Babel source plugin for GatsbyJS, for teams building static sites on Contentstack." },
  { value: "40% faster page loads and a 92+ Lighthouse score", explanation: "Migrated the marketing website from Express and Nunjucks to React." },
];
