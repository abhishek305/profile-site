/**
 * Every piece of portfolio copy in one place, split by the page that uses it.
 *
 * `scripts/prerender.mjs` imports this module too (via esbuild) so the static
 * HTML and the React bundle can never drift apart.
 */
export { projects, projectBySlug } from "./projects";
export { EMPLOYMENT, experience, experienceIntro, resultClaims } from "./experience";
export {
  aboutDefinitions,
  aboutParagraphs,
  contactIntro,
  email,
  githubProfile,
  linkedinProfile,
  repositories,
} from "./profile-text";
export {
  resumeContact,
  resumeHighlights,
  resumeName,
  resumeSummary,
  resumeTitle,
} from "./resume";
