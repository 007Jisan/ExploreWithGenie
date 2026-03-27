import React, { useState } from 'react';

const ReviewSection = ({ spotId, existingReviews = [] }) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState(existingReviews);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, rating, comment })
      });
      if (response.ok) {
        const data = await response.json();
        // নতুন রিভিও লিস্টে যোগ করা
        setReviews([...reviews, { userName: userName || 'Genie Tourist', rating, comment }]);
        setUserName('');
        setComment('');
        alert('✅ Review added successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Traveler Reviews</h3>
      
      {/* Review List */}
      <div className="mb-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((rev, index) => (
            <div key={index} className="border-b pb-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">{rev.userName}</span>
                <span className="text-yellow-500">{'⭐'.repeat(rev.rating)}</span>
              </div>
              <p className="text-gray-600 mt-1">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Submit Review Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-semibold text-lg mb-3">Write a Review</h4>
        <input 
          type="text" 
          placeholder="Your Name (Optional)" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
          <option value={3}>⭐⭐⭐ (3/5)</option>
          <option value={2}>⭐⭐ (2/5)</option>
          <option value={1}>⭐ (1/5)</option>
        </select>
        <textarea 
          required
          placeholder="Share your experience..." 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          className="w-full mb-3 p-2 border rounded h-24"
        ></textarea>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;