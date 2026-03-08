import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // ব্রাউজারের স্টোরেজ থেকে টোকেন আর রোল নিচ্ছি
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // লগআউট করার ফাংশন
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); 
    setIsDropdownOpen(false);
    navigate('/login'); 
    window.location.reload(); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-[#0a192f]/95 backdrop-blur-md border-b border-gray-800 shadow-xl flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          
          {/* লেফট সাইড: লোগো এবং মেইন লিংকস */}
          <div className="flex items-center">
            
            {/* 🔥 লোগো এবং নাম */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <div className="h-11 w-11 md:h-12 md:w-12 rounded-full overflow-hidden border-2 border-[#00df9a]/40 bg-white p-0.5 shadow-md group-hover:border-[#00df9a] transition-all duration-300">
                <img 
                  className="h-full w-full rounded-full object-cover" 
                  src="https://as1.ftcdn.net/jpg/06/11/80/70/1000_F_611807025_qxIMBBULlsQFvTaDG5HKyujZTLV0xfOC.jpg" 
                  alt="Genie Logo" 
                />
              </div>
              
              <span className="ml-3 font-bold text-lg md:text-xl text-white tracking-tight group-hover:text-[#00df9a] transition-colors duration-300">
                GENIE<span className="text-[#00df9a]">.</span>
              </span>
            </Link>

            {/* ন্যাভিগেশন লিংকস */}
            <div className="hidden md:flex items-center space-x-7 ml-10">
              <Link to="/" className="text-gray-300 hover:text-[#00df9a] font-medium transition-all text-sm uppercase tracking-wider relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00df9a] transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/country/bangladesh" className="text-gray-300 hover:text-[#00df9a] font-medium transition-all text-sm uppercase tracking-wider relative group">
                Destinations
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00df9a] transition-all group-hover:w-full"></span>
              </Link>
              {/* About Link */}
              <Link to="/about" className="text-gray-300 hover:text-[#00df9a] font-medium transition-all text-sm uppercase tracking-wider relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00df9a] transition-all group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* রাইট সাইড: Login/Signup বা User Dropdown */}
          <div className="flex items-center relative">
            {!token ? (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 font-bold px-4 py-2 hover:text-[#00df9a] transition-all">Log in</Link>
                <Link to="/signup" className="bg-[#00df9a] text-[#0a192f] px-6 py-2 rounded-full font-bold shadow-lg hover:brightness-110 transition-all transform active:scale-95">
                  Sign up
                </Link>
              </div>
            ) : (
              <div>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-[#006a4e] text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00df9a] transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 animate-fadeInDown">
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </Link>
                    
                    <Link to="/leaderboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      Leaderboard
                    </Link>
                    
                    {(userRole === 'agency' || userRole === 'admin') && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        {userRole === 'agency' && (
                          <Link to="/agency-login" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-green-700 font-bold hover:bg-green-50">
                            Agency Dashboard
                          </Link>
                        )}
                        {userRole === 'admin' && (
                          <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-blue-700 font-bold hover:bg-blue-50">
                            Admin Panel
                          </Link>
                        )}
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;