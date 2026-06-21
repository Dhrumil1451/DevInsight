import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts';

/**
 * ScoreComparison — side-by-side breakdown bars + radar chart.
 *
 * Props:
 *   user1     — { username, breakdown: { growth, contribution, language_diversity, repo_health } }
 *   user2     — same shape
 */

const METRICS = [
  { key: 'contribution',       label: 'Contribution'  },
  { key: 'growth',             label: 'Growth'        },
  { key: 'language_diversity', label: 'Languages'     },
  { key: 'repo_health',        label: 'Repo Health'   },
];

// Custom tooltip for radar
const RadarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-surface-card border border-zinc-200 dark:border-surface-border rounded-xl px-3 py-2 shadow-lg text-xs space-y-1">
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="font-medium" style={{ color: p.color }}>{p.name}</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{p.value?.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
};

// Breakdown comparison row
const MetricRow = ({ label, v1, v2 }) => {
  const max  = Math.max(v1, v2, 0.001);
  const pct1 = (v1 / 100) * 100;
  const pct2 = (v2 / 100) * 100;
  const winner1 = v1 >= v2;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-300">
        <span className={winner1 ? 'font-bold text-brand-600 dark:text-brand-400' : ''}>{v1.toFixed(1)}</span>
        <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
        <span className={!winner1 ? 'font-bold text-violet-500' : ''}>{v2.toFixed(1)}</span>
      </div>
      <div className="flex gap-1 h-2">
        {/* Left bar (user1) */}
        <div className="flex-1 flex justify-end overflow-hidden rounded-l-full bg-zinc-100 dark:bg-surface-border">
          <div
            className="h-full bg-gradient-to-l from-brand-500 to-brand-400 rounded-l-full transition-all duration-700"
            style={{ width: `${pct1}%` }}
          />
        </div>
        {/* Divider */}
        <div className="w-px bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" />
        {/* Right bar (user2) */}
        <div className="flex-1 overflow-hidden rounded-r-full bg-zinc-100 dark:bg-surface-border">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-r-full transition-all duration-700"
            style={{ width: `${pct2}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ScoreComparison = ({ user1, user2 }) => {
  const bd1 = user1?.breakdown ?? {};
  const bd2 = user2?.breakdown ?? {};

  // Radar data
  const radarData = METRICS.map(({ key, label }) => ({
    metric: label,
    [user1.username]: bd1[key] ?? 0,
    [user2.username]: bd2[key] ?? 0,
  }));

  return (
    <div className="card space-y-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Score Breakdown Comparison
      </h3>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-400">
          <span className="w-3 h-3 rounded-full bg-brand-500" />
          @{user1.username}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">vs</span>
        <span className="flex items-center gap-2 font-semibold text-violet-600 dark:text-violet-400">
          @{user2.username}
          <span className="w-3 h-3 rounded-full bg-violet-500" />
        </span>
      </div>

      {/* Mirror bars */}
      <div className="space-y-4">
        {METRICS.map(({ key, label }) => (
          <MetricRow
            key={key}
            label={label}
            v1={bd1[key] ?? 0}
            v2={bd2[key] ?? 0}
          />
        ))}
      </div>

      {/* Radar chart */}
      <div className="pt-2">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e4e4e7" className="dark:stroke-surface-border" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 11, fill: '#71717a' }}
            />
            <Radar
              name={user1.username}
              dataKey={user1.username}
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Radar
              name={user2.username}
              dataKey={user2.username}
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip content={<RadarTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreComparison;
