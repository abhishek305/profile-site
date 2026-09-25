import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  aboutDefinitions,
  contactIntro,
  email,
  experience,
  githubProfile,
  linkedinProfile,
  projects,
  repositories,
  resultClaims,
} from "./content";
import { homeSectionIds, normalizePath, routeForPath, type V3Route } from "./routes";
import { copyToClipboard, Receipts, ToastProvider, useToast } from "./components/Stage";
import { LazyStage } from "./components/LazyStage";

const siteUrl = "https://profile-site-navy-pi.vercel.app";

const sectionLabels: Record<(typeof homeSectionIds)[number], string> = {
  intro: "Intro",
  mcp: "MCP Profile Hub",
  "architect-agent": "architect-agent",
  crowdly: "Crowdly",
  latex: "LaTeX Live Editor",
  results: "Results",
  experience: "Experience",
  github: "Code on GitHub",
  about: "About",
  contact: "Contact",
};

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setRouteMeta = (route: V3Route | undefined) => {
  const title = route?.title ?? "Page not found – Abhishek Ezhava";
  const description = route?.description ?? "The requested portfolio page could not be found.";
  const path = route?.path ?? window.location.pathname;
  const canonical = `${siteUrl}${path}`;
  document.title = title;
  upsertMeta('meta[name="description"]', "name", "description", description);
  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[property="og:description"]', "property", "og:description", description);
  upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
  let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalElement) {
    canonicalElement = document.createElement("link");
    canonicalElement.rel = "canonical";
    document.head.appendChild(canonicalElement);
  }
  canonicalElement.href = canonical;
};

const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}<span className="vh"> (opens in a new tab)</span>
  </a>
);

const projectAnchors: Record<string, string> = {
  "mcp-profile-hub": "mcp",
  "architect-agent": "architect-agent",
  crowdly: "crowdly",
  "latex-live-editor": "latex",
};

const DemoStage = ({ kind, disclaimer, eager = false }: { kind: "mcp" | "architect" | "crowdly" | "latex"; disclaimer: string; eager?: boolean }) => <LazyStage kind={kind} disclaimer={disclaimer} eager={eager} />;

const ProjectChapter = ({ project, standalone = false }: { project: (typeof projects)[number]; standalone?: boolean }) => {
  const headingId = `${project.slug}-heading`;
  return (
    <section className={`chapter ${standalone ? "standalone" : ""}`} id={projectAnchors[project.slug] ?? project.slug} aria-labelledby={standalone ? undefined : headingId} aria-label={standalone ? project.title : undefined}>
      <div className="prose">
        {!standalone && <h2 id={headingId}>{project.title}</h2>}
        {!standalone && <p className="tagline">{project.tagline}</p>}
        {project.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <DemoStage kind={project.demo} disclaimer={project.disclaimer} eager={standalone} />
      <p className="note"><b>Try this.</b> {project.tryThis}</p>
      <p className="facts">
        <span className="code">{project.stack.join(" · ")}</span>{" "}
        {project.facts.join(" ")}{" "}
        {project.links.map((link) => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>).reduce<ReactNode[]>((nodes, link, index) => index ? [...nodes, " · ", link] : [link], [])}
        {project.slug === "mcp-profile-hub" && <> Suite breakdown by type: <span className="todo">TODO(owner)</span></>}
      </p>
    </section>
  );
};

const ResultsSection = () => (
  <section className="chapter" id="results" aria-labelledby="results-heading">
    <div className="prose">
      <h2 id="results-heading">Results</h2>
      <p>Six measurable outcomes from my time at Contentstack. Open a row to see what changed.</p>
    </div>
    <Receipts items={resultClaims} />
    <p className="facts">How each figure was measured: <span className="todo">TODO(owner)</span></p>
  </section>
);

const ExperienceSection = ({ standalone = false }: { standalone?: boolean }) => (
  <section className="chapter" id={standalone ? "experience-details" : "experience"} aria-labelledby={standalone ? undefined : "experience-heading"} aria-label={standalone ? "Experience details" : undefined}>
    <div className="prose">
      {!standalone && <h2 id="experience-heading">Experience</h2>}
      <p>Contentstack, January 2020 to August 2026. I started as an application engineer and grew into owning developer platform products end to end.</p>
    </div>
    <ol className="roles">
      {experience.map((role) => (
        <li key={role.title}>
          <div className="role-h"><h3>{role.title}</h3><span>{role.dates}</span></div>
          <ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        </li>
      ))}
    </ol>
  </section>
);

const CodeSection = ({ standalone = false }: { standalone?: boolean }) => (
  <section className="chapter" id={standalone ? "github-details" : "github"} aria-labelledby={standalone ? undefined : "code-heading"} aria-label={standalone ? "Code on GitHub" : undefined}>
    <div className="prose">
      {!standalone && <h2 id="code-heading">Code on GitHub</h2>}
      <p>I have 100+ public repositories at <ExternalLink href={githubProfile}>github.com/abhishek305</ExternalLink>. These four are the ones I would point you to.</p>
    </div>
    <ul className="repos">
      {repositories.map((repository) => (
        <li key={repository.name}>
          <b>{repository.name}</b>
          <p>{repository.description}<span className="stack">{repository.stack}</span></p>
          <span className="lk">{repository.links.map((link) => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>)}</span>
        </li>
      ))}
    </ul>
    <p className="note">Older work: <ExternalLink href="https://github.com/abhishek305/PyBot-A-ChatBot-For-Answering-Python-Queries-Using-NLP">PyBot</ExternalLink>, a chatbot that answers Python questions using NLP, is my most-starred repository at 90+ stars.</p>
    <div className="contact-links"><a className="btn" href="https://github.com/abhishek305?tab=repositories" target="_blank" rel="noopener noreferrer">See all repositories<span className="vh"> (opens in a new tab)</span></a></div>
  </section>
);

const AboutSection = ({ standalone = false }: { standalone?: boolean }) => (
  <section className="chapter" id={standalone ? "about-details" : "about"} aria-labelledby={standalone ? undefined : "about-heading"} aria-label={standalone ? "About" : undefined}>
    <div className="prose">
      {!standalone && <h2 id="about-heading">About</h2>}
      <p>I am a senior software engineer who owns developer platform products end to end: the React interface, the Node.js and NestJS services, the security and the test automation. My recent work makes headless platforms safe for AI clients to operate.</p>
      <p>I care about developer experience, performance and scalable UI patterns, and I mentor colleagues on developer-experience enablement.</p>
    </div>
    <dl className="defs" id="skills">
      {aboutDefinitions.map((item) => <div key={item.label} style={{ display: "contents" }}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
    </dl>
  </section>
);

const ContactSection = ({ standalone = false }: { standalone?: boolean }) => {
  const toast = useToast();
  const copyEmail = async () => {
    const copied = await copyToClipboard(email);
    toast(copied ? "Email copied" : "Copy is not available here");
  };

  return (
    <section className="chapter" id={standalone ? "contact-details" : "contact"} aria-labelledby={standalone ? undefined : "contact-heading"} aria-label={standalone ? "Contact" : undefined}>
      <div className="prose">
        {!standalone && <h2 id="contact-heading">Contact</h2>}
        <p>{contactIntro}</p>
      </div>
      <div className="contact-links">
        <a className="btn primary" href={`mailto:${email}?subject=Hello%20from%20your%20portfolio`}>Email me</a>
        <button className="btn" type="button" onClick={copyEmail}>Copy email address</button>
        <ExternalLink href={githubProfile}><span className="btn">GitHub</span></ExternalLink>
        <ExternalLink href={linkedinProfile}><span className="btn">LinkedIn</span></ExternalLink>
      </div>
    </section>
  );
};

const HomePage = () => (
  <>
    <section className="hero" id="intro" aria-labelledby="intro-heading">
      <h1 id="intro-heading">I build the platforms that AI clients plug into.</h1>
      <p className="lede">Senior software engineer with 6.5 years at Contentstack. I built MCP Profile Hub, a production MCP server with 180+ tools that AI clients like Claude, Cursor and Codex use. Four projects are playable below.</p>
      <div className="cta">
        <a className="btn primary" href="#mcp">Try the demos</a>
        <a className="btn" href="#experience">See my experience</a>
        <a className="btn" href="#contact">Get in touch</a>
      </div>
      <ul className="index" aria-label="What you can play with">
        <li><a href="#mcp"><b>MCP Profile Hub</b><span>Break a tool call and see what the AI model gets back.</span></a></li>
        <li><a href="#architect-agent"><b>architect-agent</b><span>Edit a product spec and watch the backlog rewrite itself.</span></a></li>
        <li><a href="#crowdly"><b>Crowdly</b><span>Set rules for an audience segment and see who is in it.</span></a></li>
        <li><a href="#latex"><b>LaTeX Live Editor</b><span>Type LaTeX on the left, read the page on the right.</span></a></li>
      </ul>
    </section>
    {projects.map((project) => <ProjectChapter key={project.slug} project={project} />)}
    <ResultsSection />
    <ExperienceSection />
    <CodeSection />
    <AboutSection />
    <ContactSection />
  </>
);

const WorkIndexPage = () => (
  <section className="page-head" aria-labelledby="work-heading">
    <h1 id="work-heading">Work</h1>
    <p className="tagline">Four projects, each with a small playable version of it on the page.</p>
    <ul className="index" aria-label="Project chapters">
      {projects.map((project) => <li key={project.slug}><a href={`/work/${project.slug}`}><b>{project.title}</b><span>{project.tagline}</span></a></li>)}
    </ul>
  </section>
);

const StandaloneProjectPage = ({ project }: { project: (typeof projects)[number] }) => (
  <section className="page-head" aria-labelledby={`${project.slug}-page-heading`}>
    <h1 id={`${project.slug}-page-heading`}>{project.title}</h1>
    <p className="tagline">{project.tagline}</p>
  </section>
);

const ExperiencePage = () => <section className="page-head" aria-labelledby="experience-page-heading"><h1 id="experience-page-heading">Experience</h1><p className="tagline">Developer platform work at Contentstack, January 2020 to August 2026.</p></section>;
const CodePage = () => <section className="page-head" aria-labelledby="code-page-heading"><h1 id="code-page-heading">Code on GitHub</h1><p className="tagline">Selected open-source work and the projects I would point you to.</p></section>;
const AboutPage = () => <section className="page-head" aria-labelledby="about-page-heading"><h1 id="about-page-heading">About</h1><p className="tagline">Frontend-heavy, full-stack, and focused on developer platforms.</p></section>;
const ContactPage = () => <section className="page-head" aria-labelledby="contact-page-heading"><h1 id="contact-page-heading">Contact</h1><p className="tagline">The quickest way to reach me is email.</p></section>;

const Rail = () => {
  const [active, setActive] = useState<string>("intro");
  useEffect(() => {
    const sections = homeSectionIds.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="rail" aria-label="Sections on this page">
      <ol>
        {homeSectionIds.map((id) => <li key={id}><a href={`#${id}`} aria-current={active === id ? "true" : undefined}>{sectionLabels[id]}</a></li>)}
      </ol>
    </nav>
  );
};

const TopBar = ({ theme, onThemeChange }: { theme: "light" | "dark"; onThemeChange: () => void }) => (
  <header className="top">
    <div className="top-in">
      <a className="brand" href="/">Abhishek Ezhava</a>
      <nav aria-label="Primary">
        <a href="/#mcp">Demos</a>
        <a href="/experience">Experience</a>
        <a href="/code">Code</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <button className="themebtn" type="button" onClick={onThemeChange}>{theme === "dark" ? "Light theme" : "Dark theme"}</button>
      </nav>
    </div>
    <ProgressLine />
  </header>
);

const ProgressLine = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <span id="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
};

const Footer = () => (
  <footer className="v3-footer">
    <div className="foot-in">
      Last updated September 21, 2026. Design prototype: demos use stand-in logic and fictional data.
    </div>
  </footer>
);

const PageContent = ({ route }: { route: V3Route }) => {
  if (route.kind === "home") return <HomePage />;
  if (route.kind === "work") return <WorkIndexPage />;
  if (route.kind === "project") {
    const project = projects.find((item) => item.slug === route.projectSlug);
    return project ? <><StandaloneProjectPage project={project} /><ProjectChapter project={project} standalone /></> : <NotFound />;
  }
  if (route.kind === "experience") return <><ExperiencePage /><ExperienceSection standalone /></>;
  if (route.kind === "code") return <><CodePage /><CodeSection standalone /></>;
  if (route.kind === "about") return <><AboutPage /><AboutSection standalone /></>;
  return <><ContactPage /><ContactSection standalone /></>;
};

const NotFound = () => (
  <section className="not-found" aria-labelledby="not-found-heading">
    <h1 id="not-found-heading">That page is not here.</h1>
    <p>The link may be old, or the page may have moved.</p>
    <a className="btn primary" href="/">Go to the home page</a>
  </section>
);

const V3App = () => {
  const path = normalizePath(window.location.pathname);
  const route = useMemo(() => routeForPath(path), [path]);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("portfolio-v3-theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // Storage is optional.
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.site = "v3";
    document.body.dataset.site = "v3";
    return () => {
      delete document.documentElement.dataset.site;
      delete document.body.dataset.site;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("portfolio-v3-theme", theme);
    } catch {
      // Storage is optional.
    }
  }, [theme]);

  useEffect(() => setRouteMeta(route), [route]);

  return (
    <ToastProvider>
      <div className="v3-app">
        <a className="skip" href="#main">Skip to content</a>
        <TopBar theme={theme} onThemeChange={() => setTheme((current) => current === "dark" ? "light" : "dark")} />
        <div className={`layout ${route?.kind === "home" ? "" : "deep-layout"}`}>
          {route?.kind === "home" && <Rail />}
          <main id="main">
            {route ? <PageContent route={route} /> : <NotFound />}
          </main>
        </div>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default V3App;
