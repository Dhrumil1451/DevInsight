import { Link } from 'react-router-dom';

const TrendingCard = ({ rank, username, searchCount }) => {
  return (
    <div className="card group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center gap-4">
      <div className="flex-shrink-0 text-xl font-black text-zinc-300 dark:text-zinc-700 w-8 text-center group-hover:text-brand-300 dark:group-hover:text-brand-800 transition-colors">
        #{rank}
      </div>
      <img
        src={`https://github.com/${username}.png?size=64`}
        alt={username}
        className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-100 dark:ring-surface-border group-hover:ring-brand-500/30 transition-all"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {username}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          🔥 {searchCount} {searchCount === 1 ? 'search' : 'searches'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          to={`/developer/${username}`}
          className="btn-primary text-xs py-1.5 px-3"
        >
          Analyze
        </Link>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          GitHub ↗
        </a>
      </div>
    </div>
  );
};

export default TrendingCard;
