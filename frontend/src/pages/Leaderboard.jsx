import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/leaderboard');
        const data = await res.json();
        if (res.ok) {
          setTopUsers((Array.isArray(data) ? data : []).filter((user) => user.role === 'tourist'));
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const currentMonthLabel = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return <div className="text-center py-20 font-black text-[#0a192f]">Loading leaderboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#0a192f] mb-4 tracking-tighter">
            Monthly <span className="text-[#00df9a]">Leaderboard</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Top contributors for {currentMonthLabel}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a192f] text-white">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Rank</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Explorer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Badges</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Contribution XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topUsers.length > 0 ? (
                topUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <span
                        className={`w-10 h-10 flex items-center justify-center rounded-2xl font-black text-sm ${
                          index === 0
                            ? 'bg-yellow-400 text-[#0a192f] shadow-lg shadow-yellow-200'
                            : index === 1
                              ? 'bg-gray-200 text-gray-700'
                              : index === 2
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            user.profilePicture
                              ? user.profilePicture.startsWith('http')
                                ? user.profilePicture
                                : `http://localhost:5000${user.profilePicture}`
                              : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                          }
                          alt="Avatar"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                        />
                        <div>
                          <p className="font-black text-[#0a192f]">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Total XP {user.points || 0}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        {user.badges && user.badges.length > 0 ? (
                          user.badges.map((badge) => (
                            <span
                              key={badge}
                              className="bg-[#00df9a]/10 text-[#006a4e] text-[9px] px-3 py-1 rounded-full font-black uppercase border border-[#00df9a]/20"
                            >
                              {badge}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-300 text-[10px] font-bold">No Badges Yet</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[#0a192f] font-black text-lg tabular-nums">
                        {((user.leaderboardPoints ?? user.monthlyPoints ?? user.points) || 0).toLocaleString()} <span className="text-[10px] text-[#00df9a]">XP</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-sm font-bold text-slate-400">
                    No tourist contributors found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 bg-gradient-to-r from-[#0a192f] to-[#112240] rounded-[2rem] p-8 text-center shadow-xl border border-white/10">
          <p className="text-white font-bold mb-2">Monthly ranking is calculated from reviews and shared travel experiences.</p>
          <p className="text-gray-400 text-xs">
            Earn more XP by posting helpful reviews, sharing experiences, and staying active this month.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
