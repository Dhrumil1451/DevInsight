import { useState, useRef, useEffect } from 'react';
import { getDeveloper, fetchTrending } from '../services/api';
import DeveloperCard from '../components/DeveloperCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ─── Feature pill ─────────────────────────────────────────────────────────────
const Feature = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-surface-border text-xs font-medium text-zinc-600 dark:text-zinc-300">
    <span className="text-brand-500">{icon}</span>
    {label}
  </div>
);

// ─── Trending mini-card ────────────────────────────────────────────────────────
const TrendingPill = ({ username, rank, onSearch }) => (
  <button
    onClick={() => onSearch(username)}
    className="
      flex items-center gap-2.5 px-4 py-2 rounded-xl
      bg-zinc-50 dark:bg-surface-border
      border border-zinc-200 dark:border-zinc-700
      hover:border-brand-400 dark:hover:border-brand-500
      hover:bg-brand-50 dark:hover:bg-brand-900/20
      transition-all duration-200 text-sm group
    "
  >
    <span className="text-xs font-bold text-zinc-400 w-4">#{rank}</span>
    <img
      src={`https://github.com/${username}.png?size=32`}
      alt={username}
      className="w-6 h-6 rounded-full"
    />
    <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
      {username}
    </span>
  </button>
);

// ─── Stats bar ────────────────────────────────────────────────────────────────
const HeroStat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">{value}</div>
    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</div>
  </div>
);

// ─── Home page ────────────────────────────────────────────────────────────────
const Home = () => {
  const [query, setQuery]         = useState('');
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [trending, setTrending]   = useState([]);
  const inputRef = useRef(null);

  // Load trending on mount (non-blocking — fails silently if backend offline)
  useEffect(() => {
    fetchTrending(6)
      .then((res) => {
        const list = res?.data?.trending || [];
        setTrending(list);
      })
      .catch(() => {});
  }, []);

  const handleSearch = async (username) => {
    const name = (username || query).trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError('');
    setProfile(null);
    setQuery(name);

    try {
      const res = await getDeveloper(name);
      // Backend wraps response in { success, data }
      setProfile(res?.data || res);
    } catch (err) {
      setError(err.message || `Could not find developer "${name}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setQuery('');
    setProfile(null);
    setError('');
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-16 pb-16 animate-fade-in">

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative text-center space-y-8 pt-8">

        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-80 w-full"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
          GitHub Developer Analytics
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-none">
            Analyze Any{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent">
                GitHub
              </span>
              {/* underline decoration */}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-brand-400 to-violet-500 opacity-60"
              />
            </span>
            {' '}Developer
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Instantly generate a deep analytics profile for any GitHub user —
            scores, language breakdown, growth trends, repository health, and AI-powered insights.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          <Feature icon="🏆" label="Developer Score" />
          <Feature icon="📊" label="Language Analytics" />
          <Feature icon="📈" label="Growth Trends" />
          <Feature icon="🔍" label="Repo Health" />
          <Feature icon="💡" label="AI Insights" />
          <Feature icon="⚖️" label="Side-by-Side Compare" />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 pt-2">
          <HeroStat value="100+"  label="Data points" />
          <div className="w-px h-8 bg-zinc-200 dark:bg-surface-border" />
          <HeroStat value="Real-time" label="GitHub data" />
          <div className="w-px h-8 bg-zinc-200 dark:bg-surface-border" />
          <HeroStat value="Free"  label="No sign-up" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SEARCH SECTION
      ═══════════════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto space-y-4">
        {/* Search bar */}
        <div
          className="
            flex items-center gap-3 p-2 rounded-2xl
            bg-white dark:bg-surface-card
            border-2 border-zinc-200 dark:border-surface-border
            focus-within:border-brand-400 dark:focus-within:border-brand-500
            shadow-lg shadow-black/5 dark:shadow-black/20
            transition-all duration-300
          "
        >
          {/* GitHub icon */}
          <div className="pl-2 flex-shrink-0 text-zinc-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter GitHub username (e.g. torvalds)"
            className="
              flex-1 bg-transparent outline-none
              text-zinc-900 dark:text-zinc-100
              placeholder-zinc-400 dark:placeholder-zinc-500
              text-base
            "
          />

          {/* Clear button */}
          {query && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-surface-border transition-all"
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}

          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="btn-primary flex-shrink-0 rounded-xl"
          >
            {loading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            )}
            Analyze Developer
          </button>
        </div>

        {/* Quick-search examples */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Try:</span>
          {['torvalds', 'gvanrossum', 'sindresorhus', 'tj'].map((ex) => (
            <button
              key={ex}
              onClick={() => handleSearch(ex)}
              className="font-mono text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:underline transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          RESULTS SECTION
      ═══════════════════════════════════════════════ */}
      {(loading || error || profile) && (
        <section className="max-w-lg mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
                Fetching developer profile…
              </p>
            </div>
          )}

          {!loading && error && (
            <ErrorMessage
              title="Developer not found"
              message={error}
              onRetry={() => handleSearch()}
            />
          )}

          {!loading && !error && profile && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Search Result
                </h2>
                <button onClick={handleClear} className="btn-ghost text-xs">
                  Clear
                </button>
              </div>
              <DeveloperCard profile={profile} />
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          TRENDING SECTION (if data available)
      ═══════════════════════════════════════════════ */}
      {trending.length > 0 && !profile && !loading && (
        <section className="max-w-3xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <h2 className="section-title text-xl">Trending Developers</h2>
            <div className="flex-1 h-px bg-zinc-100 dark:bg-surface-border" />
          </div>
          <div className="flex flex-wrap gap-3">
            {trending.map((dev, i) => (
              <TrendingPill
                key={dev.username}
                username={dev.username}
                rank={i + 1}
                onSearch={handleSearch}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
            Most searched developers on DevInsight
          </p>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          FEATURE GRID (shown when no search result)
      ═══════════════════════════════════════════════ */}
      {!profile && !loading && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            {
              icon: '🏆',
              title: 'Developer Score',
              desc: 'A composite score measuring contribution impact, growth velocity, language breadth, and repo quality.',
              color: 'from-amber-400 to-orange-500',
            },
            {
              icon: '🌐',
              title: 'Language Analytics',
              desc: 'Visualize language distribution across all public repositories with interactive charts.',
              color: 'from-sky-400 to-blue-500',
            },
            {
              icon: '📈',
              title: 'Growth Trends',
              desc: 'Track follower growth, repository activity, and engagement metrics over time.',
              color: 'from-emerald-400 to-teal-500',
            },
            {
              icon: '🔍',
              title: 'Repo Health',
              desc: 'Measure documentation coverage, open issue ratios, and maintenance activity.',
              color: 'from-purple-400 to-violet-500',
            },
            {
              icon: '⚖️',
              title: 'Side-by-Side Compare',
              desc: 'Compare two developers on any metric — score, languages, repos, and more.',
              color: 'from-pink-400 to-rose-500',
            },
            {
              icon: '📄',
              title: 'PDF Reports',
              desc: 'Generate and download a complete analytics PDF report for any developer.',
              color: 'from-brand-400 to-indigo-500',
            },
          ].map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="card group hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">{title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Home;
