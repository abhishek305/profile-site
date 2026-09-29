import { About } from "./About";
import { Code } from "./Code";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Hero } from "./Hero";
import { ProjectChapter } from "./ProjectChapter";
import { Results } from "./Results";
import { projects } from "../../content";

/** The home page: hero, the four playable chapters, then the standing sections. */
export const Home = () => (
  <>
    <Hero />
    {projects.map((project) => (
      <ProjectChapter key={project.slug} project={project} />
    ))}
    <Results />
    <Experience />
    <Code />
    <About />
    <Contact />
  </>
);
