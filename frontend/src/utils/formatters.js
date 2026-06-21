/**
 * Format a large number with compact notation.
 * e.g. 12300 → "12.3K"
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

/**
 * Format an ISO date string to a readable format.
 * e.g. "2020-01-15T00:00:00Z" → "Jan 15, 2020"
 */
export const formatDate = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Truncate text to a max length with ellipsis.
 */
export const truncate = (text, max = 100) => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

/**
 * Map a score (0–100) to a colour class.
 */
export const scoreToColor = (score) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

/**
 * Map a score to a label.
 */
export const scoreToLabel = (score) => {
  if (score >= 85) return 'Elite';
  if (score >= 70) return 'Expert';
  if (score >= 55) return 'Proficient';
  if (score >= 40) return 'Developing';
  return 'Beginner';
};

/**
 * Language colour map (subset of GitHub colours).
 */
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  default: '#6366f1',
};

export const getLanguageColor = (lang) =>
  LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default;
