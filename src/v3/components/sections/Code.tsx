import { ExternalLink } from "../common/ExternalLink";
import { LinkList } from "../common/LinkList";
import { Section } from "../common/Section";
import { githubProfile, repositories } from "../../content";

const MOST_STARRED = {
  name: "PyBot",
  description: "A chatbot that answers Python questions using NLP.",
  stars: "90+",
  href: "https://github.com/abhishek305/PyBot-A-ChatBot-For-Answering-Python-Queries-Using-NLP",
} as const;

export const Code = ({ standalone = false }: { standalone?: boolean }) => (
  <Section
    id={standalone ? "github-details" : "github"}
    title={standalone ? undefined : "Code on GitHub"}
    label={standalone ? "Code on GitHub" : undefined}
  >
    <div className="prose">
      <p>
        I have 100+ public repositories at <ExternalLink href={githubProfile}>github.com/abhishek305</ExternalLink>.
        These four are the ones I would point you to.
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
            <LinkList links={repository.links} />
          </span>
        </li>
      ))}
    </ul>

    <p className="note">
      Older work: <ExternalLink href={MOST_STARRED.href}>{MOST_STARRED.name}</ExternalLink>,{" "}
      {MOST_STARRED.description.toLowerCase()} It is my most-starred repository at {MOST_STARRED.stars} stars.
    </p>

    <div className="contact-links">
      <ExternalLink className="btn" href={`${githubProfile}?tab=repositories`}>
        See all repositories
      </ExternalLink>
    </div>
  </Section>
);
