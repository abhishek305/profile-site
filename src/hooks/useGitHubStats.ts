import { useEffect, useState } from 'react';
import { profile } from '@/constants/profile';

export interface LanguageSlice {
  name: string;
  count: number;
  share: number; // 0..1
}

export interface RepoSummary {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
}

export interface GitHubStats {
  repos: number;
  stars: number;
  followers: number;
  following: number;
  languages: LanguageSlice[];
  topRepos: RepoSummary[];
}

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: GitHubStats }
  | { status: 'error'; message: string };

const CACHE_KEY = `gh-stats:${profile.githubUser}`;
const CACHE_TTL = 30 * 60 * 1000; // 30 min — the API allows 60 unauthenticated calls/hour/IP.
const MAX_LANGUAGES = 6; // Beyond this, fold into "Other" rather than inventing hues.

const readCache = (): GitHubStats | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    return Date.now() - at < CACHE_TTL ? data : null;
  } catch {
    return null; // Private mode / disabled storage — just refetch.
  }
};

const writeCache = (data: GitHubStats) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage full or blocked; caching is best-effort */
  }
};

const summarise = (user: any, repos: any[]): GitHubStats => {
  const own = repos.filter((r) => !r.fork);

  const counts = new Map<string, number>();
  for (const repo of own) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, MAX_LANGUAGES);
  const otherCount = ranked.slice(MAX_LANGUAGES).reduce((sum, [, n]) => sum + n, 0);
  if (otherCount > 0) top.push(['Other', otherCount]);

  const total = top.reduce((sum, [, n]) => sum + n, 0) || 1;

  return {
    repos: user.public_repos ?? own.length,
    stars: repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0),
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    languages: top.map(([name, count]) => ({ name, count, share: count / total })),
    topRepos: own
      .slice()
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
      })),
  };
};

/** Live GitHub stats straight from the public API — no third-party image services. */
export const useGitHubStats = (): State => {
  const [state, setState] = useState<State>(() => {
    const cached = readCache();
    return cached ? { status: 'ready', data: cached } : { status: 'loading' };
  });

  useEffect(() => {
    if (state.status === 'ready') return; // Served from cache.

    let cancelled = false;
    const base = `https://api.github.com/users/${profile.githubUser}`;

    Promise.all([
      fetch(base).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`GitHub API ${r.status}`)))),
      fetch(`${base}/repos?per_page=100&sort=updated`).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`GitHub API ${r.status}`))
      ),
    ])
      .then(([user, repos]) => {
        if (cancelled) return;
        const data = summarise(user, repos);
        writeCache(data);
        setState({ status: 'ready', data });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ status: 'error', message: err.message });
      });

    return () => {
      cancelled = true;
    };
    // Runs once: the username is a build-time constant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
