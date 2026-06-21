import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { generateReport, getAnalytics, getDeveloper, getRepositories } from '../services/api';
import { formatDate, formatNumber } from '../utils/formatters';

// Components
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import InsightCard from '../components/analytics/InsightCard';
import LanguageChart from '../components/analytics/LanguageChart';
import ScoreBreakdown from '../components/analytics/ScoreBreakdown';
import ScoreCard from '../components/analytics/ScoreCard';
import RepositoryCard from '../components/repositories/RepositoryCard';
import RepositoryTable from '../components/repositories/RepositoryTable';

// ─── Stat chip ────────────────────────────────────────────────────────────────
const StatChip = ({ icon, value, label }) => (
  <div className="flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-surface-border min-w-[80px]">
    <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
      {formatNumber(value)}
    </span>
    <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
      {icon} {label}
    </span>
  </div>
);

// ─── Metric card (Growth / Health) ────────────────────────────────────────────
const MetricCard = ({ icon, label, value, sublabel, gradient }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
        {typeof value === 'number' ? value.toFixed(1) : value}
      </p>
      {sublabel && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sublabel}</p>
      )}
    </div>
  </div>
);

// ─── DeveloperProfile page ────────────────────────────────────────────────────
const DeveloperProfile = () => {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMsg, setReportMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {

      // Fetch profile first
      const profileRes = await getDeveloper(username);


      // Fetch repositories before analytics
      // Analytics depends on repository data
      const reposRes = await getRepositories(username);


      // Generate analytics after repositories are available
      const analyticsRes = await getAnalytics(username);


      setProfile(profileRes?.data || profileRes);


      setAnalytics(analyticsRes?.data || analyticsRes);


      const repoList =
        reposRes?.data?.repositories ||
        reposRes?.repositories ||
        [];

        console.log("REPOSITORIES:", repoList);


      // Sort repositories by stars descending
      setRepos(
        [...repoList].sort(
          (a, b) =>
            b.stargazers_count - a.stargazers_count
        )
      );


    } catch (err) {

      setError(
        err.message ||
        `Failed to load data for "${username}"`
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => { load(); }, [username]);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportMsg('');
    try {
      const res = await generateReport(username);
      const reportId = res?.data?.report_id || res?.report_id;
      if (reportId) {
        setReportMsg(`Report #${reportId} ready — `);
        window.open(`http://localhost:8000/api/reports/${reportId}`, '_blank');
      }
    } catch (err) {
      setReportMsg(`Report error: ${err.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <LoadingSpinner size="lg" />
        <div className="text-center space-y-1">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">Analyzing developer…</p>
          <p className="text-sm text-zinc-400">Fetching profile &amp; computing analytics</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="max-w-lg mx-auto">
        <ErrorMessage
          title="Could not load developer"
          message={error}
          onRetry={load}
        />
        <div className="text-center mt-4">
          <Link to="/" className="btn-secondary text-sm">← Back to Search</Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const {
    name, avatar_url, bio, company, location,
    followers = 0, following = 0, public_repos = 0,
    account_created_at,
  } = profile;

  const devScore = analytics?.developer_score;
  const langData = analytics?.language_analysis;
  const growthScore = analytics?.growth_analysis?.growth_score ?? 0;
  const repoHealth = analytics?.repo_health?.average_health ?? 0;
  const insights = analytics?.insights ?? '';

  const displayedRepos = showAllRepos ? repos : repos.slice(0, 10);

  return (
    <div className="space-y-8 pb-16 animate-fade-in">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100 font-medium">@{username}</span>
      </div>

      {/* ═══════════════════════════════════════════════
          PROFILE HEADER
      ═══════════════════════════════════════════════ */}
      <section className="card relative overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30 dark:opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={avatar_url || `https://github.com/${username}.png`}
              alt={name || username}
              className="w-24 h-24 rounded-2xl ring-4 ring-brand-500/20 object-cover"
            />
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {name || username}
                </h1>
                <p className="text-brand-500 font-mono font-medium mt-0.5">@{username}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub Profile
                </a>

                <button
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                  className="btn-primary text-sm"
                >
                  {reportLoading ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  )}
                  Download PDF
                </button>
              </div>
            </div>

            {/* Bio */}
            {bio && (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                {bio}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {company && (
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                  {company.replace(/^@/, '')}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                  {location}
                </span>
              )}
              {account_created_at && (
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Joined {formatDate(account_created_at)}
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3 mt-5">
              <StatChip icon="👥" value={followers} label="Followers" />
              <StatChip icon="➕" value={following} label="Following" />
              <StatChip icon="📦" value={public_repos} label="Repos" />
            </div>

            {/* Report message */}
            {reportMsg && (
              <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">{reportMsg}PDF opened in new tab.</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ANALYTICS DASHBOARD
      ═══════════════════════════════════════════════ */}
      {analytics ? (
        <>
          {/* Row 1: Score card + Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreCard score={devScore?.score ?? 0} />
            <ScoreBreakdown breakdown={devScore?.breakdown ?? {}} />
          </div>

          {/* Row 2: Growth + Repo Health metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MetricCard
              icon="📈"
              label="Growth Score"
              value={growthScore}
              sublabel="Based on follower growth and activity"
              gradient="from-emerald-400 to-teal-500"
            />
            <MetricCard
              icon="🔍"
              label="Repo Health"
              value={repoHealth}
              sublabel="Average across all public repositories"
              gradient="from-purple-400 to-violet-500"
            />
          </div>

          {/* Row 3: Language chart */}
          <LanguageChart
            distribution={langData?.distribution ?? []}
            mostUsed={langData?.most_used_language}
            totalLanguages={langData?.total_languages ?? 0}
          />

          {/* Row 4: AI Insights */}
          <InsightCard insights={insights} />
        </>
      ) : (
        <div className="card flex items-center justify-center py-12 text-zinc-400 text-sm">
          Analytics data not available yet. Try refreshing the profile.
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          REPOSITORY ANALYTICS
      ═══════════════════════════════════════════════ */}
      <section className="space-y-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📦</span>
            <h2 className="section-title text-xl">Repositories</h2>
            {repos.length > 0 && (
              <span className="badge badge-brand">{repos.length} total</span>
            )}
          </div>
          {repos.length > 10 && (
            <button
              onClick={() => setShowAllRepos((v) => !v)}
              className="btn-ghost text-sm"
            >
              {showAllRepos ? 'Show less' : `Show all ${repos.length}`}
            </button>
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block">
          <RepositoryTable repos={displayedRepos} username={username} />
        </div>

        {/* Mobile: card grid */}
        <div className="sm:hidden grid grid-cols-1 gap-3">
          {displayedRepos.length > 0
            ? displayedRepos.map((repo) => (
              <RepositoryCard key={repo.name} repo={repo} username={username} />
            ))
            : (
              <div className="card flex items-center justify-center py-10 text-zinc-400 text-sm">
                No public repositories found.
              </div>
            )
          }
        </div>
      </section>
    </div>
  );
};

export default DeveloperProfile;
