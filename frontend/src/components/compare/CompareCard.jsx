import { Link } from 'react-router-dom';
import { formatNumber, scoreToColor, scoreToLabel } from '../../utils/formatters';

/**
 * CompareCard — profile + score summary card for one developer in a comparison.
 *
 * Props:
 *   label   — "Developer 1" or "Developer 2"
 *   profile — the DeveloperProfile object
 *   score   — the developer score number (0-100)
 *   isWinner — if true, shows a winning crown badge
 */
const CompareCard = ({ label, profile, score = 0, isWinner = false }) => {
  if (!profile) return null;

  const { username, name, avatar_url, followers = 0, following = 0, public_repos = 0, location, company } = profile;
  const colorClass = scoreToColor(score);
  const scoreLabel = scoreToLabel(score);

  return (
    <div
      className={`
        card relative overflow-hidden flex flex-col gap-5 transition-all duration-300
        ${isWinner ? 'ring-2 ring-brand-500 shadow-lg shadow-brand-500/10' : ''}
      `}
    >
      {/* Top gradient bar */}
      <div className={`h-1 absolute top-0 inset-x-0 ${isWinner ? 'bg-gradient-to-r from-amber-400 to-brand-500' : 'bg-gradient-to-r from-zinc-200 dark:from-surface-border to-transparent'}`} />

      {/* Winner crown */}
      {isWinner && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
          👑 Winner
        </div>
      )}

      {/* Label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pt-2">{label}</p>

      {/* Avatar + Identity */}
      <div className="flex items-center gap-4">
        <img
          src={avatar_url || `https://github.com/${username}.png`}
          alt={name || username}
          className={`w-16 h-16 rounded-2xl object-cover flex-shrink-0 ${isWinner ? 'ring-2 ring-brand-500/30' : ''}`}
        />
        <div className="min-w-0">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{name || username}</h3>
          <p className="text-brand-500 font-mono text-sm">@{username}</p>
          {location && (
            <p className="text-xs text-zinc-400 mt-0.5">{location}</p>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-surface">
        <div className={`text-4xl font-extrabold tabular-nums ${colorClass}`}>
          {score.toFixed(0)}
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Developer Score</p>
          <p className={`text-sm font-bold ${colorClass}`}>{scoreLabel}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Followers', value: followers },
          { label: 'Following', value: following },
          { label: 'Repos',     value: public_repos },
        ].map(({ label: l, value }) => (
          <div key={l} className="flex flex-col items-center gap-0.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-surface">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {formatNumber(value)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{l}</span>
          </div>
        ))}
      </div>

      {/* Link */}
      <Link
        to={`/developer/${username}`}
        className="btn-secondary text-sm text-center w-full"
      >
        View Full Analytics →
      </Link>
    </div>
  );
};

export default CompareCard;
