import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../utils/formatters';

// ─── Stat chip ────────────────────────────────────────────────────────────────
const Stat = ({ icon, value, label }) => (
  <div className="flex flex-col items-center gap-0.5">
    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
      {formatNumber(value)}
    </span>
    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
      {icon}
      {label}
    </span>
  </div>
);

// ─── Inline icons ─────────────────────────────────────────────────────────────
const FollowersIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const RepoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v18H3z"/><path d="M7 3v18"/><path d="M3 9h4"/><path d="M3 15h4"/>
  </svg>
);
const FollowingIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CompanyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

// ─── DeveloperCard ────────────────────────────────────────────────────────────
/**
 * Displays a summary card for a GitHub developer profile.
 *
 * Props:
 *   profile  — the developer data object from the API
 *   compact  — if true, renders a smaller card (used for search result preview)
 */
const DeveloperCard = ({ profile, compact = false }) => {
  const navigate = useNavigate();

  if (!profile) return null;

  const {
    username,
    name,
    avatar_url,
    bio,
    company,
    location,
    followers = 0,
    following = 0,
    public_repos = 0,
  } = profile;

  return (
    <div
      className="
        group card-hover animate-slide-up
        border border-zinc-200 dark:border-surface-border
        bg-white dark:bg-surface-card
        rounded-2xl overflow-hidden
        transition-all duration-300
      "
    >
      {/* Gradient accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500" />

      <div className="p-6">
        {/* ── Header: avatar + identity ── */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={avatar_url || `https://github.com/${username}.png`}
              alt={name || username}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20 group-hover:ring-brand-500/40 transition-all duration-300"
            />
            {/* GitHub link dot */}
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open GitHub profile"
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 dark:bg-zinc-100 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-surface-card hover:scale-110 transition-transform"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white dark:text-zinc-900">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                  {name || username}
                </h3>
                <p className="text-sm text-brand-500 font-medium font-mono mt-0.5">
                  @{username}
                </p>
              </div>
            </div>

            {/* Meta: company + location */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {company && (
                <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <CompanyIcon />
                  {company.replace(/^@/, '')}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <LocationIcon />
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Bio ── */}
        {bio && !compact && (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
            {bio}
          </p>
        )}

        {/* ── Stats ── */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-surface-border grid grid-cols-3 gap-2">
          <Stat icon={<FollowersIcon />} value={followers}     label="Followers" />
          <Stat icon={<FollowingIcon />} value={following}     label="Following" />
          <Stat icon={<RepoIcon />}      value={public_repos}  label="Repos" />
        </div>

        {/* ── CTA ── */}
        <button
          onClick={() => navigate(`/developer/${username}`)}
          className="
            mt-4 w-full flex items-center justify-center gap-2
            btn-primary text-sm
          "
        >
          View Full Analytics
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default DeveloperCard;
