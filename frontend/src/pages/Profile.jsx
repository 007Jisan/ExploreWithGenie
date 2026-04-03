import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    address: '',
    bio: '',
    profilePicture: '',
    points: 0,
    budgetPreference: '',
    tripDurationPreference: '',
    interests: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [experienceStatus, setExperienceStatus] = useState('');
  const [experienceError, setExperienceError] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    location: '',
    story: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchExperiences = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/experiences?mine=true', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setExperiences(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setMyBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchProfile();
    fetchExperiences();
    fetchBookings();
  }, [token, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: user.address,
          bio: user.bio,
          budgetPreference: user.budgetPreference,
          tripDurationPreference: user.tripDurationPreference,
          interests: Array.isArray(user.interests)
            ? user.interests
            : String(user.interests || '')
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || 'Profile update failed.');
        return;
      }

      setUser(data);
      setIsEditing(false);
      setStatusMessage(t('profileUpdated'));
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err) {
      setErrorMessage('Save failed.');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://localhost:5000/api/auth/upload-avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || 'Upload failed.');
        return;
      }

      setUser((prev) => ({ ...prev, profilePicture: data.imageUrl }));
      setStatusMessage(t('profilePictureUpdated'));
      setErrorMessage('');
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err) {
      setErrorMessage('Avatar upload failed.');
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    setExperienceStatus('');
    setExperienceError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setExperienceError(data.message || 'Failed to share experience.');
        return;
      }

      setExperiences((prev) => [data.experience, ...prev]);
      setExperienceForm({ title: '', location: '', story: '' });
      setExperienceStatus(data.message || 'Travel experience shared successfully.');
      setUser((prev) => ({ ...prev, points: data.totalPoints ?? prev.points }));
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err) {
      setExperienceError('Failed to share experience.');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'Explorer'}`;
    return path.startsWith('http') ? path : `http://localhost:5000${path}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-28 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-[#0a192f] rounded-[2.5rem] p-10 shadow-2xl flex flex-col md:flex-row items-center gap-10">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={getImageUrl(user.profilePicture)} alt="Avatar" className="w-44 h-44 rounded-[2rem] object-cover border-4 border-white/10" />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter">{user.name || 'Explorer'}</h1>
            <div className="flex justify-center md:justify-start gap-4">
              <span className="bg-white/10 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">{user.role}</span>
              <span className="bg-[#00df9a] text-[#0a192f] px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#00df9a]/20">
                {user.points} XP
              </span>
            </div>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10">
            {isEditing ? t('cancel') : t('editProfile')}
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100">
          {statusMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              {statusMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('fullName')}</label>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none transition-all font-bold text-[#0a192f] disabled:bg-slate-50/50"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('phoneNumber')}</label>
                <input
                  value={user.phone || ''}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+880..."
                  className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none transition-all font-bold text-[#0a192f] disabled:bg-slate-50/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('currentAddress')}</label>
              <input
                value={user.address || ''}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                disabled={!isEditing}
                placeholder="Your City, Country"
                className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none transition-all font-bold text-[#0a192f] disabled:bg-slate-50/50"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('travelerBio')}</label>
              <textarea
                value={user.bio || ''}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                disabled={!isEditing}
                placeholder="Tell us about your travels..."
                rows="4"
                className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none transition-all font-bold text-[#0a192f] resize-none disabled:bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('budgetPreference')}</label>
                <select
                  value={user.budgetPreference || ''}
                  onChange={(e) => setUser({ ...user, budgetPreference: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none transition-all font-bold text-[#0a192f] disabled:bg-slate-50/50"
                >
                  <option value="">{t('selectBudget')}</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('tripDuration')}</label>
                <select
                  value={user.tripDurationPreference || ''}
                  onChange={(e) => setUser({ ...user, tripDurationPreference: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none transition-all font-bold text-[#0a192f] disabled:bg-slate-50/50"
                >
                  <option value="">{t('selectDuration')}</option>
                  <option value="1 Day">1 Day</option>
                  <option value="1-3 Days">1-3 Days</option>
                  <option value="4+ Days">4+ Days</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('travelInterests')}</label>
              <input
                value={Array.isArray(user.interests) ? user.interests.join(', ') : user.interests || ''}
                onChange={(e) => setUser({ ...user, interests: e.target.value })}
                disabled={!isEditing}
                placeholder="Beach, History, Nature"
                className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none transition-all font-bold text-[#0a192f] disabled:bg-slate-50/50"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button type="submit" className="bg-[#0a192f] text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl">
                  {t('saveRecords')}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#0a192f] tracking-tight">Share Travel Experience</h2>
              <p className="text-slate-500 font-semibold mt-2">Post your travel story and earn 15 XP automatically.</p>
            </div>
            <div className="bg-[#00df9a]/10 text-[#0a192f] px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              Rewards Active
            </div>
          </div>

          {experienceStatus && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              {experienceStatus}
            </div>
          )}
          {experienceError && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {experienceError}
            </div>
          )}

          <form onSubmit={handleExperienceSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                required
                value={experienceForm.title}
                onChange={(e) => setExperienceForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Experience title"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none font-bold text-[#0a192f]"
              />
              <input
                value={experienceForm.location}
                onChange={(e) => setExperienceForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Location"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none font-bold text-[#0a192f]"
              />
            </div>
            <textarea
              required
              rows="5"
              value={experienceForm.story}
              onChange={(e) => setExperienceForm((prev) => ({ ...prev, story: e.target.value }))}
              placeholder="Share your travel experience, favorite moments, budget tips, and helpful advice for other travelers..."
              className="w-full px-6 py-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-[#00df9a] outline-none font-bold text-[#0a192f] resize-none"
            />
            <div className="flex justify-end">
              <button type="submit" className="bg-[#0a192f] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#00df9a] hover:text-[#0a192f] transition-all">
                Post Experience
              </button>
            </div>
          </form>

          <div className="mt-10 space-y-4">
            {experiences.length > 0 ? (
              experiences.map((experience) => (
                <div key={experience._id} className="rounded-[2rem] border border-slate-100 bg-slate-50 px-6 py-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-black text-[#0a192f]">{experience.title}</h3>
                      <p className="text-sm text-slate-500 font-semibold">
                        {experience.location || 'Bangladesh'} • {new Date(experience.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-[#00df9a]/10 text-[#0a192f] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                      +15 XP
                    </span>
                  </div>
                  <p className="text-slate-600 leading-7 font-semibold">{experience.story}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] border-2 border-dashed border-slate-200 py-12 text-center text-slate-400 font-bold">
                No travel experiences posted yet.
              </div>
            )}
          </div>
        </div>

        {String(user.role || '').toLowerCase() === 'tourist' && (
          <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-[#0a192f]">My Booking History</h2>
            </div>

            {myBookings.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">You haven't booked any packages yet.</p>
                <button onClick={() => navigate('/packages')} className="mt-4 text-[#00df9a] font-bold hover:underline">
                  Explore Packages
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <div key={booking._id} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="mb-3 sm:mb-0 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-[#0a192f]">{booking.package?.title || 'Unknown Package'}</h3>
                      <p className="text-sm text-gray-500">Agency: {booking.agency?.name || 'Unknown agency'}</p>
                      <p className="text-xs text-gray-400 mt-1">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end">
                      <span className="font-bold text-[#0a192f] mb-1">৳{booking.package?.price || '0'}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
