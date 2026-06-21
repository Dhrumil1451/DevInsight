import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Legend,
} from 'recharts';
import { getLanguageColor } from '../../utils/formatters';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white dark:bg-surface-card border border-zinc-200 dark:border-surface-border rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{name}</p>
      <p className="text-zinc-500 dark:text-zinc-400">{value} {value === 1 ? 'repo' : 'repos'}</p>
    </div>
  );
};

// ─── Custom Legend ────────────────────────────────────────────────────────────
const CustomLegend = ({ data }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3">
    {data.map(({ language, count }) => (
      <span key={language} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: getLanguageColor(language) }}
        />
        {language}
        <span className="text-zinc-400">({count})</span>
      </span>
    ))}
  </div>
);

// ─── LanguageChart ────────────────────────────────────────────────────────────
/**
 * Renders a Pie chart (top 5) + Bar chart for language distribution.
 *
 * Props:
 *   distribution   — array of { language, count }
 *   mostUsed       — string: most used language name
 *   totalLanguages — number
 */
const LanguageChart = ({ distribution = [], mostUsed, totalLanguages = 0 }) => {
  if (!distribution.length) {
    return (
      <div className="card flex items-center justify-center h-48 text-zinc-400 text-sm">
        No language data available.
      </div>
    );
  }

  // Top 5 for pie, rest grouped as "Other"
  const sorted   = [...distribution].sort((a, b) => b.count - a.count);
  const top5     = sorted.slice(0, 5);
  const otherSum = sorted.slice(5).reduce((s, d) => s + d.count, 0);
  const pieData  = otherSum > 0
    ? [...top5, { language: 'Other', count: otherSum }]
    : top5;

  return (
    <div className="card space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Language Distribution
          </h3>
          {mostUsed && (
            <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Primary: <span className="text-brand-500 font-semibold">{mostUsed}</span>
            </p>
          )}
        </div>
        <span className="badge badge-brand">{totalLanguages} languages</span>
      </div>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="count"
              nameKey="language"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={3}
              strokeWidth={0}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.language}
                  fill={getLanguageColor(entry.language)}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <CustomLegend data={pieData} />

      {/* Bar chart for exact counts */}
      {sorted.length > 1 && (
        <>
          <div className="divider" />
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={sorted} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="language"
                tick={{ fontSize: 10, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {sorted.map((entry) => (
                  <Cell
                    key={entry.language}
                    fill={getLanguageColor(entry.language)}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default LanguageChart;
