import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const token = localStorage.getItem('token');
  const userRole = (localStorage.getItem('role') || 'tourist').toLowerCase();
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUserData(data);
    } catch (err) {
      console.error('Navbar sync error:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUser();
    window.addEventListener('profile-updated', fetchUser);
    return () => window.removeEventListener('profile-updated', fetchUser);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsDropdownOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const getProfileImage = () => {
    if (userData?.profilePicture) {
      return userData.profilePicture.startsWith('http')
        ? userData.profilePicture
        : `http://localhost:5000${userData.profilePicture}`;
    }

    return '';
  };

  const getInitials = () => {
    const name = (userData?.name || 'Explorer').trim();
    if (!name) return 'E';

    const parts = name.split(/\s+/).slice(0, 2);
    return parts.map((part) => part.charAt(0).toUpperCase()).join('');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#16253c] shadow-[0_8px_30px_rgba(15,23,42,0.18)]">
      <div className="max-w-[1280px] mx-auto h-[84px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-[54px] h-[54px] rounded-full bg-white border-[3px] border-[#9af2dd] flex items-center justify-center shadow-sm overflow-hidden">
              <img
                src="https://as1.ftcdn.net/jpg/06/11/80/70/1000_F_611807025_qxIMBBULlsQFvTaDG5HKyujZTLV0xfOC.jpg"
                alt="Genie logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-[20px] font-extrabold tracking-tight">
              GENIE<span className="text-[#22d3a8]">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-[#d9dde6] text-[15px] font-extrabold uppercase tracking-wide hover:text-white">
              {t('navHome')}
            </Link>
            <Link to="/country/bangladesh" className="text-[#d9dde6] text-[15px] font-extrabold uppercase tracking-wide hover:text-white">
              {t('navDestinations')}
            </Link>
            <Link to="/leaderboard" className="text-[#d9dde6] text-[15px] font-extrabold uppercase tracking-wide hover:text-white">
              {t('navLeaderboard')}
            </Link>
            <Link to="/packages" className="text-[#d9dde6] text-[15px] font-extrabold uppercase tracking-wide hover:text-white">
              {language === 'bn' ? 'ট্যুর প্যাকেজ' : 'Tour Packages'}
            </Link>
            <Link to="/about" className="text-[#d9dde6] text-[15px] font-extrabold uppercase tracking-wide hover:text-white">
              {t('navAbout')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => changeLanguage(language === 'en' ? 'bn' : 'en')}
            className="px-3 py-2 rounded-full border border-white/10 text-white text-xs font-black uppercase tracking-widest bg-white/5"
          >
            {language === 'en' ? 'বাংলা' : 'English'}
          </button>

          {token ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-[44px] h-[44px] rounded-full bg-[#0b8b70] flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-[#9af2dd]/30"
              >
                {getProfileImage() ? (
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span
                  style={{ display: getProfileImage() ? 'none' : 'flex' }}
                  className="w-full h-full items-center justify-center text-white text-xs font-black tracking-wide bg-gradient-to-br from-[#14c79a] to-[#0b8b70]"
                >
                  {getInitials()}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl py-2 text-gray-700 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <p className="text-xs font-black text-[#0a192f] truncate">{userData?.name || 'Explorer'}</p>
                    <p className="text-[10px] text-[#00b894] font-bold uppercase tracking-widest">{userRole}</p>
                  </div>

                  {userRole === 'admin' && (
                    <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 hover:bg-slate-50 font-bold text-xs">
                      Admin Panel
                    </Link>
                  )}

                  {userRole === 'agency' && (
                    <Link to="/agency-dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 hover:bg-slate-50 font-bold text-xs">
                      Agency Dashboard
                    </Link>
                  )}

                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 hover:bg-slate-50 font-bold text-xs">
                    My Profile
                  </Link>

                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-bold text-xs">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white font-bold text-sm">
                {t('login')}
              </Link>
              <Link to="/signup" className="bg-[#22d3a8] text-[#12233c] px-5 py-2 rounded-full font-bold text-sm">
                {t('signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
