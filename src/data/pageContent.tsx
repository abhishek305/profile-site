import type { PageContent, ExperienceData, SkillCategory } from "@/types";

const skillsData: SkillCategory[] = [
  {
    category: "Frontend",
    id: "frontend",
    skills: ["React.js", "TypeScript", "JavaScript (ES6+)", "HTML5/CSS3", "Storybook", "Figma", "Web APIs"],
  },
  {
    category: "Backend",
    id: "backend",
    skills: ["Node.js", "Nest.JS", "Kafka", "REST APIs", "Cloud Events"],
  },
  {
    category: "Testing & DevOps",
    id: "testing",
    skills: ["GoCD", "Playwright", "React Testing Library", "GitHub Actions", "CI/CD", "Visual Regression Testing"],
  },
  {
    category: "Architecture",
    id: "architecture",
    skills: ["Design Systems", "SDK Development", "Event-driven Design", "Performance Optimization"],
  },
  {
    category: "AI & Automation",
    id: "ai",
    skills: ["Cursor IDE", "Gemini", "Claude", "GPT", "MCP"],
  },
  {
    category: "Collaboration",
    id: "collaboration",
    skills: ["Agile/Scrum", "Code Reviews", "Cross-functional Delivery", "Mentorship"],
  },
];

const experienceData: ExperienceData[] = [
  {
    role: "Senior Software Engineer I",
    company: "Contentstack (Hybrid)",
    date: "Feb 2024 - Present",
    highlights: ["Architected a schema-aware validation and data resolution system for App SDK supporting 8+ field types with recursive validation, reducing schema errors by 40%.", "Developed an event-driven system to handle metadata efficiently, batching API requests to avoid redundant calls and speed up extension loading by 25%.", "Led the design and delivery of global full-page location in Developer Hub, enabling cross-org app creation, publishing, and collaborative workflows via App-SDK and modular UI.", "Built an automated app update framework using Nest.JS, Kafka, and Cloud Events streamlined version rollouts and removed 40% of manual maintenance overhead.", "Established SDK validation and component architecture best practices mentored junior engineers to improve test coverage and delivery consistency.", "Enhanced the Playwright-based E2E testing framework with Slack alert integration, reducing regressions by 15% and increasing release throughput by 20% through faster failure monitoring and resolution."],
  },
  {
    role: "Software Engineer II",
    company: "Contentstack (Remote/Hybrid)",
    date: "Feb 2022 - Feb 2024",
    highlights: ["Maintained and enhanced Node.js + Babel plugin for GatsbyJS, improving developer onboarding time and query performance by 30%.", "Implemented version control workflows (React + Redux + React Query) for app manifests, enabling rollback, restore, and release visualization across environments.", "Led cross-product integrations for hosting and marketplace apps, ensuring alignment with UI and platform standards.", "Addressed Snyk-reported security vulnerabilities and introduced automated validation pipelines, strengthening compliance and release stability.", "Enhanced AppSDK TypeScript support and developer tooling, boosting adoption and reducing onboarding time by 20%."],
  },
  {
    role: "Application Engineer",
    company: "Contentstack",
    date: "Jan 2020 - Feb 2022",
    highlights: ["Developed Zapier integrations connecting Contentstack APIs with 15+ third-party platforms (Slack, JIRA, Google Sheets) to automate workflows.", "Migrated marketing site from Express/Nunjucks to React, improving page load performance by 40% and achieving 92+ Lighthouse scores across SEO and Accessibility.", "Built marketplace apps (OCR, JSON Editor, Commercetools integration) in React + TypeScript with Playwright E2E tests, cutting manual QA time by 50%."],
  },
];

export const pageContent: Record<string, PageContent> = {
  welcome: {
    title: "Welcome",
    type: "markdown",
    content: "welcome", // Special flag for Welcome component
  },
  home: {
    title: "README.md",
    type: "markdown",
    content: `
      <img src="https://placehold.co/100x100/718096/E2E8F0?text=AE" alt="Abhishek Ezhava" style="border-radius: 50%; float: left; margin-right: 1.5rem; margin-bottom: 0.5rem; border: 2px solid var(--md-border); width: 100px; height: 100px;">
      <h1 style="margin-top: 0;">Abhishek Ezhava</h1>
      <p class="text-lg" style="color: var(--text-color); margin-top: -0.5rem; margin-bottom: 1.5rem;">Senior Software Engineer I</p>
      <div style="clear: both;"></div> 
      
      <blockquote>
          Senior Software Engineer with 6 years of experience building scalable web applications, SDKs, and developer tools using React, TypeScript, and Node.js. Experienced in creating event-driven systems, integrating Al into workflows, and improving developer productivity through automation and reusable components.
      </blockquote>
      
      <h2>Key Focus Areas</h2>
      <ul>
          <li>Developer Experience (DX) & Tooling</li>
          <li>Scalable Systems & Event-Driven Architecture</li>
          <li>SDK Development</li>
          <li>AI-driven Automation & Integration</li>
      </ul>

      <h2>Contact</h2>
      <ul>
          <li><strong>Email:</strong> abhishekshaji1994@gmail.com</li>
          <li><strong>GitHub:</strong> <a href="https://github.com/abhishek-ezhava" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">github.com/abhishek-ezhava</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/abhishek-ezhava" target="_blank" style="color: var(--accent-blue); text-decoration: underline;">linkedin.com/in/abhishek-ezhava</a></li>
      </ul>
    `,
  },
  about: {
    title: "abhishek.md",
    type: "markdown",
    content: `
      <h1>About Me</h1>
      <p>I'm a Senior Software Engineer with 6 years of experience building and scaling web applications, SDKs, and developer tools. My passion lies at the intersection of developer productivity and system design—I create the tools and platforms that help other developers succeed.</p>
      <br>
      <p>At Contentstack, I've architected event-driven systems with Nest.JS and Kafka, built schema-aware validation for our App SDK, and led integrations that enhance developer workflows. I'm experienced in both the frontend (React, TypeScript) and backend (Node.js), and I'm always looking for ways to improve performance, automation, and stability.</p>
      <br>
      <h2>AI & Innovation</h2>
      <p>I'm deeply interested in the practical application of AI in software development and am certified in "Intro to MCP" and "Claude Code in Action" by Anthropic. I actively use tools like Cursor IDE, Gemini, and GPT for code refactoring, documentation generation, and test scaffolding to accelerate release timelines. I've also contributed to the Contentstack MCP Server, enabling AI agents to autonomously scaffold and manage apps in our Developer Hub.</p>
    
      <h2>Education</h2>
      <p><strong>B.E. in Information Technology</strong><br>
      Theem College of Engineering, Mumbai, Maharashtra (Graduated: 2019)</p>

      <h2>Awards & Certifications</h2>
      <ul>
          <li><strong>Above & Beyond (Q1 2023, Q3 2025):</strong> Recognized for critical platform releases and innovation leadership.</li>
          <li><strong>AWS Certified Cloud Practitioner</strong></li>
      </ul>
    `,
  },
  skills: {
    title: "skills.ts",
    type: "custom_skills",
    data: skillsData,
  },
  experience: {
    title: "experience.json",
    type: "custom",
    data: experienceData,
  },
  github: {
    title: "github_stats.md",
    type: "markdown",
    content: "github", // Special flag for GitHub component
  },
};
