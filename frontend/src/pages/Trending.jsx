import { useEffect, useState } from 'react';
import { getTrending } from '../services/api';
import PageLoader from '../components/common/PageLoader';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import TrendingCard from '../components/trending/TrendingCard';

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTrending = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTrending(50); // Get top 50
      const list = res?.data?.trending || res?.trending || [];
      setTrending(list);
    } catch (err) {
      setError(err.message || 'Failed to load trending developers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, []);

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-medium">
          🔥 Trending
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">
          Trending Developers
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Discover the most searched and analyzed GitHub developers on DevInsight right now.
        </p>
      </div>

      {loading ? (
        <PageLoader text="Fetching trending developers…" />
      ) : error ? (
        <ErrorMessage
          title="Could not load trending"
          message={error}
          onRetry={loadTrending}
        />
      ) : trending.length === 0 ? (
        <EmptyState 
          icon="📈"
          title="No trending developers available"
          description="Check back later! The trending list updates as more developers are analyzed."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trending.map((dev, index) => (
            <TrendingCard
              key={dev.username}
              rank={index + 1}
              username={dev.username}
              searchCount={dev.search_count}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
