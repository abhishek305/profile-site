import { identity, links } from "../site";
import { aboutDefinitions, contactIntro, email, githubProfile, linkedinProfile } from "./profile-text";
import { EMPLOYMENT, experience, experienceIntro, resultClaims } from "./experience";

/**
 * Résumé content for /resume.
 *
 * Composed from the same modules as the rest of the site so the two can never
 * disagree. Only the framing specific to a résumé — the summary and the
 * document heading — lives here.
 */

export const resumeSummary = [
  `Senior software engineer with 6.5 years at ${EMPLOYMENT.company}, from marketplace apps and integrations to owning developer platform products end to end. Frontend-heavy but full stack.`,
  "Most recently architected and shipped MCP Profile Hub, a governed MCP server exposing 180+ tools that AI clients such as Claude, Cursor and Codex call. Recent work focuses on making headless platforms safe for AI clients to operate.",
];

/** The heading shown at the top of the résumé, above the name. */
export const resumeTitle = "Senior Software Engineer — GenAI/MCP and developer platforms";

/** Contact line. No phone number: a public page is a scraping target. */
export const resumeContact = [
  { label: "Email", href: `mailto:${email}`, value: email },
  { label: "GitHub", href: githubProfile, value: "github.com/abhishek305" },
  { label: "LinkedIn", href: linkedinProfile, value: "linkedin.com/in/abhishek-ezhava" },
] as const;

export const resumeName = identity.name;

/** A few figures to lead with, rather than all six. */
export const resumeHighlights = resultClaims.slice(0, 4);

export {
  EMPLOYMENT,
  aboutDefinitions,
  contactIntro,
  experience,
  experienceIntro,
  links,
};
