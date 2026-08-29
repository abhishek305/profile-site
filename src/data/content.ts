import { links, profile } from "@/constants/profile";
import type { ExperienceData, Project, SkillCategory } from "@/types";

/**
 * All portfolio content lives here, mirroring the résumé. Add a new role, skill
 * category or project by appending to one of these arrays — nothing else changes.
 */

export const skillsData: SkillCategory[] = [
  {
    category: "Frontend",
    id: "frontend",
    skills: ["React 19", "TypeScript", "JavaScript (ES6+)", "Next.js (App Router)", "Redux", "HTML5", "CSS3", "Storybook", "Accessibility"],
  },
  {
    category: "Backend & APIs",
    id: "backend",
    skills: ["Node.js", "NestJS", "REST", "JSON-RPC 2.0", "MongoDB", "Redis", "Kafka", "OAuth 2.0", "Docker"],
  },
  {
    category: "AI & MCP",
    id: "ai",
    skills: ["Model Context Protocol (MCP)", "MCP servers & tool catalogs", "Agent tooling", "Claude Code", "Cursor", "Mastra.ai", "Anthropic", "OpenAI"],
  },
  {
    category: "Testing & Delivery",
    id: "testing",
    skills: ["Jest", "Vitest", "Playwright", "React Testing Library", "GitHub Actions", "CI/CD", "Agile/Scrum", "Code Review", "Performance Optimization"],
  },
];

export const experienceData: ExperienceData[] = [
  {
    role: "Senior Software Engineer I",
    company: "Contentstack — Hybrid",
    date: "Feb 2024 - Present",
    current: true,
    tech: ["React", "TypeScript", "NestJS", "MCP", "OAuth 2.0", "Kafka", "Playwright"],
    highlights: [
      "Built and shipped MCP Profile Hub, Contentstack's MCP server for AI clients like Claude and Cursor. Replaced hand-written Management API scripts with scoped, reusable tool profiles spanning 10 hosted catalogs, 180+ tools and 28 prebuilt system profiles, then opened it further so a customer's own Automate automations and Agent OS agents become callable tools — turning agent runs into deterministic, audited workflows. Profiles export and import as JSON and load straight from the MCP URL, secured with OAuth 2.0 PKCE, encrypted-at-rest tokens, rate limiting and server-side plan entitlements, backed by 66 test suites.",
      "Delivered Phase 2 of Contentstack's App MCP Server (a separate product for app developers): Hub-aligned manifest generation, stack vs. organization location parity, and a multi-region Developer Hub API client with Vitest-backed validation.",
      "Earlier in the role: schema-aware validation for App Extensions across nested field types, cutting validation errors by 40%, and event-driven metadata batching that removed redundant requests and improved extension load time by 25%.",
      "Automated system-app version rollout using NestJS, Kafka and CloudEvents, reducing manual maintenance by 40%; extended Playwright E2E coverage with Slack alerting, cutting regressions by 15%.",
    ],
  },
  {
    role: "Software Engineer II",
    company: "Contentstack — Remote/Hybrid",
    date: "Feb 2022 - Feb 2024",
    tech: ["React", "Redux", "React Query", "Node.js", "Babel", "GatsbyJS", "TypeScript"],
    highlights: [
      "Built and maintained the Node.js + Babel source plugin for GatsbyJS, improving content-sourcing performance by 30% for teams building static sites on Contentstack.",
      "Shipped app version-control workflows (React, Redux, React Query) giving developers rollback, restore and version-based manifest previews instead of one-way, irreversible app updates.",
      "Extended the App SDK with full TypeScript support and resolved Snyk-flagged vulnerabilities, improving adoption and platform compliance.",
    ],
  },
  {
    role: "Application Engineer",
    company: "Contentstack",
    date: "Jan 2020 - Feb 2022",
    tech: ["React", "TypeScript", "Express", "Nunjucks", "Zapier"],
    highlights: [
      "Migrated the marketing website from Express/Nunjucks to React, achieving 40% faster load times and a 92+ Lighthouse score.",
      "Built Zapier integrations connecting Contentstack APIs with 15+ tools (Slack, Jira, Google Sheets) and marketplace apps (OCR, JSON Editor, commercetools) in React and TypeScript.",
    ],
  },
];

export const projectsData: Project[] = [
  {
    name: "architect-agent",
    description:
      "Multi-agent documentation toolkit built on Mastra.ai that interviews you as a Senior PM or Principal Engineer and generates PRDs, TDRs, user stories and Jira-ready CSVs. SQLite conversation memory, CI/CD mode, multi-provider LLM support.",
    tech: ["TypeScript", "Node.js", "Mastra.ai", "LLM tooling"],
    link: `${links.github}/architect-agent`,
    highlight: "Spec-to-backlog, automated",
  },
  {
    name: "Crowdly",
    description:
      "Live event discovery and booking platform on Contentstack's composable DXP, with Lytics CDP segmentation across 14 segments and Automate-driven booking workflows.",
    tech: ["React 19", "TypeScript", "Zod", "Vite"],
    link: `${links.github}/crowdly`,
    demo: "https://crowdly.contentstackapps.com",
    highlight: "14 CDP segments, live",
  },
  {
    name: "LaTeX Live Editor",
    description: "Browser-based LaTeX editor running a WebAssembly TeX engine, so documents compile entirely client-side with no server round-trip.",
    tech: ["TypeScript", "WebAssembly", "LaTeX"],
    link: `${links.github}/latex-live-editor`,
    highlight: "Client-side TeX compilation",
  },
  {
    name: "DotPath",
    description: "Debugging utility for nested object paths — resolve, inspect and trace deep property access without hand-writing optional chains.",
    tech: ["TypeScript"],
    link: `${links.github}/DotPath`,
    demo: "https://dotpath-pied.vercel.app",
    highlight: "Developer tooling",
  },
];

/** Headline numbers, surfaced on the README page. */
export const impactStats = [
  { value: "180+", label: "MCP tools shipped" },
  { value: "6.5 yrs", label: "at Contentstack" },
  { value: "66", label: "test suites on Profile Hub" },
  { value: "40%", label: "fewer validation errors" },
];

export const homeMarkdown = `
  <div class="hero">
    <div class="hero-avatar" aria-hidden="true">AE</div>
    <div class="hero-text">
      <h1>${profile.name}</h1>
      <p class="hero-title">${profile.title} — ${profile.focus}</p>
      <p class="hero-links">
        <a href="${links.email}">${profile.email}</a>
        <span aria-hidden="true">·</span>
        <a href="${links.github}" target="_blank" rel="noopener noreferrer">github.com/${profile.githubUser}</a>
        <span aria-hidden="true">·</span>
        <a href="${links.linkedin}" target="_blank" rel="noopener noreferrer">linkedin.com/in/${profile.linkedinUser}</a>
      </p>
    </div>
  </div>

  <blockquote>${profile.summary}</blockquote>

  <h2>What I work on</h2>
  <ul>
      <li><strong>MCP &amp; agent platforms</strong> — production MCP servers, tool catalogs and agent integrations that AI clients use against real customer data.</li>
      <li><strong>Developer experience</strong> — SDKs, plugins and tooling other engineers build on.</li>
      <li><strong>Frontend at depth</strong> — React 19, Next.js App Router, TypeScript, accessibility.</li>
      <li><strong>Event-driven backends</strong> — NestJS, Kafka, CloudEvents, OAuth 2.0.</li>
  </ul>
`;

export const aboutMarkdown = `
  <h1>About Me</h1>
  <p>I'm a Senior Software Engineer with 6.5 years at Contentstack, where I've moved from building marketplace apps and integrations to owning developer platform products end to end. I'm frontend-heavy but full-stack, and most of what I build is for other developers — SDKs, plugins, and the tools they assemble their own work from.</p>
  <br>
  <p>Lately that means AI clients. I built <strong>MCP Profile Hub</strong>, Contentstack's Model Context Protocol server for clients like Claude and Cursor, which turns hand-written Management API scripts into scoped, reusable tool profiles — 10 hosted catalogs, 180+ tools, and 28 prebuilt system profiles. It goes further than a static catalog: a customer's own Automate automations and Agent OS agents become callable tools, so agent runs become deterministic, audited workflows.</p>

  <h2>AI &amp; Innovation</h2>
  <ul>
      <li><strong>Ship MCP end to end</strong> — authored production MCP servers, tool catalogs and agent integrations that AI clients use against real customer data, including the Agent OS bridge that makes agents first-class MCP tools.</li>
      <li><strong>Use AI in daily delivery</strong> — Claude Code and Cursor for refactors, test generation and documentation, and the Jira MCP integration for bulk ticket creation and spec-to-backlog handoff.</li>
  </ul>

  <h2>Education</h2>
  <p><strong>Bachelor of Engineering, Information Technology</strong><br>
  Theem College of Engineering, Mumbai — 2019</p>

  <h2>Certifications &amp; Awards</h2>
  <ul>
      <li>AWS Certified Cloud Practitioner</li>
      <li>Certified in AI-assisted workflows (MCP, Claude Code)</li>
      <li><strong>Above &amp; Beyond Award</strong>, Contentstack — Q1 2023 and Q3 2025</li>
  </ul>
`;
