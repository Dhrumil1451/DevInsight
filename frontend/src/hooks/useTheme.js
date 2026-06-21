import { useState, useEffect } from 'react';

/**
 * useTheme — manages dark/light mode.
 * Persists preference in localStorage.
 * Applies/removes 'dark' class on <html>.
 *
 * Returns [isDark, toggleTheme]
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // 1. Check localStorage first
    const stored = localStorage.getItem('devinsight-theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    // 2. Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('devinsight-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return [isDark, toggleTheme];
}
