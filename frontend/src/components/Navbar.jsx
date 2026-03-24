import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; 

const Navbar = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage(); 
  const token = localStorage.getItem('token');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en';
    changeLanguage(newLang); 
    window.location.reload(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); 
    navigate('/login'); 
    window.location.reload(); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-[#0a192f]/95 backdrop-blur-md border-b border-gray-800 shadow-xl flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-[#00df9a]/40 bg-white p-0.5">
              <img className="h-full w-full rounded-full object-cover" src="https://as1.ftcdn.net/jpg/06/11/80/70/1000_F_611807025_qxIMBBULlsQFvTaDG5HKyujZTLV0xfOC.jpg" alt="Logo" />
            </div>
            <span className="ml-3 font-bold text-white group-hover:text-[#00df9a] transition-colors">GENIE<span className="text-[#00df9a]">.</span></span>
          </Link>
          <div className="hidden md:flex items-center space-x-7 ml-10">
            <Link to="/" className="text-gray-300 hover:text-[#00df9a] font-medium text-sm uppercase">Home</Link>
            <Link to="/country/bangladesh" className="text-gray-300 hover:text-[#00df9a] font-medium text-sm uppercase">Destinations</Link>
            <Link to="/about" className="text-gray-300 hover:text-[#00df9a] font-medium text-sm uppercase">About</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleLanguage} className="text-xs font-bold border border-[#00df9a]/50 text-[#00df9a] px-3 py-1.5 rounded-md hover:bg-[#00df9a] hover:text-[#0a192f] transition-all">
            {language === 'en' ? 'BN' : 'EN'}
          </button>
          {!token ? (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 font-bold px-4 py-2 hover:text-[#00df9a]">Log in</Link>
              <Link to="/signup" className="bg-[#00df9a] text-[#0a192f] px-6 py-2 rounded-full font-bold shadow-lg">Sign up</Link>
            </div>
          ) : (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="h-10 w-10 rounded-full bg-[#006a4e] text-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 text-gray-700">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Log Out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;