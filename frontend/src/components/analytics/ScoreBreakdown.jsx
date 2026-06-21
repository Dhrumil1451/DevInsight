/**
 * ScoreBreakdown — horizontal bar for each sub-score.
 */

const METRICS = [
  { key: 'contribution',      label: 'Contribution',      icon: '⭐', color: 'from-amber-400 to-orange-500'   },
  { key: 'growth',            label: 'Growth',            icon: '📈', color: 'from-emerald-400 to-teal-500'   },
  { key: 'language_diversity',label: 'Language Diversity', icon: '🌐', color: 'from-sky-400 to-blue-500'       },
  { key: 'repo_health',       label: 'Repo Health',       icon: '🔍', color: 'from-purple-400 to-violet-500'  },
];

const BreakdownBar = ({ label, icon, value, colorClass }) => {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
          <span>{icon}</span>
          {label}
        </span>
        <span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
          {pct.toFixed(1)}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-surface-border overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const ScoreBreakdown = ({ breakdown = {} }) => {
  return (
    <div className="card space-y-5">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Score Breakdown
      </h3>

      <div className="space-y-4">
        {METRICS.map(({ key, label, icon, color }) => (
          <BreakdownBar
            key={key}
            label={label}
            icon={icon}
            value={breakdown[key] ?? 0}
            colorClass={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoreBreakdown;
