import { formatNumber, getLanguageColor } from '../../utils/formatters';

// ─── Inline icons ─────────────────────────────────────────────────────────────
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const ForkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
);
const IssueIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─── Language dot ─────────────────────────────────────────────────────────────
const LangDot = ({ language }) => (
  <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
    <span
      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
      style={{ background: getLanguageColor(language) }}
    />
    {language}
  </span>
);

// ─── RepositoryTable ──────────────────────────────────────────────────────────
/**
 * Desktop-optimised table view of repository list.
 */
const RepositoryTable = ({ repos = [], username }) => {
  if (!repos.length) {
    return (
      <div className="card flex items-center justify-center py-10 text-zinc-400 text-sm">
        No public repositories found.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-surface-border bg-zinc-50 dark:bg-surface text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              <th className="text-left px-5 py-3">Repository</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Language</th>
              <th className="text-right px-4 py-3">⭐ Stars</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">🍴 Forks</th>
              <th className="text-right px-5 py-3 hidden lg:table-cell">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-surface-border">
            {repos.map((repo) => (
              <tr
                key={repo.name}
                className="hover:bg-zinc-50 dark:hover:bg-surface transition-colors duration-150 group"
              >
                {/* Name */}
                <td className="px-5 py-3.5">
                  <a
                    href={`https://github.com/${username}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-600 dark:text-brand-400 hover:underline group-hover:text-brand-500 transition-colors"
                  >
                    {repo.name}
                  </a>
                  {repo.description && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 max-w-xs truncate">
                      {repo.description}
                    </p>
                  )}
                </td>

                {/* Language */}
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  {repo.language
                    ? <LangDot language={repo.language} />
                    : <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
                  }
                </td>

                {/* Stars */}
                <td className="px-4 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1 justify-end font-medium text-zinc-700 dark:text-zinc-200">
                    <StarIcon />
                    {formatNumber(repo.stargazers_count)}
                  </span>
                </td>

                {/* Forks */}
                <td className="px-4 py-3.5 text-right hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 justify-end text-zinc-500 dark:text-zinc-400">
                    <ForkIcon />
                    {formatNumber(repo.forks_count)}
                  </span>
                </td>

                {/* Issues */}
                <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                  <span className={`inline-flex items-center gap-1 justify-end ${
                    repo.open_issues_count > 50
                      ? 'text-red-500'
                      : repo.open_issues_count > 10
                        ? 'text-yellow-500'
                        : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    <IssueIcon />
                    {repo.open_issues_count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepositoryTable;
