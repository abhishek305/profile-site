/**
 * Single source of truth for identity. This file exists because the username was
 * previously hardcoded in five places with three different (mostly wrong) values.
 *
 * Note: the résumé also carries a personal phone number. It is deliberately NOT
 * here — a public portfolio page is a scraping target. Add it only if you want it
 * indexed.
 */
export const profile = {
  name: 'Abhishek Ezhava',
  title: 'Senior Software Engineer',
  focus: 'Frontend & AI/Developer Platforms',
  githubUser: 'abhishek305',
  linkedinUser: 'abhishek-ezhava',
  email: 'abhishekshaji1994@gmail.com',
  summary:
    "Senior Software Engineer, 6.5 years at Contentstack — from marketplace apps and integrations to owning developer platform products end to end. Frontend-heavy but full-stack: React, Next.js, TypeScript, Node.js, NestJS, and the developer-experience SDKs, plugins and tools other engineers build on — most recently for AI clients.",
};

export const links = {
  github: `https://github.com/${profile.githubUser}`,
  linkedin: `https://linkedin.com/in/${profile.linkedinUser}`,
  email: `mailto:${profile.email}`,
};
