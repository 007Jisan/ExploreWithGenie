import React, { useState, useEffect } from 'react';

const Bangladesh = () => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slider speed fixed to 2 seconds
  useEffect(() => {
    let interval;
    if (selectedSpot && selectedSpot.sliderImages.length > 1) {
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

  const places = [
    {
      name: 'Lalbagh Fort',
      mainImage: '/images/lalbagh1.jpg',
      sliderImages: ['/images/lalbagh1.jpg', '/images/lalbagh2.jpg'],
      location: 'Old Dhaka',
      mapQuery: 'Lalbagh+Fort,+Dhaka',
      description: 'An incomplete 17th-century Mughal fort complex that stands proudly before the Buriganga River. Features include the Mausoleum of Pari Bibi, a mosque, and large green gardens.',
      bestVisitingTime: 'Oct to Mar (4 PM - 6 PM)',
      estimatedBudget: '৳500 - ৳1,000 / day',
      nearbyHotels: 'Hotel 71, Pan Pacific Sonargaon',
      safetyTips: 'Beware of pickpockets outside the fort. Carry water.'
    },
    {
      name: "Cox's Bazar",
      mainImage: '/images/cox1.jpg',
      sliderImages: ['/images/cox1.jpg', '/images/cox2.jpg'],
      location: 'Chittagong',
      mapQuery: 'Coxs+Bazar+Sea+Beach',
      description: 'The longest natural unbroken sea beach in the world (120 km). Famous for its golden sand, surfing waves, seafood, and the beautiful Marine Drive.',
      bestVisitingTime: 'Nov to Feb (Pleasant weather)',
      estimatedBudget: '৳3,000 - ৳6,000 / day',
      nearbyHotels: 'Sayeman Beach Resort, Ocean Paradise',
      safetyTips: 'Follow the red/green flag instructions of the coast guard.'
    },
    {
      name: 'Ahsan Manzil',
      mainImage: '/images/ahsan1.jpg',
      sliderImages: ['/images/ahsan1.jpg', '/images/ahsan2.jpg'],
      location: 'Old Dhaka',
      mapQuery: 'Ahsan+Manzil,+Dhaka',
      description: 'Once the official residential palace of the Nawab of Dhaka. This magnificent pink palace is now a grand national museum showcasing their lavish lifestyle.',
      bestVisitingTime: 'Nov to Mar (Morning hours)',
      estimatedBudget: '৳500 - ৳1,000 / day',
      nearbyHotels: 'InterContinental Dhaka, Hotel Ornate',
      safetyTips: 'Keep belongings safe. Usually closed on Thursdays.'
    },
    {
      name: 'Sompur Bihar',
      mainImage: '/images/sompur1.jpg',
      sliderImages: ['/images/sompur1.jpg', '/images/sompur2.jpg'],
      location: 'Naogaon',
      mapQuery: 'Sompur+Mahavihara,+Paharpur',
      description: 'A designated UNESCO World Heritage Site. This 8th-century Buddhist monastery in Paharpur features stunning terracotta plaques and a massive central shrine.',
      bestVisitingTime: 'Nov to Mar (Cooler climate)',
      estimatedBudget: '৳1,500 - ৳2,500 / day',
      nearbyHotels: 'Parjatan Motel Bogra, Momo Inn',
      safetyTips: 'The area is large, so carry drinking water and sunscreen.'
    },
    {
      name: 'Sundarban',
      mainImage: '/images/sundarban1.jpg',
      sliderImages: ['/images/sundarban1.jpg', '/images/sundarban2.jpg'],
      location: 'Khulna',
      mapQuery: 'Sundarbans+National+Park,+Bangladesh',
      description: 'The largest contiguous mangrove forest in the world. Proud home to the majestic Royal Bengal Tiger, spotted deer, and crocodiles.',
      bestVisitingTime: 'Nov to Feb (Wildlife spotting)',
      estimatedBudget: '৳6,000 - ৳12,000 (Package tours)',
      nearbyHotels: 'Pashur Resort, Various Eco-resorts',
      safetyTips: 'Stay with your guide. Use strong mosquito repellents.'
    },
    {
      name: 'Saint Martin',
      mainImage: '/images/stmartin1.jpg',
      sliderImages: ['/images/stmartin1.jpg', '/images/stmartin2.jpg'],
      location: 'Bay of Bengal',
      mapQuery: 'St.+Martin+Island,+Bangladesh',
      description: 'The only coral island of Bangladesh, famous for its crystal clear blue water, serene coconut groves, and peaceful environment.',
      bestVisitingTime: 'Nov to Feb (Ships operate in winter)',
      estimatedBudget: '৳4,000 - ৳7,000 / day',
      nearbyHotels: 'Coral View Resort, Blue Marine Resort',
      safetyTips: 'Carry cash (no ATMs). Use eco-friendly products to protect corals.'
    }
  ];

  const openDynamicRouteMap = (query) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    // 🔥 Changed to a Clean, Light Background (Off-white)
    <div className="min-h-screen bg-[#f8fafc] py-16 relative font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Clean Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a192f] mb-4">
            Explore Beautiful Bangladesh <span className="text-[#00df9a]">🇧🇩</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto mb-6 text-lg">
            Discover historical landmarks, breathtaking landscapes, and hidden gems across the country.
          </p>
          <div className="h-1.5 w-24 bg-[#00df9a] mx-auto rounded-full shadow-sm"></div>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {places.map((place, index) => (
            <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col hover:-translate-y-2">
              
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img src={place.mainImage} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 via-transparent to-transparent opacity-90"></div>
                
                {/* Clean Location Badge */}
                <div className="absolute top-4 right-4 bg-white/95 text-[#0a192f] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <span className="text-red-500 text-sm">📍</span> {place.location}
                </div>
                
                <h3 className="absolute bottom-4 left-5 text-2xl font-bold text-white tracking-wide">{place.name}</h3>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow bg-white">
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                  {place.description}
                </p>

                <div className="mt-auto flex gap-3 pt-3 border-t border-gray-50">
                  <button 
                    onClick={() => setSelectedSpot(place)}
                    className="flex-1 bg-[#0a192f] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm active:scale-95"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => openDynamicRouteMap(place.mapQuery)}
                    className="flex-1 bg-green-50 text-green-700 border border-green-200 text-sm font-bold py-3.5 rounded-xl hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    🗺️ Route Map
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 🔥 Premium Compact Modal (No Blur, Simple Soft Dark Background) */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 transition-all duration-300">
          
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden relative animate-fadeInUp">
            
            {/* Modal Image Slider Header */}
            <div className="relative h-48 sm:h-56 w-full flex-shrink-0 bg-gray-900">
              <img 
                src={selectedSpot.sliderImages[currentImageIndex]} 
                alt={`${selectedSpot.name} slide ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Slider Dots */}
              <div className="absolute bottom-3 right-0 left-0 flex justify-center gap-1.5 z-10">
                {selectedSpot.sliderImages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'w-6 bg-[#00df9a]' : 'w-2 bg-white/50'}`}
                  ></div>
                ))}
              </div>

              {/* Modal Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/20 hover:bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md text-sm font-bold z-20"
              >
                ✕
              </button>
              
              <div className="absolute bottom-6 left-6 z-10">
                <span className="bg-[#00df9a] text-[#0a192f] text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 inline-block uppercase tracking-wider">
                  📍 {selectedSpot.location}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {selectedSpot.name}
                </h2>
              </div>
            </div>

            {/* Modal Body Details */}
            <div className="p-6 md:p-7">
              <p className="text-gray-600 text-sm mb-5 leading-relaxed font-medium">
                {selectedSpot.description}
              </p>

              {/* Clean Info Grid (2 Columns, fits on screen) */}
              <div className="grid grid-cols-2 gap-4 mb-2">
                
                <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-xl bg-white p-2.5 rounded-xl shadow-sm">🕒</div>
                  <div>
                    <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Best Time</h4>
                    <p className="text-sm text-[#0a192f] font-bold mt-0.5">{selectedSpot.bestVisitingTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-xl bg-white p-2.5 rounded-xl shadow-sm">💰</div>
                  <div>
                    <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Budget</h4>
                    <p className="text-sm text-[#0a192f] font-bold mt-0.5">{selectedSpot.estimatedBudget}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 col-span-2 shadow-sm">
                  <div className="text-xl bg-white p-2.5 rounded-xl shadow-sm">🏨</div>
                  <div>
                    <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Nearby Hotels</h4>
                    <p className="text-sm text-[#0a192f] font-bold mt-0.5">{selectedSpot.nearbyHotels}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-red-50/50 rounded-2xl border border-red-100 col-span-2 shadow-sm">
                  <div className="text-2xl bg-white p-2.5 rounded-xl shadow-sm">🛡️</div>
                  <div>
                    <h4 className="font-bold text-red-900 text-xs uppercase tracking-wider mb-1">Safety Notice</h4>
                    <p className="text-sm text-red-700 font-bold leading-snug">{selectedSpot.safetyTips}</p>
                  </div>
                </div>

              </div>

              {/* Modal Footer Buttons */}
              <div className="mt-7 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-3">
                <button 
                  onClick={closeModal}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => openDynamicRouteMap(selectedSpot.mapQuery)}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold text-[#0a192f] bg-[#00df9a] hover:bg-[#00c98a] transition-all flex gap-2 items-center justify-center shadow-md active:scale-95 transform hover:-translate-y-0.5"
                >
                  <span>🗺️</span> Get Directions from My Location
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