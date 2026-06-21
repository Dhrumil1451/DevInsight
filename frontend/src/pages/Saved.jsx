import { useEffect, useState } from 'react';
import { getSavedDevelopers, removeSaved } from '../services/api';
import PageLoader from '../components/common/PageLoader';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import SavedCard from '../components/saved/SavedCard';
import Toast from '../components/common/Toast';

const Saved = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadSaved = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getSavedDevelopers();
      const list = res?.data?.saved_profiles || res?.saved_profiles || [];
      setSaved(list);
    } catch (err) {
      setError(err.message || 'Failed to load saved developers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleRemove = async (username) => {
    try {
      // The API expects an ID or username? Looking at api.js:
      // export const removeSaved = (id) => api.delete(`/saved/${id}`);
      // Usually it's by username or profile id. Let's assume it accepts username for simplicity, 
      // or we find the corresponding ID. We'll pass username to it based on our API design.
      await removeSaved(username);
      setSaved((prev) => prev.filter((p) => p.username !== username));
      setToastType('success');
      setToastMsg(`Removed @${username} from saved developers.`);
    } catch (err) {
      setToastType('error');
      setToastMsg(err.message || `Failed to remove @${username}.`);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-medium">
          🔖 Saved Developers
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">
          Your Collection
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Quickly access your favorite developer profiles.
        </p>
      </div>

      {loading ? (
        <PageLoader text="Loading saved developers…" />
      ) : error ? (
        <ErrorMessage
          title="Could not load collection"
          message={error}
          onRetry={loadSaved}
        />
      ) : saved.length === 0 ? (
        <EmptyState 
          icon="📥"
          title="No saved developers yet"
          description="You haven't saved any developers yet. Go to a developer's profile and save them to see them here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((profile) => (
            <SavedCard
              key={profile.username}
              profile={profile}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg('')}
      />
    </div>
  );
};

export default Saved;
