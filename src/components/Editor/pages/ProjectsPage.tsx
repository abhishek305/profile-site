import { projectsData } from "@/data/content";
import { links } from "@/constants/profile";
import { ExternalLinkIcon, GitHubIcon } from "../../icons";

const ProjectsPage = () => (
  <div className="md-content max-w-4xl mx-auto">
    <h1>Projects</h1>
    <p className="gh-section-note">Open-source work. More at <a href={links.github} target="_blank" rel="noopener noreferrer">github.com/abhishek305</a>.</p>

    <div className="project-grid">
      {projectsData.map((project) => (
        <article key={project.name} className="project-card">
          <header className="project-card-header">
            <h3>{project.name}</h3>
          </header>
          {project.highlight && <p className="project-card-highlight font-mono">{project.highlight}</p>}
          <p className="project-card-desc">{project.description}</p>

          <ul className="tech-chips">
            {project.tech.map((tech) => (
              <li key={tech} className="tech-chip font-mono">
                {tech}
              </li>
            ))}
          </ul>

          <div className="project-actions">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-action primary">
                Live demo
                <ExternalLinkIcon />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-action">
                <span className="project-action-icon">
                  <GitHubIcon />
                </span>
                Source
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default ProjectsPage;
