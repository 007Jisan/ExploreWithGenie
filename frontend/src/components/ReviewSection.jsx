import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Tourist rating + written review submission flow.
// Supports first-time submit and later update from the same user.
const ReviewSection = ({ spotId, existingReviews = [], onReviewCreated }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const currentUserId = localStorage.getItem('userId');

  const sortedReviews = [...existingReviews].sort(
    (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
  );
  const existingUserReview = sortedReviews.find(
    (review) => String(review.user) === String(currentUserId)
  );

  useEffect(() => {
    if (existingUserReview) {
      setRating(Number(existingUserReview.rating) || 5);
      setComment(existingUserReview.comment || '');
      return;
    }

    setRating(5);
    setComment('');
  }, [existingUserReview, spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setFeedbackError('');
    setFeedbackSuccess('');

    if (!token) {
      setFeedbackError(t('pleaseLoginReview'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ spotId, rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbackSuccess(data.message || 'Review submitted successfully.');
        setComment('');
        if (onReviewCreated) {
          onReviewCreated(data.newReview);
        }
      } else {
        setFeedbackError(data.message || 'Server Error');
      }
    } catch (error) {
      setFeedbackError('Network Error! Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
      <h3 className="text-xl font-black text-[#0a192f] mb-6">
        {t('reviewsTitle')} ({sortedReviews.length || 0})
      </h3>

      <div className="space-y-4 mb-8 max-h-72 overflow-y-auto pr-2">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div
              key={review._id || `${review.user}-${review.createdAt}`}
              className="bg-slate-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-[#0a192f]">{review.userName}</p>
                <p className="text-amber-500 text-sm">{'\u2605'.repeat(review.rating)}</p>
              </div>
              <p className="text-sm text-slate-600">{review.comment}</p>
              <p className="text-xs text-slate-400 mt-2">{review.date}</p>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-500">
            {t('noReviews')}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {feedbackSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {feedbackSuccess}
          </div>
        )}
        {feedbackError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {feedbackError}
          </div>
        )}
        {existingUserReview && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
            {t('alreadyReviewedSpot')}
          </div>
        )}
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#00df9a]"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your story..."
          className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#00df9a] h-28 resize-none"
        />
        <button
          disabled={loading}
          className="w-full bg-[#0a192f] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#00df9a] hover:text-[#0a192f] transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Processing...' : existingUserReview ? t('updateReview') : t('submitReview')}
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;
