import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Recommendation = ({ initialPreferences = {} }) => {
  const token = localStorage.getItem('token');
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState({
    budgetPreference: initialPreferences.budgetPreference || 'Medium',
    tripDurationPreference: initialPreferences.tripDurationPreference || '1-3 Days',
    interests:
      Array.isArray(initialPreferences.interests) && initialPreferences.interests.length > 0
        ? initialPreferences.interests.join(', ')
        : 'History, Nature',
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const getRecommendations = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login first to get personalized recommendations.');
      return;
    }

    setLoading(true);
    setStatus('');
    setError('');

    try {
      const saveRes = await fetch('http://localhost:5000/api/auth/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          budgetPreference: preferences.budgetPreference,
          tripDurationPreference: preferences.tripDurationPreference,
          interests: preferences.interests
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        setError(saveData.message || 'Could not save travel preferences.');
        setLoading(false);
        return;
      }

      const recommendationRes = await fetch('http://localhost:5000/api/auth/recommendations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const recommendationData = await recommendationRes.json();

      if (recommendationRes.ok) {
        setRecommendations(recommendationData);
        setStatus(t('recommendationUpdated'));
      } else {
        setError(recommendationData.message || 'Failed to load recommendations.');
      }
    } catch (errorValue) {
      setError('Recommendation service is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0a192f]">{t('recommendationTitle')}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('recommendationSubtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={getRecommendations} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_2fr_auto] gap-4 items-end">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {t('budgetPreference')}
          </label>
          <select
            value={preferences.budgetPreference}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, budgetPreference: e.target.value }))
            }
            className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-200 text-sm font-bold"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {t('tripDuration')}
          </label>
          <select
            value={preferences.tripDurationPreference}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, tripDurationPreference: e.target.value }))
            }
            className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-200 text-sm font-bold"
          >
            <option value="1 Day">1 Day</option>
            <option value="1-3 Days">1-3 Days</option>
            <option value="4+ Days">4+ Days</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {t('travelInterests')}
          </label>
          <input
            type="text"
            value={preferences.interests}
            onChange={(e) => setPreferences((prev) => ({ ...prev, interests: e.target.value }))}
            placeholder="History, Beach, Adventure"
            className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-200 text-sm font-bold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#00df9a] text-[#0a192f] px-6 py-4 rounded-xl font-black text-sm disabled:opacity-60"
        >
          {loading ? t('finding') : t('getMatches')}
        </button>
      </form>

      {status && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {status}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {recommendations.map((spot) => (
            <div key={spot._id} className="bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-200">
              <img src={spot.mainImage} alt={spot.name} className="w-full h-44 object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-lg text-[#0a192f]">{spot.name}</h3>
                  <span className="text-[11px] font-black text-[#00a36c] uppercase">
                    {spot.category || 'Popular'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">{spot.location}</p>
                <p className="text-sm text-slate-600 mt-3 line-clamp-3">{spot.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-black text-[#0a192f]">{spot.estimatedBudget}</span>
                  <Link
                    to={`/spots/${spot._id}`}
                    className="text-sm font-black text-[#00a36c] hover:underline"
                  >
                    View Spot
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;
