import { Section } from "../common/Section";
import { EMPLOYMENT, experience, experienceIntro } from "../../content";

/** Roles at Contentstack, most recent first. */
export const Experience = ({ standalone = false }: { standalone?: boolean }) => (
  <Section
    id={standalone ? "experience-details" : "experience"}
    title={standalone ? undefined : "Experience"}
    label={standalone ? "Experience details" : undefined}
  >
    <div className="prose">
      <p>
        {EMPLOYMENT.company}, {EMPLOYMENT.from} to {EMPLOYMENT.to}. {experienceIntro}
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
  </Section>
);
