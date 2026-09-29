import { ExternalLink } from "../common/ExternalLink";
import { Section } from "../common/Section";
import { contactIntro, email, githubProfile, linkedinProfile } from "../../content";
import { useCopyAction } from "../../hooks/useCopyAction";

export const Contact = ({ standalone = false }: { standalone?: boolean }) => {
  const { copy } = useCopyAction(email, "Email copied");

  return (
    <Section
      id={standalone ? "contact-details" : "contact"}
      title={standalone ? undefined : "Contact"}
      label={standalone ? "Contact" : undefined}
    >
      <div className="prose">
        <p>{contactIntro}</p>
      </div>

      <div className="contact-links">
        <a className="btn primary" href={`mailto:${email}?subject=Hello%20from%20your%20portfolio`}>
          Email me
        </a>
        <button className="btn" type="button" onClick={copy}>
          Copy email address
        </button>
        <ExternalLink className="btn" href={githubProfile}>
          GitHub
        </ExternalLink>
        <ExternalLink className="btn" href={linkedinProfile}>
          LinkedIn
        </ExternalLink>
      </div>
    </Section>
  );
};
