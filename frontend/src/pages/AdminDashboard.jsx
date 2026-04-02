import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [spots, setSpots] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' অথবা 'reviews' ট্যাব

  useEffect(() => {
    fetchUsers();
    fetchSpots();
  }, []);

  // সব ইউজারদের ডাটা আনার ফাংশন
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) { console.error("Error fetching users:", error); }
  };

  // সব স্পট ও রিভিউ আনার ফাংশন
  const fetchSpots = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/spots');
      const data = await res.json();
      setSpots(data);
    } catch (error) { console.error("Error fetching spots:", error); }
  };

  // রিভিউ ডিলিট করার ফাংশন
  const handleDeleteReview = async (spotId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/spots/${spotId}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchSpots(); // ডিলিট হলে লিস্টটা রিফ্রেশ করবে
    } catch (error) { console.error("Error deleting review:", error); }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-[#0a192f]">
            <span className="text-teal-500 mr-2">🛡️</span> Admin Panel
          </h2>
        </div>

        {/* 🟢 ট্যাব বাটন */}
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-2 font-bold rounded-lg ${activeTab === 'users' ? 'bg-[#0a192f] text-[#00df9a]' : 'bg-gray-100 text-gray-600'}`}>
            👥 Manage Users
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-6 py-2 font-bold rounded-lg ${activeTab === 'reviews' ? 'bg-[#0a192f] text-[#00df9a]' : 'bg-gray-100 text-gray-600'}`}>
            🚩 Manage Reviews
          </button>
        </div>

        {/* 🟢 Users ট্যাব */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-4 rounded-tl-lg">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 rounded-tr-lg">Points</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-bold text-[#0a192f]">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-teal-100 text-teal-700' : user.role === 'agency' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#00df9a]">{user.points || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🟢 Reviews ট্যাব */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {spots.map(spot => (
              spot.reviews && spot.reviews.length > 0 && (
                <div key={spot._id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-lg text-[#0a192f] mb-3">📍 {spot.name}</h3>
                  <div className="space-y-3">
                    {spot.reviews.map(review => (
                      <div key={review._id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div>
                          <p className="font-bold text-sm text-gray-800">{review.userName} <span className="text-yellow-500">⭐ {review.rating}</span></p>
                          <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                        </div>
                        <button onClick={() => handleDeleteReview(spot._id, review._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 font-bold text-sm">
                          🗑️ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;