import { formatNumber, getLanguageColor } from '../../utils/formatters';

/**
 * RepositoryCard — mobile-friendly card view for a single repository.
 */
const RepositoryCard = ({ repo, username }) => {
  const { name, description, language, stargazers_count = 0, forks_count = 0, open_issues_count = 0 } = repo;

  return (
    <a
      href={`https://github.com/${username}/${name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        block p-4 rounded-xl
        bg-zinc-50 dark:bg-surface
        border border-zinc-200 dark:border-surface-border
        hover:border-brand-400 dark:hover:border-brand-600
        hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200
        group
      "
    >
      {/* Name */}
      <p className="font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-500 transition-colors truncate">
        {name}
      </p>

      {/* Description */}
      {description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug line-clamp-2">
          {description}
        </p>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        {language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: getLanguageColor(language) }}
            />
            {language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {formatNumber(stargazers_count)}
        </span>
        <span className="flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
            <path d="M18 9a9 9 0 0 1-9 9"/>
          </svg>
          {formatNumber(forks_count)}
        </span>
        {open_issues_count > 0 && (
          <span className="flex items-center gap-1 text-emerald-500">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {open_issues_count}
          </span>
        )}
      </div>
    </a>
  );
};

export default RepositoryCard;
