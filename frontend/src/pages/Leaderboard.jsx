import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // 🟢 এই যে দেখুন, এখানেও ব্যাকএন্ড ইন্টিগ্রেট করা আছে!
    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaders(data))
      .catch(err => console.error("Error fetching leaderboard:", err));
  }, []);

  // পয়েন্টের ওপর ভিত্তি করে ব্যাজ দেওয়ার লজিক
  const getBadge = (index) => {
    if (index === 0) return '🥇 Gold Level';
    if (index === 1) return '🥈 Silver Level';
    if (index === 2) return '🥉 Bronze Level';
    return '🎖️ Explorer';
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#0a192f] mb-4">
          Monthly <span className="text-[#00df9a]">Leaderboard</span>
        </h2>
        <p className="text-gray-600">Top contributors earning points by sharing experiences and reviews.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-[#0a192f] px-6 py-4 grid grid-cols-4 text-white font-bold text-sm uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-1">Tourist</div>
          <div className="col-span-1">Achievement</div>
          <div className="col-span-1 text-right">Points</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {leaders.map((user, index) => (
            <div key={user._id} className="px-6 py-4 grid grid-cols-4 items-center hover:bg-gray-50 transition-colors">
              <div className="col-span-1 font-extrabold text-2xl text-gray-400">
                #{index + 1}
              </div>
              <div className="col-span-1 font-bold text-[#0a192f]">
                {user.name}
              </div>
              <div className="col-span-1 font-semibold text-gray-600 text-sm">
                {getBadge(index)}
              </div>
              <div className="col-span-1 text-right font-extrabold text-[#00df9a] text-xl">
                {user.points || 0}
              </div>
            </div>
          ))}
          {leaders.length === 0 && (
            <div className="p-8 text-center text-gray-500">No contributors yet. Be the first to earn points!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;