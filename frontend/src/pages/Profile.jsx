import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [user, setUser] = useState({
    name: 'Loading...',
    email: '',
    role: '',
    phone: '',
    address: '',
    bio: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🟢 ১. ব্যাকএন্ড থেকে প্রোফাইল ডাটা লোড করা
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.name || '',
            email: data.email || '',
            role: data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1) : 'Tourist',
            phone: data.phone || '',
            address: data.address || '',
            bio: data.bio || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🟢 ২. ব্যাকএন্ডে প্রোফাইল আপডেট পাঠানো
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: user.address,
          bio: user.bio
        })
      });

      if (response.ok) {
        alert('Profile updated successfully! 🎉');
        setIsEditing(false);
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Update Error:', error);
      alert('Server error while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 sm:h-48 bg-gradient-to-r from-[#0a192f] to-teal-800"></div>
          <div className="px-6 sm:px-10 pb-8 relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full p-1.5 shadow-lg relative">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=00df9a&textColor=0a192f`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover bg-gray-100"
              />
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-2 right-2 bg-[#00df9a] text-[#0a192f] p-2 rounded-full shadow-md hover:bg-[#00c789] transition-transform active:scale-95 flex items-center justify-center"
                title="Edit Profile"
              >
                ✏️
              </button>
            </div>
            
            <div className="text-center sm:text-left flex-1 pb-2">
              <h1 className="text-3xl font-extrabold text-[#0a192f]">{user.name}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-teal-100">
                <span>{user.role === 'Admin' ? '🛡️' : user.role === 'Agency' ? '🏢' : '🎒'}</span>
                {user.role} Account
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details / Edit Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-[#0a192f]">
              {isEditing ? 'Edit Personal Info' : 'Personal Information'}
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={user.name} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${isEditing ? 'border-teal-300 bg-teal-50 focus:ring-2 focus:ring-[#00df9a] outline-none' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-colors`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={user.phone} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+880 1XXXXXXXXX"
                  className={`w-full px-4 py-3 rounded-xl border ${isEditing ? 'border-teal-300 bg-teal-50 focus:ring-2 focus:ring-[#00df9a] outline-none' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-colors`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={user.address} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Dhaka, Bangladesh"
                  className={`w-full px-4 py-3 rounded-xl border ${isEditing ? 'border-teal-300 bg-teal-50 focus:ring-2 focus:ring-[#00df9a] outline-none' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-colors`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio / About Me</label>
                <textarea 
                  name="bio" 
                  value={user.bio} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Write something about yourself..."
                  className={`w-full px-4 py-3 rounded-xl border resize-none ${isEditing ? 'border-teal-300 bg-teal-50 focus:ring-2 focus:ring-[#00df9a] outline-none' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-colors`}
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 animate-fadeInUp">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl font-bold text-[#0a192f] bg-[#00df9a] hover:bg-[#00c789] shadow-md transition-transform active:scale-95 disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;