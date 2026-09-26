import { DefinitionList } from "../common/DefinitionList";
import { Section } from "../common/Section";
import { aboutDefinitions, aboutParagraphs } from "../../content";

export const About = ({ standalone = false }: { standalone?: boolean }) => (
  <Section
    id={standalone ? "about-details" : "about"}
    title={standalone ? undefined : "About"}
    label={standalone ? "About" : undefined}
  >
    <div className="prose">
      {aboutParagraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>

    {/* Targeted by the legacy #skills hash redirect. */}
    <DefinitionList id="skills" items={aboutDefinitions} />
  </Section>
);
