import { projects } from "../../content";

export const Hero = () => (
  <section className="hero" id="intro" aria-labelledby="intro-heading" tabIndex={-1}>
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
      {projects.map((project) => (
        <li key={project.slug}>
          <a href={`#${project.anchor}`}>
            <b>{project.title}</b>
            <span>{project.highlight}</span>
          </a>
        </li>
      ))}
    </ul>
  </section>
);
