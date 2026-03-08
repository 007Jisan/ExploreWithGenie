import React from 'react';
import { Link } from 'react-router-dom';

const CountryCard = ({ country }) => {
  return (
    <div 
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative h-80 flex flex-col ${!country.active ? 'opacity-90' : 'cursor-pointer'}`}
    >
      {/* ইমেইজ এবং হোভার এনিমেশন */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={country.image} 
          alt={country.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${country.active ? 'group-hover:scale-110' : 'grayscale'}`}
        />
        
        {/* ছবির নিচের দিকে ডার্ক শ্যাডো (Premium look এর জন্য) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Coming Soon ব্যাজ (শুধু ইনঅ্যাকটিভ দেশের জন্য) */}
        {!country.active && (
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <span>🔒</span> Coming Soon
          </div>
        )}
      </div>

      {/* দেশের নাম ও ডিটেইলস */}
      <div className="p-5 flex-grow flex flex-col justify-center bg-white border-t border-gray-50 relative z-20">
        <h3 className="text-xl font-extrabold text-[#111f36] mb-1 group-hover:text-[#00b4d8] transition-colors">
          {country.name}
        </h3>
        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
          {country.active ? (
            <span className="text-[#00b4d8] flex items-center gap-1 font-bold">
              Explore Now 
              {/* ছোট অ্যারো আইকন যা হোভার করলে ডানদিকে সরবে */}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          ) : (
            <span className="text-gray-400">Not Available Yet</span>
          )}
        </p>
      </div>
      
      {/* ক্লিকেবল লিংক ওভারলে (শুধু Active দেশের জন্য কাজ করবে) */}
      {country.active && (
        <Link 
          to={`/country/${country.name.toLowerCase()}`} 
          className="absolute inset-0 z-10" 
          aria-label={`Explore ${country.name}`}
        ></Link>
      )}
    </div>
  );
};

export default CountryCard;