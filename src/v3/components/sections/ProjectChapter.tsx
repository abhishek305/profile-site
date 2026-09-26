import { LazyStage } from "../layout/LazyStage";
import { LinkList } from "../common/LinkList";
import { Section } from "../common/Section";
import type { Project } from "../../types";

/**
 * A project chapter: the written case study followed by its playable stage.
 *
 * On the home page this carries its own `h2`. On `/work/:slug` the page head
 * above it already provides the `h1`, so the heading is dropped and the
 * section is named by its label instead.
 */
export const ProjectChapter = ({ project, standalone = false }: { project: Project; standalone?: boolean }) => (
  <Section
    id={standalone ? `${project.slug}-chapter` : project.anchor}
    className={`chapter ${standalone ? "standalone" : ""}`}
    title={standalone ? undefined : project.title}
    label={standalone ? project.title : undefined}
  >
    <div className="prose">
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
      {project.facts.join(" ")} <LinkList links={project.links} />
    </p>
  </Section>
);
