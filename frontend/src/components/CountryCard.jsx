import React from 'react';
import { Link } from 'react-router-dom';

const CountryCard = ({ country }) => {
  return (
    <div className={`bg-white rounded-[15px] overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative h-[320px] cursor-pointer ${!country.active && 'opacity-80 grayscale'}`}>
      <img 
        src={country.image} 
        alt={country.name} 
        className="w-full h-[200px] object-cover"
      />
      <div className="p-[15px]">
        <div className="text-[1.1rem] font-bold mb-1 text-dark">{country.name}</div>
        <div className="text-[0.85rem] text-gray-500 flex items-center gap-1">
          {country.active ? 'Click to Explore' : 'Coming Soon 🔒'}
        </div>
      </div>
      
      {/* Clickable link overlay shudhu active country (Bangladesh) er jonne */}
      {country.active && (
        <Link to={`/country/${country.name.toLowerCase()}`} className="absolute inset-0 z-10"></Link>
      )}
    </div>
  );
};

export default CountryCard;