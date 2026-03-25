import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext'; // 👈 শুধু এটা যোগ করলাম

// Leaflet এর আইকন ফিক্স করার জন্য
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Bangladesh = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { t, language } = useLanguage(); // 👈 ল্যাঙ্গুয়েজ স্টেট নিলাম

  // 🚀 ডাটাবেস থেকে ডাটা আনার API
  useEffect(() => {
    fetch('http://localhost:5000/api/spots') 
      .then(res => res.json())
      .then(data => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching map data:", err));
  }, []);

  // Slider speed fixed to 2 seconds
  useEffect(() => {
    let interval;
    if (selectedSpot && selectedSpot.sliderImages && selectedSpot.sliderImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % selectedSpot.sliderImages.length
        );
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [selectedSpot]);

  const closeModal = () => {
    setSelectedSpot(null);
    setCurrentImageIndex(0);
  };

  const filteredPlaces = places.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    place.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔥 গুগল ম্যাপের একদম অফিশিয়াল লিংক
  const openDynamicRouteMap = (query) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8fafc]">
        <div className="text-2xl font-bold text-[#00df9a] animate-pulse">
          {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading Destinations...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 relative font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Clean Header - Professional Text */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a192f] mb-4">
            {language === 'bn' ? 'সুন্দর বাংলাদেশ ঘুরে দেখুন' : 'Explore Beautiful Bangladesh'} <span className="text-[#00df9a]">🇧🇩</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto mb-6 text-lg">
            {language === 'bn' 
              ? 'ঐতিহাসিক নিদর্শন, শ্বাসরুদ্ধকর ল্যান্ডস্কেপ এবং দেশের লুকানো রত্নগুলো আবিষ্কার করুন।' 
              : 'Discover historical landmarks, breathtaking landscapes, and hidden gems across the country.'}
          </p>
          <div className="h-1.5 w-24 bg-[#00df9a] mx-auto rounded-full shadow-sm mb-8"></div>
        </div>

        {/* 🔥 Filter / Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder={language === 'bn' ? 'স্পট বা লোকেশন দিয়ে খুঁজুন...' : 'Filter by spot name or location...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00df9a] shadow-sm text-gray-700 bg-white font-medium"
            />
          </div>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place, index) => (
              <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col hover:-translate-y-2">
                
                {/* Card Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img src={place.mainImage} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 via-transparent to-transparent opacity-90"></div>
                  
                  <div className="absolute top-4 right-4 bg-white/95 text-[#0a192f] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <span className="text-red-500 text-sm">📍</span> {language === 'bn' && place.locationBN ? place.locationBN : place.location}
                  </div>
                  
                  <h3 className="absolute bottom-4 left-5 text-2xl font-bold text-white tracking-wide">
                    {language === 'bn' && place.nameBN ? place.nameBN : place.name}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                    {language === 'bn' && place.descriptionBN ? place.descriptionBN : place.description}
                  </p>

                  <div className="mt-auto flex gap-3 pt-3 border-t border-gray-50">
                    <button 
                      onClick={() => setSelectedSpot(place)}
                      className="flex-1 bg-[#0a192f] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm active:scale-95"
                    >
                      {t('exploreBtn')}
                    </button>
                    <button 
                      onClick={() => openDynamicRouteMap(place.name)}
                      className="flex-1 bg-green-50 text-green-700 border border-green-200 text-sm font-bold py-3.5 rounded-xl hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                      🗺️ {language === 'bn' ? 'ম্যাপ' : 'Route Map'}
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 font-bold text-xl">
              {language === 'bn' ? 'কিছু পাওয়া যায়নি 🕵️‍♂️' : 'No places found matching your search. 🕵️‍♂️'}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 Premium Modal with Slider AND Inner Map */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6 transition-all duration-300 backdrop-blur-sm">
          
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col overflow-hidden relative animate-fadeInUp max-h-[95vh] overflow-y-auto">
            
            {/* Modal Image Slider Header */}
            <div className="relative h-48 sm:h-64 w-full flex-shrink-0 bg-gray-900">
              {selectedSpot.sliderImages && selectedSpot.sliderImages.length > 0 ? (
                <img 
                  src={selectedSpot.sliderImages[currentImageIndex]} 
                  alt={`${selectedSpot.name} slide ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-opacity duration-500 ease-in-out" 
                />
              ) : (
                <img src={selectedSpot.mainImage} alt={selectedSpot.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {selectedSpot.sliderImages && selectedSpot.sliderImages.length > 1 && (
                <div className="absolute bottom-3 right-0 left-0 flex justify-center gap-1.5 z-10">
                  {selectedSpot.sliderImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'w-6 bg-[#00df9a]' : 'w-2 bg-white/50'}`}
                    ></div>
                  ))}
                </div>
              )}

              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/20 hover:bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md text-sm font-bold z-20"
              >✕</button>
              
              <div className="absolute bottom-6 left-6 z-10">
                <span className="bg-[#00df9a] text-[#0a192f] text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 inline-block uppercase tracking-wider">
                  📍 {language === 'bn' && selectedSpot.locationBN ? selectedSpot.locationBN : selectedSpot.location}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
                  {language === 'bn' && selectedSpot.nameBN ? selectedSpot.nameBN : selectedSpot.name}
                </h2>
              </div>
            </div>

            {/* Modal Body: Info & Live Map */}
            <div className="p-6 md:p-7">
              <p className="text-gray-600 text-sm mb-5 leading-relaxed font-medium">
                {language === 'bn' && selectedSpot.descriptionBN ? selectedSpot.descriptionBN : selectedSpot.description}
              </p>

              {/* Grid: 1st Column (Info), 2nd Column (Leaflet Map) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xl bg-white p-2.5 rounded-xl shadow-sm">🕒</div>
                    <div>
                      <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">{language === 'bn' ? 'সেরা সময়' : 'Best Time'}</h4>
                      <p className="text-sm text-[#0a192f] font-bold mt-0.5">{selectedSpot.bestVisitingTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xl bg-white p-2.5 rounded-xl shadow-sm">💰</div>
                    <div>
                      <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">{t('budget')}</h4>
                      <p className="text-sm text-[#0a192f] font-bold mt-0.5">{selectedSpot.estimatedBudget}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xl bg-white p-2.5 rounded-xl shadow-sm">🏨</div>
                    <div>
                      <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">{language === 'bn' ? 'কাছের হোটেল' : 'Nearby Hotels'}</h4>
                      <p className="text-sm text-[#0a192f] font-bold mt-0.5">{selectedSpot.nearbyHotels}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-red-50/50 rounded-2xl border border-red-100 shadow-sm">
                    <div className="text-2xl bg-white p-2.5 rounded-xl shadow-sm">🛡️</div>
                    <div>
                      <h4 className="font-bold text-red-900 text-xs uppercase tracking-wider mb-1">{language === 'bn' ? 'সতর্কতা' : 'Safety Notice'}</h4>
                      <p className="text-sm text-red-700 font-bold leading-snug">{selectedSpot.safetyTips}</p>
                    </div>
                  </div>
                </div>

                {/* 🗺️ Live Leaflet Map Container */}
                <div className="h-64 lg:h-full w-full rounded-2xl overflow-hidden border border-gray-200 relative z-0 shadow-sm">
                  <MapContainer center={[selectedSpot.lat, selectedSpot.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[selectedSpot.lat, selectedSpot.lng]}>
                      <Popup><b className="text-sm">{selectedSpot.name}</b></Popup>
                    </Marker>
                  </MapContainer>
                </div>
                
              </div>

              {/* Modal Footer */}
              <div className="mt-7 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-3">
                <button 
                  onClick={closeModal}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
                <button 
                  onClick={() => openDynamicRouteMap(selectedSpot.name)}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold text-[#0a192f] bg-[#00df9a] hover:bg-[#00c98a] transition-all flex gap-2 items-center justify-center shadow-md"
                >
                  <span>🗺️</span> {language === 'bn' ? 'ম্যাপ দেখুন' : 'Get Directions'}
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Bangladesh;