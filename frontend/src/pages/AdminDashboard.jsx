import React, { useEffect, useState } from 'react';

const emptySpotForm = {
  name: '',
  category: 'Popular',
  location: '',
  mainImage: '',
  description: '',
  bestVisitingTime: '',
  estimatedBudget: '',
  nearbyHotels: '',
  safetyTips: '',
  lat: '',
  lng: '',
};

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgencies: 0,
    pendingAgencies: 0,
    totalReviews: 0,
    totalExperiences: 0,
  });
  const [users, setUsers] = useState([]);
  const [spots, setSpots] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [editingSpotId, setEditingSpotId] = useState('');
  const [spotForm, setSpotForm] = useState(emptySpotForm);

  const fetchAdminData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(statsData);

      const usersRes = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      if (usersRes.ok) setUsers(usersData);

      const spotsRes = await fetch('http://localhost:5000/api/admin/spots', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const spotsData = await spotsRes.json();
      if (spotsRes.ok) setSpots(spotsData);

      const experiencesRes = await fetch('http://localhost:5000/api/admin/experiences', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const experiencesData = await experiencesRes.json();
      if (experiencesRes.ok) setExperiences(experiencesData);
    } catch (err) {
      setErrorMessage('Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) fetchAdminData();
  }, [token]);

  const handleVerify = async (id) => {
    setStatusMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/verify-agency/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(data.message);
        fetchAdminData();
      } else {
        setErrorMessage(data.message || 'Verification failed.');
      }
    } catch (err) {
      setErrorMessage('Verification failed.');
    }
  };

  const handleDeleteReview = async (spotId, reviewId) => {
    setStatusMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/review/${spotId}/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSpots((prev) =>
          prev.map((spot) =>
            spot._id === spotId
              ? {
                  ...spot,
                  reviews: (spot.reviews || []).filter((review) => review._id !== reviewId),
                }
              : spot
          )
        );
        setStatusMessage(data.message || 'Review removed successfully.');
      } else {
        setErrorMessage(data.message || 'Failed to remove review.');
      }
    } catch (err) {
      setErrorMessage('Failed to remove review.');
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    setStatusMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/experiences/${experienceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setExperiences((prev) => prev.filter((experience) => experience._id !== experienceId));
        setStatusMessage(data.message || 'Travel experience removed successfully.');
      } else {
        setErrorMessage(data.message || 'Failed to remove experience.');
      }
    } catch (err) {
      setErrorMessage('Failed to remove experience.');
    }
  };

  const handleSaveSpot = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    const endpoint = editingSpotId
      ? `http://localhost:5000/api/admin/spots/${editingSpotId}`
      : 'http://localhost:5000/api/admin/spots';
    const method = editingSpotId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...spotForm,
          lat: Number(spotForm.lat),
          lng: Number(spotForm.lng),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSpots((prev) =>
          editingSpotId
            ? prev.map((spot) => (spot._id === data._id ? data : spot))
            : [data, ...prev]
        );
        setStatusMessage(editingSpotId ? 'Spot updated successfully.' : 'Spot created successfully.');
        setEditingSpotId('');
        setSpotForm(emptySpotForm);
      } else {
        setErrorMessage(data.message || 'Failed to save spot.');
      }
    } catch (err) {
      setErrorMessage('Failed to save spot.');
    }
  };

  const handleDeleteSpot = async (spotId) => {
    setStatusMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/spots/${spotId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setSpots((prev) => prev.filter((spot) => spot._id !== spotId));
        setStatusMessage(data.message || 'Spot removed successfully.');
        if (editingSpotId === spotId) {
          setEditingSpotId('');
          setSpotForm(emptySpotForm);
        }
      } else {
        setErrorMessage(data.message || 'Failed to delete spot.');
      }
    } catch (err) {
      setErrorMessage('Failed to delete spot.');
    }
  };

  const moderationReviews = spots.flatMap((spot) =>
    (spot.reviews || []).map((review) => ({
      ...review,
      spotId: spot._id,
      spotName: spot.name,
    }))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-xl font-black text-[#0a192f]">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-4xl font-black text-[#0a192f] tracking-tighter">
              Admin <span className="text-red-500">Control Center</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
              Manage users, agencies, spots, and moderation
            </p>
          </div>
          <div className="bg-red-50 text-red-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
            Root Access
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Total Users', value: stats.totalUsers, color: 'text-[#0a192f]', icon: '👥' },
            { label: 'Total Agencies', value: stats.totalAgencies, color: 'text-[#0a192f]', icon: '🏢' },
            { label: 'Pending Verification', value: stats.pendingAgencies, color: 'text-orange-500', icon: '🛡️' },
            { label: 'Total Reviews', value: stats.totalReviews, color: 'text-[#00df9a]', icon: '💬' },
            { label: 'Travel Stories', value: stats.totalExperiences, color: 'text-[#0a192f]', icon: '📖' },
          ].map((item) => (
            <div key={item.label} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-4">
                {item.label}
              </h3>
              <p className={`text-4xl font-black mt-2 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-2 bg-slate-100 p-2 rounded-2xl w-fit border border-slate-200/50">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
              activeTab === 'users' ? 'bg-[#0a192f] text-white shadow-lg' : 'text-slate-500'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('spots')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
              activeTab === 'spots' ? 'bg-[#0a192f] text-white shadow-lg' : 'text-slate-500'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
              activeTab === 'reviews' ? 'bg-[#0a192f] text-white shadow-lg' : 'text-slate-500'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
              activeTab === 'experiences' ? 'bg-[#0a192f] text-white shadow-lg' : 'text-slate-500'
            }`}
          >
            Stories
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-[#0a192f] p-8 border-b border-white/10">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em]">
                User Management & Verification
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                            <img
                              src={
                                user.profilePicture
                                  ? user.profilePicture.startsWith('http')
                                    ? user.profilePicture
                                    : `http://localhost:5000${user.profilePicture}`
                                  : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                              }
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-black text-[#0a192f] text-sm">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-slate-100 text-slate-600 border-slate-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {user.role === 'agency' ? (
                          user.isVerified ? (
                            <span className="text-[#00df9a] text-[10px] font-black uppercase tracking-widest">Verified</span>
                          ) : (
                            <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Pending</span>
                          )
                        ) : (
                          <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">—</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {user.role === 'agency' && !user.isVerified && (
                          <button
                            onClick={() => handleVerify(user._id)}
                            className="bg-[#0a192f] text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00df9a] hover:text-[#0a192f] transition-all shadow-lg"
                          >
                            Verify Agency
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'spots' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 h-fit sticky top-28">
              <h3 className="text-[#0a192f] font-black text-lg mb-6">
                {editingSpotId ? 'Update Spot' : 'Create Spot'}
              </h3>
              <form onSubmit={handleSaveSpot} className="space-y-4">
                <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Spot name" value={spotForm.name} onChange={(e) => setSpotForm((prev) => ({ ...prev, name: e.target.value }))} />
                <select className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" value={spotForm.category} onChange={(e) => setSpotForm((prev) => ({ ...prev, category: e.target.value }))}>
                  <option value="Popular">Popular</option>
                  <option value="Natural">Natural</option>
                  <option value="Historical">Historical</option>
                </select>
                <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Location" value={spotForm.location} onChange={(e) => setSpotForm((prev) => ({ ...prev, location: e.target.value }))} />
                <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Main image URL" value={spotForm.mainImage} onChange={(e) => setSpotForm((prev) => ({ ...prev, mainImage: e.target.value }))} />
                <textarea className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm resize-none" rows="4" placeholder="Description" value={spotForm.description} onChange={(e) => setSpotForm((prev) => ({ ...prev, description: e.target.value }))} />
                <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Best visiting time" value={spotForm.bestVisitingTime} onChange={(e) => setSpotForm((prev) => ({ ...prev, bestVisitingTime: e.target.value }))} />
                <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Estimated budget" value={spotForm.estimatedBudget} onChange={(e) => setSpotForm((prev) => ({ ...prev, estimatedBudget: e.target.value }))} />
                <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Nearby hotels" value={spotForm.nearbyHotels} onChange={(e) => setSpotForm((prev) => ({ ...prev, nearbyHotels: e.target.value }))} />
                <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Safety tips" value={spotForm.safetyTips} onChange={(e) => setSpotForm((prev) => ({ ...prev, safetyTips: e.target.value }))} />
                <div className="grid grid-cols-2 gap-4">
                  <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Latitude" value={spotForm.lat} onChange={(e) => setSpotForm((prev) => ({ ...prev, lat: e.target.value }))} />
                  <input className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm" placeholder="Longitude" value={spotForm.lng} onChange={(e) => setSpotForm((prev) => ({ ...prev, lng: e.target.value }))} />
                </div>
                <button className="w-full bg-[#00df9a] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                  {editingSpotId ? 'Save Spot' : 'Create Spot'}
                </button>
                {editingSpotId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSpotId('');
                      setSpotForm(emptySpotForm);
                    }}
                    className="w-full bg-slate-100 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {spots.map((spot) => (
                <div key={spot._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between gap-6">
                  <div className="flex gap-5">
                    <img src={spot.mainImage} alt={spot.name} className="w-32 h-24 rounded-2xl object-cover" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#00a36c]">{spot.category}</p>
                      <h4 className="font-black text-[#0a192f] text-lg">{spot.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{spot.location}</p>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2">{spot.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <button
                      onClick={() => {
                        setEditingSpotId(spot._id);
                        setSpotForm({
                          name: spot.name || '',
                          category: spot.category || 'Popular',
                          location: spot.location || '',
                          mainImage: spot.mainImage || '',
                          description: spot.description || '',
                          bestVisitingTime: spot.bestVisitingTime || '',
                          estimatedBudget: spot.estimatedBudget || '',
                          nearbyHotels: spot.nearbyHotels || '',
                          safetyTips: spot.safetyTips || '',
                          lat: spot.lat || '',
                          lng: spot.lng || '',
                        });
                      }}
                      className="block ml-auto text-[10px] font-black text-[#0a192f] uppercase hover:underline"
                    >
                      Edit Spot
                    </button>
                    <button
                      onClick={() => handleDeleteSpot(spot._id)}
                      className="block ml-auto text-[10px] font-black text-rose-500 uppercase mt-2 hover:underline"
                    >
                      Delete Spot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-[#0a192f] p-8 border-b border-white/10">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em]">
                Review Moderation
              </h3>
            </div>
            <div className="p-8 space-y-4">
              {moderationReviews.length > 0 ? (
                moderationReviews.map((review) => (
                  <div key={review._id} className="border border-slate-100 rounded-[1.75rem] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{review.spotName}</p>
                      <p className="text-sm font-black text-[#0a192f] mt-2">{review.userName} • {review.rating}/5</p>
                      <p className="text-sm text-slate-500 mt-2">{review.comment}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.spotId, review._id)}
                      className="bg-rose-50 text-rose-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100"
                    >
                      Remove Review
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No tourist spot reviews found for moderation.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'experiences' && (
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-[#0a192f] p-8 border-b border-white/10">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em]">
                Travel Experience Moderation
              </h3>
            </div>
            <div className="p-8 space-y-4">
              {experiences.length > 0 ? (
                experiences.map((experience) => (
                  <div key={experience._id} className="border border-slate-100 rounded-[1.75rem] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {experience.location || 'Bangladesh'}
                      </p>
                      <p className="text-sm font-black text-[#0a192f] mt-2">
                        {experience.userName} • {experience.title}
                      </p>
                      <p className="text-sm text-slate-500 mt-2">{experience.story}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(experience._id)}
                      className="bg-rose-50 text-rose-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100"
                    >
                      Remove Story
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No travel experiences found for moderation.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
