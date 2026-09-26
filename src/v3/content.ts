import { links, profile } from "./profile";
import type { DefinitionItem, ExperienceRole, Project, Repository, ResultClaim, SkillGroup } from "./types";

export const projects: Project[] = [
  {
    slug: "mcp-profile-hub",
    title: "MCP Profile Hub",
    navLabel: "MCP Profile Hub",
    tagline: "A production MCP server for Claude, Cursor and Codex.",
    paragraphs: [
      "MCP Profile Hub is Contentstack's MCP server for AI clients. It replaced hand-written Management API scripts with a governed, self-serve tool platform. I was the primary engineer and architected and shipped it.",
      "When an AI client calls a tool, the call passes through a profile, auth, validation and an event bus before anyone sees a result. Flip the switches to see where it stops, and what the model is told when it does.",
    ],
    demo: "mcp",
    stack: ["React", "TypeScript", "NestJS", "MCP", "OAuth 2.0", "Kafka"],
    links: [
      {
        label: "Public documentation",
        href: "https://www.contentstack.com/docs/developers/mcp-profile-hub",
        external: true,
      },
    ],
    facts: [
      "10 hosted catalogs, 180+ tools and 28 prebuilt system profiles.",
      "Automations and Agent OS agents become callable, deterministic and auditable tools.",
      "OAuth 2.0 PKCE, encrypted-at-rest tokens, rate limiting and server-side plan entitlements.",
      "66 test suites cover the platform.",
      "App MCP Server Phase 2 added Hub-aligned manifests, location parity and a multi-region Developer Hub API client.",
    ],
    tryThis: "Set Arguments to “Title missing”, then switch Error messages between Terse and Helpful. Same failure, very different next move for the model.",
    disclaimer: "Illustrative simulation with a fictional tool and fictional profiles. Not production data.",
  },
  {
    slug: "architect-agent",
    title: "architect-agent",
    navLabel: "architect-agent",
    tagline: "Spec-to-backlog, automated.",
    paragraphs: [
      "An open-source, multi-agent documentation toolkit built on Mastra.ai. It interviews you as a Senior PM or a Principal Engineer, then generates PRDs, TDRs, user stories and Jira-ready CSVs.",
      "The box below is a small stand-in built for this page: edit a sentence and the tickets change with it.",
    ],
    demo: "architect",
    stack: ["TypeScript", "Node.js", "Mastra.ai", "multi-provider LLMs"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/abhishek305/architect-agent", external: true },
    ],
    facts: [
      "Includes SQLite conversation memory, a CI/CD mode and multi-provider LLM support.",
    ],
    tryThis: "Delete the word “must” from the first sentence. The ticket drops a priority level. Then open the CSV view and watch the Priority column follow.",
    disclaimer: "Rule-based stand-in for illustration. The real toolkit uses LLM agents.",
  },
  {
    slug: "crowdly",
    title: "Crowdly",
    navLabel: "Crowdly",
    tagline: "14 CDP segments, live.",
    paragraphs: [
      "A live event discovery and booking platform built on Contentstack's composable DXP. Lytics CDP segmentation (14 segments) and Automate booking workflows sit behind it.",
      "A segment is a rule that answers “which people?”. In the stand-in below, change the rules and the audience redraws. The 240 people are made up.",
    ],
    demo: "crowdly",
    stack: ["React 19", "TypeScript", "Zod", "Vite"],
    links: [
      { label: "Live site", href: "https://crowdly.contentstackapps.com", external: true },
      { label: "Source on GitHub", href: "https://github.com/abhishek305/crowdly", external: true },
    ],
    facts: [
      "The real product uses Lytics CDP segmentation and Automate workflows.",
    ],
    tryThis: "Untick everything except Music, then narrow “active” to 7 days. Save it. Loosen one rule and compare the two counts.",
    disclaimer: "Fictional sample audience, generated in your browser. Crowdly's real segments come from Lytics.",
  },
  {
    slug: "latex-live-editor",
    title: "LaTeX Live Editor",
    navLabel: "LaTeX Live Editor",
    tagline: "Client-side TeX compilation.",
    paragraphs: [
      "A browser-based LaTeX editor with real-time compilation and a side-by-side PDF preview. The TeX engine runs client-side as WebAssembly, so there is no backend and nothing is uploaded.",
      "This page uses a small stand-in renderer. The real editor compiles full TeX.",
    ],
    demo: "latex",
    stack: ["React", "TypeScript", "WebAssembly"],
    links: [
      { label: "Source on GitHub", href: "https://github.com/abhishek305/latex-live-editor", external: true },
    ],
    facts: [
      "The real editor compiles TeX in the browser with no backend.",
    ],
    tryThis: "Delete one closing brace from \\textbf{Bold}. The status line tells you what to check.",
    disclaimer: "Stand-in renderer for the design prototype. Supports sections, bold, emphasis, lists and basic maths.",
  },
];

export const resultClaims: ResultClaim[] = [
  { value: "40% fewer validation errors", explanation: "Schema-aware validation for App Extensions, across nested field types." },
  { value: "25% faster extension loads", explanation: "Event-driven metadata batching, built on PostRobot, that eliminated redundant requests." },
  { value: "40% less manual maintenance", explanation: "Automated system-app version rollout with NestJS, Kafka and CloudEvents." },
  { value: "15% fewer regressions", explanation: "Wider Playwright end-to-end coverage, with Slack alerting when a run fails." },
  { value: "30% faster content sourcing", explanation: "A Node.js and Babel source plugin for GatsbyJS, for teams building static sites on Contentstack." },
  { value: "40% faster page loads and a 92+ Lighthouse score", explanation: "Migrated the marketing website from Express and Nunjucks to React." },
];

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

export const repositories: Repository[] = [
  {
    name: "architect-agent",
    description: "A multi-agent documentation toolkit that interviews you as a Senior PM or Principal Engineer and generates PRDs, TDRs, user stories and Jira-ready CSVs.",
    stack: "TypeScript, Node.js, Mastra.ai, multi-provider LLMs",
    links: [{ label: "Source", href: "https://github.com/abhishek305/architect-agent", external: true }],
  },
  {
    name: "Crowdly",
    description: "Event discovery and booking on a composable DXP, with Lytics CDP segmentation and Automate workflows.",
    stack: "React 19, TypeScript, Zod, Vite",
    links: [
      { label: "Source", href: "https://github.com/abhishek305/crowdly", external: true },
      { label: "Live", href: "https://crowdly.contentstackapps.com", external: true },
    ],
  },
  {
    name: "LaTeX Live Editor",
    description: "A browser-based LaTeX editor with real-time compilation and a side-by-side PDF preview. The TeX engine runs client-side, with no backend.",
    stack: "React, TypeScript, WebAssembly",
    links: [{ label: "Source", href: "https://github.com/abhishek305/latex-live-editor", external: true }],
  },
  {
    name: "DotPath",
    description: "A developer utility for visually navigating and resolving nested object paths.",
    stack: "React, TypeScript, Vite",
    links: [{ label: "Source", href: `${links.github}/DotPath`, external: true }],
  },
];

export const skillGroups: SkillGroup[] = [
  { label: "Frontend", value: "React 19, TypeScript, JavaScript (ES6+), Next.js App Router, Redux Toolkit, HTML5, CSS3, design systems, accessibility." },
  { label: "Backend and APIs", value: "Node.js, NestJS, REST APIs, JSON-RPC 2.0, MongoDB, Redis, Kafka, OAuth 2.0, Docker." },
  { label: "GenAI and MCP", value: "MCP servers and tool catalogs, agent tooling, Claude Code, Codex, Mastra.ai." },
  { label: "Testing and delivery", value: "Jest, Vitest, Playwright, React Testing Library, GitHub Actions, CI/CD, code review, performance optimization." },
];

export const aboutDefinitions: DefinitionItem[] = [
  ...skillGroups,
  { label: "Education", value: "Bachelor of Engineering in Information Technology, Theem College of Engineering, Mumbai, 2019." },
  { label: "Certifications", value: "AWS Certified Cloud Practitioner. Anthropic's Intro to MCP and Claude Code in Action." },
  { label: "Recognition", value: "Above and Beyond Award at Contentstack, Q1 2023 and Q3 2025." },
];

export const contactIntro = "I am happy to talk about MCP and agent tooling, SDK architecture, React and TypeScript, NestJS and Node.js, and developer platforms. Email is the quickest way to reach me.";

export const ownerTodos = [
  "Employment dates and availability need owner confirmation.",
  "Measurement methods for the six result claims need owner confirmation.",
  "The 66 Profile Hub test suites need a public-safe breakdown.",
  "The real LaTeX editor and any public deployment URL need owner approval.",
];

export const githubProfile = links.github;
export const linkedinProfile = `${links.linkedin}/`;
export const email = profile.email;
