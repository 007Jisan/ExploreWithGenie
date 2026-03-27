import React, { useState } from 'react';

const Recommendation = () => {
  const [budget, setBudget] = useState('Medium');
  const [duration, setDuration] = useState('1-3 Days');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // ডেমো ইউজার আইডি (যেহেতু অথেনটিকেশন এখনো পুরোপুরি যুক্ত হয়নি)
  const MOCK_USER_ID = "65eabcd1234567890abcdef1"; 

  const getRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: ইউজারের পছন্দ সেভ করা
      await fetch(`http://localhost:5000/api/users/${MOCK_USER_ID}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetPreference: budget, tripDurationPreference: duration })
      });

      // Step 2: রিকমেন্ডেশন ফেচ করা
      const res = await fetch(`http://localhost:5000/api/users/${MOCK_USER_ID}/recommendations`);
      const data = await res.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Recommendation fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl my-10 shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Genie's Recommendations</h2>
        <p className="text-gray-600 mt-2">Tell us your preference, we will find the perfect spot for you!</p>
      </div>

      <form onSubmit={getRecommendations} className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
        <select 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)}
          className="p-3 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="Low">Low Budget (Under 3000 BDT)</option>
          <option value="Medium">Medium Budget (3000-8000 BDT)</option>
          <option value="High">Premium Budget (Above 8000 BDT)</option>
        </select>

        <select 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)}
          className="p-3 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="1 Day">Day Trip (1 Day)</option>
          <option value="1-3 Days">Short Trip (1-3 Days)</option>
          <option value="4+ Days">Long Vacation (4+ Days)</option>
        </select>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          {loading ? 'Finding Magic...' : 'Inspire Me 🧞‍♂️'}
        </button>
      </form>

      {/* Recommended Spots Display */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((spot) => (
            <div key={spot._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <img src={spot.mainImage} alt={spot.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1">{spot.name}</h3>
                <p className="text-gray-500 text-sm mb-2">📍 {spot.location}</p>
                <p className="text-gray-700 text-sm line-clamp-2">{spot.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;