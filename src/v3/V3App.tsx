import { useMemo } from "react";
import {
  aboutDefinitions,
  aboutParagraphs,
  contactIntro,
  email,
  experience,
  githubProfile,
  linkedinProfile,
  projectBySlug,
  projects,
  repositories,
  resultClaims,
} from "./content";
import { useCopyAction } from "./hooks/useCopyAction";
import { useRouteMeta } from "./hooks/useRouteMeta";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useSectionSpy } from "./hooks/useSectionSpy";
import { useTheme } from "./hooks/useTheme";
import { homeSectionIds, homeSectionLabels, normalizePath, routeForPath, type V3Route } from "./routes";
import { Receipts } from "./components/Stage";
import { ToastProvider } from "./components/ui/Toast";
import { LazyStage } from "./components/LazyStage";
import type { Project } from "./types";

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
    <span className="vh"> (opens in a new tab)</span>
  </a>
);

const ProjectChapter = ({ project, standalone = false }: { project: Project; standalone?: boolean }) => {
  const headingId = `${project.slug}-heading`;
  return (
    <section
      className={`chapter ${standalone ? "standalone" : ""}`}
      id={project.anchor}
      aria-labelledby={standalone ? undefined : headingId}
      aria-label={standalone ? project.title : undefined}
    >
      <div className="prose">
        {!standalone && <h2 id={headingId}>{project.title}</h2>}
        {!standalone && <p className="tagline">{project.tagline}</p>}
        {project.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <LazyStage kind={project.demo} disclaimer={project.disclaimer} eager={standalone} />
      <p className="note">
        <b>Try this.</b> {project.tryThis}
      </p>
      <p className="facts">
        <span className="code">{project.stack.join(" · ")}</span>{" "}
        {project.facts.join(" ")}{" "}
        {project.links.map((link) => (
          <ExternalLink key={link.href} href={link.href}>
            {link.label}
          </ExternalLink>
        ))}
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
  </section>
);

const ExperienceSection = ({ standalone = false }: { standalone?: boolean }) => (
  <section
    className="chapter"
    id={standalone ? "experience-details" : "experience"}
    aria-labelledby={standalone ? undefined : "experience-heading"}
    aria-label={standalone ? "Experience details" : undefined}
  >
    <div className="prose">
      {!standalone && <h2 id="experience-heading">Experience</h2>}
      <p>
        Contentstack, January 2020 to August 2026. I started as an application engineer and grew into owning
        developer platform products end to end.
      </p>
    </div>
    <ol className="roles">
      {experience.map((role) => (
        <li key={role.title}>
          <div className="role-h">
            <h3>{role.title}</h3>
            <span>{role.dates}</span>
          </div>
          <ul>
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </section>
);

const CodeSection = ({ standalone = false }: { standalone?: boolean }) => (
  <section
    className="chapter"
    id={standalone ? "github-details" : "github"}
    aria-labelledby={standalone ? undefined : "code-heading"}
    aria-label={standalone ? "Code on GitHub" : undefined}
  >
    <div className="prose">
      {!standalone && <h2 id="code-heading">Code on GitHub</h2>}
      <p>
        I have 100+ public repositories at{" "}
        <ExternalLink href={githubProfile}>github.com/abhishek305</ExternalLink>. These four are the ones I
        would point you to.
      </p>
    </div>
    <ul className="repos">
      {repositories.map((repository) => (
        <li key={repository.name}>
          <b>{repository.name}</b>
          <p>
            {repository.description}
            <span className="stack">{repository.stack}</span>
          </p>
          <span className="lk">
            {repository.links.map((link) => (
              <ExternalLink key={link.href} href={link.href}>
                {link.label}
              </ExternalLink>
            ))}
          </span>
        </li>
      ))}
    </ul>
    <p className="note">
      Older work:{" "}
      <ExternalLink href="https://github.com/abhishek305/PyBot-A-ChatBot-For-Answering-Python-Queries-Using-NLP">
        PyBot
      </ExternalLink>
      , a chatbot that answers Python questions using NLP, is my most-starred repository at 90+ stars.
    </p>
    <div className="contact-links">
      <a className="btn" href="https://github.com/abhishek305?tab=repositories" target="_blank" rel="noopener noreferrer">
        See all repositories
        <span className="vh"> (opens in a new tab)</span>
      </a>
    </div>
  </section>
);

const AboutSection = ({ standalone = false }: { standalone?: boolean }) => (
  <section
    className="chapter"
    id={standalone ? "about-details" : "about"}
    aria-labelledby={standalone ? undefined : "about-heading"}
    aria-label={standalone ? "About" : undefined}
  >
    <div className="prose">
      {!standalone && <h2 id="about-heading">About</h2>}
      {aboutParagraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
    <dl className="defs" id="skills">
      {aboutDefinitions.map((item) => (
        <div key={item.label} style={{ display: "contents" }}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

const ContactSection = ({ standalone = false }: { standalone?: boolean }) => {
  const { copy } = useCopyAction(email, "Email copied");

  return (
    <section
      className="chapter"
      id={standalone ? "contact-details" : "contact"}
      aria-labelledby={standalone ? undefined : "contact-heading"}
      aria-label={standalone ? "Contact" : undefined}
    >
      <div className="prose">
        {!standalone && <h2 id="contact-heading">Contact</h2>}
        <p>{contactIntro}</p>
      </div>
      <div className="contact-links">
        <a className="btn primary" href={`mailto:${email}?subject=Hello%20from%20your%20portfolio`}>
          Email me
        </a>
        <button className="btn" type="button" onClick={copy}>
          Copy email address
        </button>
        <a className="btn" href={githubProfile} target="_blank" rel="noopener noreferrer">
          GitHub
          <span className="vh"> (opens in a new tab)</span>
        </a>
        <a className="btn" href={linkedinProfile} target="_blank" rel="noopener noreferrer">
          LinkedIn
          <span className="vh"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
};

const HomePage = () => (
  <>
    <section className="hero" id="intro" aria-labelledby="intro-heading">
      <h1 id="intro-heading">I build the platforms that AI clients plug into.</h1>
      <p className="lede">
        Senior software engineer with 6.5 years at Contentstack. I built MCP Profile Hub, a production MCP
        server with 180+ tools that AI clients like Claude, Cursor and Codex use. Four projects are playable
        below.
      </p>
      <div className="cta">
        <a className="btn primary" href="#mcp">
          Try the demos
        </a>
        <a className="btn" href="#experience">
          See my experience
        </a>
        <a className="btn" href="#contact">
          Get in touch
        </a>
      </div>
      <ul className="index" aria-label="What you can play with">
        <li>
          <a href="#mcp">
            <b>MCP Profile Hub</b>
            <span>Break a tool call and see what the AI model gets back.</span>
          </a>
        </li>
        <li>
          <a href="#architect-agent">
            <b>architect-agent</b>
            <span>Edit a product spec and watch the backlog rewrite itself.</span>
          </a>
        </li>
        <li>
          <a href="#crowdly">
            <b>Crowdly</b>
            <span>Set rules for an audience segment and see who is in it.</span>
          </a>
        </li>
        <li>
          <a href="#latex">
            <b>LaTeX Live Editor</b>
            <span>Type LaTeX on the left, read the page on the right.</span>
          </a>
        </li>
      </ul>
    </section>
    {projects.map((project) => (
      <ProjectChapter key={project.slug} project={project} />
    ))}
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
      {projects.map((project) => (
        <li key={project.slug}>
          <a href={`/work/${project.slug}`}>
            <b>{project.title}</b>
            <span>{project.tagline}</span>
          </a>
        </li>
      ))}
    </ul>
  </section>
);

const StandaloneProjectPage = ({ project }: { project: Project }) => (
  <section className="page-head" aria-labelledby={`${project.slug}-page-heading`}>
    <h1 id={`${project.slug}-page-heading`}>{project.title}</h1>
    <p className="tagline">{project.tagline}</p>
  </section>
);

const PageHead = ({ id, title, tagline }: { id: string; title: string; tagline: string }) => (
  <section className="page-head" aria-labelledby={`${id}-page-heading`}>
    <h1 id={`${id}-page-heading`}>{title}</h1>
    <p className="tagline">{tagline}</p>
  </section>
);

const ProgressLine = () => {
  const progress = useScrollProgress();
  return <span id="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
};

const NotFound = () => (
  <section className="not-found" aria-labelledby="not-found-heading">
    <h1 id="not-found-heading">That page is not here.</h1>
    <p>The link may be old, or the page may have moved.</p>
    <a className="btn primary" href="/">
      Go to the home page
    </a>
  </section>
);

const PageContent = ({ route }: { route: V3Route }) => {
  if (route.kind === "home") return <HomePage />;
  if (route.kind === "work") return <WorkIndexPage />;
  if (route.kind === "project") {
    const project = route.projectSlug ? projectBySlug(route.projectSlug) : undefined;
    return project ? (
      <>
        <StandaloneProjectPage project={project} />
        <ProjectChapter project={project} standalone />
      </>
    ) : (
      <NotFound />
    );
  }
  if (route.kind === "experience") {
    return (
      <>
        <PageHead
          id="experience"
          title="Experience"
          tagline="Developer platform work at Contentstack, January 2020 to August 2026."
        />
        <ExperienceSection standalone />
      </>
    );
  }
  if (route.kind === "code") {
    return (
      <>
        <PageHead id="code" title="Code on GitHub" tagline="Selected open-source work and the projects I would point you to." />
        <CodeSection standalone />
      </>
    );
  }
  if (route.kind === "about") {
    return (
      <>
        <PageHead id="about" title="About" tagline="Frontend-heavy, full-stack, and focused on developer platforms." />
        <AboutSection standalone />
      </>
    );
  }
  return (
    <>
      <PageHead id="contact" title="Contact" tagline="The quickest way to reach me is email." />
      <ContactSection standalone />
    </>
  );
};

export default V3App;

function V3App() {
  const path = normalizePath(window.location.pathname);
  const route = useMemo(() => routeForPath(path), [path]);
  const { theme, toggleTheme } = useTheme();
  const activeSection = useSectionSpy(homeSectionIds, route?.kind === "home");

  useRouteMeta(route);

  return (
    <ToastProvider>
      <div className="v3-app">
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="top">
          <div className="top-in">
            <a className="brand" href="/">
              Abhishek Ezhava
            </a>
            <nav aria-label="Primary">
              <a href="/#mcp">Demos</a>
              <a href="/experience">Experience</a>
              <a href="/code">Code</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <button className="themebtn" type="button" onClick={toggleTheme}>
                {theme === "dark" ? "Light theme" : "Dark theme"}
              </button>
            </nav>
          </div>
          <ProgressLine />
        </header>
        <div className={`layout ${route?.kind === "home" ? "" : "deep-layout"}`}>
          {route?.kind === "home" && (
            <nav className="rail" aria-label="Sections on this page">
              <ol>
                {homeSectionIds.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} aria-current={activeSection === id ? "true" : undefined}>
                      {homeSectionLabels[id]}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <main id="main">{route ? <PageContent route={route} /> : <NotFound />}</main>
        </div>
        <footer className="v3-footer">
          <div className="foot-in">
            Last updated September 21, 2026. Design prototype: demos use stand-in logic and fictional data.
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
