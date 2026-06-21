import { Link } from 'react-router-dom';

const SavedCard = ({ profile, onRemove }) => {
  const { username, name, avatar_url } = profile;

  return (
    <div className="card group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center gap-4">
      <img
        src={avatar_url || `https://github.com/${username}.png`}
        alt={name || username}
        className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-100 dark:ring-surface-border group-hover:ring-brand-500/30 transition-all"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {name || username}
        </h3>
        <p className="text-xs font-mono text-brand-500 mt-0.5">
          @{username}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          to={`/developer/${username}`}
          className="btn-primary text-xs py-1.5 px-3"
        >
          View Profile
        </Link>
        <button
          onClick={() => onRemove(username)}
          className="text-[10px] text-center text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SavedCard;
