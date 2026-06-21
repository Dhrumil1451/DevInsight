import { useState } from 'react';
import { compareDevelopers } from '../services/api';
import { getLanguageColor } from '../utils/formatters';
import PageLoader    from '../components/common/PageLoader';
import ErrorMessage    from '../components/ErrorMessage';
import CompareCard     from '../components/compare/CompareCard';
import ScoreComparison from '../components/compare/ScoreComparison';

// ─── Language overlap visual ───────────────────────────────────────────────────
const LanguageOverlap = ({ analytics1, analytics2, u1, u2 }) => {
  const dist1 = analytics1?.language_analysis?.distribution ?? [];
  const dist2 = analytics2?.language_analysis?.distribution ?? [];
  const langs1 = new Set(dist1.map((d) => d.language));
  const langs2 = new Set(dist2.map((d) => d.language));
  const shared  = [...langs1].filter((l) => langs2.has(l));
  const only1   = [...langs1].filter((l) => !langs2.has(l));
  const only2   = [...langs2].filter((l) => !langs1.has(l));

  if (!dist1.length && !dist2.length) return null;

  const Dot = ({ lang }) => (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-surface border border-zinc-200 dark:border-surface-border text-xs font-medium text-zinc-700 dark:text-zinc-300">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: getLanguageColor(lang) }} />
      {lang}
    </span>
  );

  return (
    <div className="card space-y-5">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Language Overlap
      </h3>
      {shared.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-2">Both use</p>
          <div className="flex flex-wrap gap-2">{shared.map((l) => <Dot key={l} lang={l} />)}</div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-500 mb-2">@{u1} only</p>
          <div className="flex flex-wrap gap-2">{only1.length ? only1.map((l) => <Dot key={l} lang={l} />) : <span className="text-xs text-zinc-300">—</span>}</div>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-2">@{u2} only</p>
          <div className="flex flex-wrap gap-2">{only2.length ? only2.map((l) => <Dot key={l} lang={l} />) : <span className="text-xs text-zinc-300">—</span>}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Compare page ─────────────────────────────────────────────────────────────
const Compare = () => {
  const [user1Input, setUser1Input] = useState('');
  const [user2Input, setUser2Input] = useState('');
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handleCompare = async () => {
    const u1 = user1Input.trim();
    const u2 = user2Input.trim();
    if (!u1 || !u2) {
      setError('Please enter both GitHub usernames.');
      return;
    }
    if (u1 === u2) {
      setError('Please enter two different usernames.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await compareDevelopers(u1, u2);
      setResult(res?.data || res);
    } catch (err) {
      setError(err.message || 'Comparison failed. Please check the usernames and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCompare();
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setUser1Input('');
    setUser2Input('');
  };

  // Derived data
  const profile1   = result?.user1?.profile   ?? null;
  const profile2   = result?.user2?.profile   ?? null;
  const analytics1 = result?.user1?.analytics ?? null;
  const analytics2 = result?.user2?.analytics ?? null;
  const score1     = analytics1?.developer_score?.score ?? 0;
  const score2     = analytics2?.developer_score?.score ?? 0;
  const winner1    = score1 >= score2;

  return (
    <div className="space-y-10 pb-16 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-medium">
          ⚖️ Developer Comparison
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">
          Compare Developers
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Enter two GitHub usernames to compare scores, languages, and repository metrics side by side.
        </p>
      </div>

      {/* ── Input Panel ── */}
      <div className="max-w-2xl mx-auto card space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* User 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Developer 1
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-zinc-400 text-sm">@</span>
              <input
                type="text"
                value={user1Input}
                onChange={(e) => setUser1Input(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="torvalds"
                className="input pl-8"
              />
            </div>
          </div>

          {/* User 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Developer 2
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-zinc-400 text-sm">@</span>
              <input
                type="text"
                value={user2Input}
                onChange={(e) => setUser2Input(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="gvanrossum"
                className="input pl-8"
              />
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-100 dark:bg-surface-border" />
          <span className="text-xs font-bold text-zinc-400 px-2">VS</span>
          <div className="flex-1 h-px bg-zinc-100 dark:bg-surface-border" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCompare}
            disabled={loading || !user1Input.trim() || !user2Input.trim()}
            className="btn-primary flex-1"
          >
            {loading ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Comparing…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                Compare Developers
              </>
            )}
          </button>
          {result && (
            <button onClick={handleReset} className="btn-secondary">
              Reset
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && <PageLoader text="Fetching and comparing developer profiles…" />}

      {/* ── Results ── */}
      {!loading && result && (
        <div className="space-y-8 animate-slide-up">

          {/* Profile cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CompareCard
              label="Developer 1"
              profile={profile1}
              score={score1}
              isWinner={winner1}
            />
            <CompareCard
              label="Developer 2"
              profile={profile2}
              score={score2}
              isWinner={!winner1}
            />
          </div>

          {/* Score breakdown radar + mirror bars */}
          {analytics1?.developer_score && analytics2?.developer_score && (
            <ScoreComparison
              user1={{ username: user1Input.trim(), breakdown: analytics1.developer_score.breakdown }}
              user2={{ username: user2Input.trim(), breakdown: analytics2.developer_score.breakdown }}
            />
          )}

          {/* Language overlap */}
          <LanguageOverlap
            analytics1={analytics1}
            analytics2={analytics2}
            u1={user1Input.trim()}
            u2={user2Input.trim()}
          />
        </div>
      )}
    </div>
  );
};

export default Compare;
