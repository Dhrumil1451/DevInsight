import { useTheme } from '../hooks/useTheme';

/**
 * Sun/Moon icon toggle button.
 * Reads from and writes to the shared useTheme hook.
 */
const ThemeToggle = () => {
  const [isDark, toggleTheme] = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        relative w-10 h-10 flex items-center justify-center rounded-xl
        bg-zinc-100 dark:bg-surface-border
        hover:bg-zinc-200 dark:hover:bg-zinc-700
        text-zinc-600 dark:text-zinc-300
        transition-all duration-200 active:scale-90
        border border-zinc-200 dark:border-surface-border
      "
    >
      {/* Sun icon */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </span>

      {/* Moon icon */}
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
