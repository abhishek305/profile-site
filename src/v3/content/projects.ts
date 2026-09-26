import type { Project } from "../types";

/**
 * The four playable chapters, in the order they appear on the home page.
 *
 * `demo` selects the stage component; `anchor` is the home-page section id
 * the section rail and `#hash` links target.
 */
export const projects: Project[] = [
  {
    slug: "mcp-profile-hub",
    title: "MCP Profile Hub",
    navLabel: "MCP Profile Hub",
    anchor: "mcp",
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
    highlight: "Break a tool call and see what the AI model gets back.",
  },
  {
    slug: "architect-agent",
    title: "architect-agent",
    navLabel: "architect-agent",
    anchor: "architect-agent",
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
    highlight: "Edit a product spec and watch the backlog rewrite itself.",
  },
  {
    slug: "crowdly",
    title: "Crowdly",
    navLabel: "Crowdly",
    anchor: "crowdly",
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
    highlight: "Set rules for an audience segment and see who is in it.",
  },
  {
    slug: "latex-live-editor",
    title: "LaTeX Live Editor",
    navLabel: "LaTeX Live Editor",
    anchor: "latex",
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
    highlight: "Type LaTeX on the left, read the page on the right.",
  },
];

/** Look up a project chapter by its route slug. */
export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
