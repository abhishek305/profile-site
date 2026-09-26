import { identity, links } from "../site";
import type { DefinitionItem, Repository } from "../types";

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

export const aboutDefinitions: DefinitionItem[] = [
  {
    label: "Frontend",
    value: "React 19, TypeScript, JavaScript (ES6+), Next.js App Router, Redux Toolkit, HTML5, CSS3, design systems, accessibility.",
  },
  {
    label: "Backend and APIs",
    value: "Node.js, NestJS, REST APIs, JSON-RPC 2.0, MongoDB, Redis, Kafka, OAuth 2.0, Docker.",
  },
  {
    label: "GenAI and MCP",
    value: "MCP servers and tool catalogs, agent tooling, Claude Code, Codex, Mastra.ai.",
  },
  {
    label: "Testing and delivery",
    value: "Jest, Vitest, Playwright, React Testing Library, GitHub Actions, CI/CD, code review, performance optimization.",
  },
  {
    label: "Education",
    value: "Bachelor of Engineering in Information Technology, Theem College of Engineering, Mumbai, 2019.",
  },
  {
    label: "Certifications",
    value: "AWS Certified Cloud Practitioner. Anthropic's Intro to MCP and Claude Code in Action.",
  },
  {
    label: "Recognition",
    value: "Above and Beyond Award at Contentstack, Q1 2023 and Q3 2025.",
  },
];

export const aboutParagraphs = [
  "I am a senior software engineer who owns developer platform products end to end: the React interface, the Node.js and NestJS services, the security and the test automation. My recent work makes headless platforms safe for AI clients to operate.",
  "I care about developer experience, performance and scalable UI patterns, and I mentor colleagues on developer-experience enablement.",
];

export const contactIntro =
  "I am happy to talk about MCP and agent tooling, SDK architecture, React and TypeScript, NestJS and Node.js, and developer platforms. Email is the quickest way to reach me.";

/** Public profile URLs, re-exported so content and components read from one place. */
export const githubProfile = links.github;
export const linkedinProfile = links.linkedin;
export const email = identity.email;
