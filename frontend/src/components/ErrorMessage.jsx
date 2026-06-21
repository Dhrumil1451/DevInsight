const ErrorMessage = ({ title = 'Something went wrong', message = '', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center animate-fade-in">
      {/* Error icon */}
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {message && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">{message}</p>
        )}
      </div>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
