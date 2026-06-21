import { scoreToColor, scoreToLabel } from '../../utils/formatters';

/**
 * ScoreCard — large visual display of the composite developer score.
 */
const ScoreCard = ({ score = 0 }) => {
  const colorClass = scoreToColor(score);
  const label = scoreToLabel(score);

  // SVG ring parameters
  const radius   = 52;
  const circ     = 2 * Math.PI * radius;
  const progress = ((score / 100) * circ).toFixed(1);
  const gap      = (circ - progress).toFixed(1);

  // Gradient id per component instance
  const gradId = 'score-grad';

  return (
    <div className="card flex flex-col items-center gap-4 py-8">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Developer Score
        </h3>
      </div>

      {/* Circular progress ring */}
      <div className="relative w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx="72" cy="72" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-zinc-100 dark:text-surface-border"
          />
          {/* Progress */}
          <circle
            cx="72" cy="72" r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${gap}`}
            style={{ transition: 'stroke-dasharray 1s ease-out' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold tabular-nums ${colorClass}`}>
            {score.toFixed(0)}
          </span>
          <span className="text-xs text-zinc-400 font-medium">/ 100</span>
        </div>
      </div>

      {/* Label badge */}
      <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400`}>
        {label}
      </span>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center max-w-[180px]">
        Composite score based on contributions, growth, languages, and repo health.
      </p>
    </div>
  );
};

export default ScoreCard;
