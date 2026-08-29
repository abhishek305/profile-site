import { useGitHubStats, type GitHubStats } from "@/hooks/useGitHubStats";
import { profile, links } from "@/constants/profile";
import { StarIcon, ExternalLinkIcon } from "../../icons";

const nf = new Intl.NumberFormat("en-US");
const pct = (share: number) => `${Math.round(share * 100)}%`;

/** Categorical slot per language, fixed by rank and never cycled (see index.css --viz-*). */
const slotOf = (index: number, name: string) => (name === "Other" ? "var(--viz-other)" : `var(--viz-${Math.min(index + 1, 6)})`);

const StatTiles = ({ data }: { data: GitHubStats }) => (
  <dl className="gh-tiles">
    {[
      { label: "Repositories", value: data.repos },
      { label: "Stars earned", value: data.stars },
      { label: "Followers", value: data.followers },
      { label: "Following", value: data.following },
    ].map((tile) => (
      <div key={tile.label} className="gh-tile">
        <dt className="gh-tile-label">{tile.label}</dt>
        <dd className="gh-tile-value font-mono">{nf.format(tile.value)}</dd>
      </div>
    ))}
  </dl>
);

const Languages = ({ data }: { data: GitHubStats }) => {
  if (data.languages.length === 0) return null;

  return (
    <section className="gh-section">
      <h2>Languages</h2>
      <p className="gh-section-note">Share of {nf.format(data.languages.reduce((n, l) => n + l.count, 0))} source repositories.</p>

      {/* Proportion bar. Identity is carried by the labelled chips below, never by colour alone. */}
      <div className="gh-lang-bar" role="img" aria-label={data.languages.map((l) => `${l.name} ${pct(l.share)}`).join(", ")}>
        {data.languages.map((lang, i) => (
          <span key={lang.name} className="gh-lang-seg" style={{ width: `${lang.share * 100}%`, backgroundColor: slotOf(i, lang.name) }} />
        ))}
      </div>

      <ul className="gh-lang-legend">
        {data.languages.map((lang, i) => (
          <li key={lang.name} className="gh-lang-chip">
            <span className="gh-dot" style={{ backgroundColor: slotOf(i, lang.name) }} aria-hidden="true" />
            <span className="gh-lang-name">{lang.name}</span>
            <span className="gh-lang-pct font-mono">{pct(lang.share)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const TopRepos = ({ data }: { data: GitHubStats }) => {
  if (data.topRepos.length === 0) return null;

  return (
    <section className="gh-section">
      <h2>Most starred</h2>
      <ul className="gh-repo-list">
        {data.topRepos.map((repo) => (
          <li key={repo.name}>
            <a className="gh-repo" href={repo.url} target="_blank" rel="noopener noreferrer">
              <span className="gh-repo-head">
                <span className="gh-repo-name font-mono">{repo.name}</span>
                <span className="gh-repo-stars font-mono">
                  <StarIcon />
                  {nf.format(repo.stars)}
                </span>
              </span>
              {repo.description && <span className="gh-repo-desc">{repo.description}</span>}
              {repo.language && <span className="gh-repo-lang">{repo.language}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

const GitHubPage = () => {
  const state = useGitHubStats();

  return (
    <div className="md-content max-w-4xl mx-auto">
      <h1>GitHub Statistics</h1>
      <p className="gh-handle">
        <a href={links.github} target="_blank" rel="noopener noreferrer" className="font-mono">
          @{profile.githubUser}
          <ExternalLinkIcon />
        </a>
      </p>

      {state.status === "loading" && (
        <div className="gh-tiles" aria-busy="true" aria-label="Loading GitHub statistics">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="gh-tile skeleton" style={{ height: "5.5rem" }} />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div className="gh-fallback">
          <p>
            Couldn&apos;t reach the GitHub API ({state.message}). It rate-limits to 60 requests an hour per IP, so this usually clears on its own.
          </p>
          <a href={links.github} target="_blank" rel="noopener noreferrer">
            View the profile on GitHub
            <ExternalLinkIcon />
          </a>
        </div>
      )}

      {state.status === "ready" && (
        <>
          <StatTiles data={state.data} />
          <Languages data={state.data} />
          <TopRepos data={state.data} />
        </>
      )}
    </div>
  );
};

export default GitHubPage;
