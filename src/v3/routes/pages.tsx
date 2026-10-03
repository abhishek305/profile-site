import type { ReactNode } from "react";
import { PageHead } from "../components/common/PageHead";
import { About } from "../components/sections/About";
import { Code } from "../components/sections/Code";
import { Contact } from "../components/sections/Contact";
import { Experience } from "../components/sections/Experience";
import { Home } from "../components/sections/Home";
import { ProjectChapter } from "../components/sections/ProjectChapter";
import { NotFound } from "../components/sections/NotFound";
import { Resume } from "../components/sections/Resume";
import { projectBySlug, projects } from "../content";
import type { V3Route } from "../routes";

const WorkIndex = () => (
  <>
    <PageHead
      id="work"
      title="Work"
      tagline="Four projects, each with a small playable version of it on the page."
    />
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
  </>
);

interface PageProps {
  route: V3Route;
}

/**
 * Route kind to page. Adding a route is one entry here plus one row in
 * route-data.json, rather than another branch in a growing conditional.
 */
const pages: Record<V3Route["kind"], (props: PageProps) => ReactNode> = {
  home: () => <Home />,

  work: () => <WorkIndex />,

  project: ({ route }) => {
    const project = route.projectSlug ? projectBySlug(route.projectSlug) : undefined;
    if (!project) return <NotFound />;
    return (
      <>
        <PageHead id={project.slug} title={project.title} tagline={project.tagline} />
        <ProjectChapter project={project} standalone />
      </>
    );
  },

  experience: () => (
    <>
      <PageHead
        id="experience"
        title="Experience"
        tagline="Developer platform work at Contentstack, January 2020 to August 2026."
      />
      <Experience standalone />
    </>
  ),

  code: () => (
    <>
      <PageHead
        id="code"
        title="Code on GitHub"
        tagline="Selected open-source work and the projects I would point you to."
      />
      <Code standalone />
    </>
  ),

  about: () => (
    <>
      <PageHead id="about" title="About" tagline="Frontend-heavy, full-stack, and focused on developer platforms." />
      <About standalone />
    </>
  ),

  contact: () => (
    <>
      <PageHead id="contact" title="Contact" tagline="The quickest way to reach me is email." />
      <Contact standalone />
    </>
  ),

  resume: () => <Resume />,
};

/** Renders the active route, or the not-found page for an unknown path. */
export const PageContent = ({ route }: { route: V3Route | undefined }) =>
  route ? pages[route.kind]({ route }) : <NotFound />;
