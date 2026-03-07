import React from 'react';
import Swal from 'sweetalert2';

const Bangladesh = () => {
  const places = [
    {
      name: 'Lalbagh Fort',
      image: 'https://images.pexels.com/photos/34957286/pexels-photo-34957286.jpeg',
      location: 'Old Dhaka',
      mapQuery: 'Lalbagh+Fort,+Dhaka',
      description: 'An incomplete 17th-century Mughal fort complex that stands proudly before the Buriganga River in the southwestern part of Dhaka.',
      bestVisitingTime: 'October to March (Winter season)',
      estimatedBudget: '৳500 - ৳1,000 per day',
      nearbyHotels: 'Hotel 71, Pan Pacific Sonargaon, InterContinental Dhaka',
      safetyTips: 'Beware of pickpockets in crowded Old Dhaka streets. Carry water.'
    },
    {
      name: "Cox's Bazar",
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cox%27s_Bazar.jpg/1280px-Cox%27s_Bazar.jpg',
      location: 'Chittagong',
      mapQuery: 'Coxs+Bazar+Sea+Beach',
      description: 'The longest natural unbroken sea beach in the world! Famous for its golden sand, surfing waves, and amazing seafood.',
      bestVisitingTime: 'November to February',
      estimatedBudget: '৳3,000 - ৳5,000 per day',
      nearbyHotels: 'Sayeman Beach Resort, Ocean Paradise, Long Beach Hotel',
      safetyTips: 'Avoid swimming too deep during high tide. Follow the local coast guard instructions.'
    },
    {
      name: 'Ahsan Manzil',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg',
      location: 'Old Dhaka',
      mapQuery: 'Ahsan+Manzil,+Dhaka',
      description: 'Once the official residential palace and seat of the Nawab of Dhaka. This magnificent pink palace is now a grand national museum.',
      bestVisitingTime: 'November to March',
      estimatedBudget: '৳500 - ৳1,000 per day',
      nearbyHotels: 'Hotel Ornate, InterContinental Dhaka',
      safetyTips: 'Keep your belongings safe in the crowded areas nearby. Avoid visiting on Thursdays.'
    },
    {
      name: 'Sompur Bihar',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Paharpur_Buddhist_Monastery.jpg/1280px-Paharpur_Buddhist_Monastery.jpg',
      location: 'Naogaon',
      mapQuery: 'Sompur+Mahavihara,+Paharpur',
      description: 'A UNESCO World Heritage Site. This 8th-century Buddhist monastery in Paharpur is one of the most important archaeological sites in the Indian subcontinent.',
      bestVisitingTime: 'November to March',
      estimatedBudget: '৳1,500 - ৳2,500 per day',
      nearbyHotels: 'Parjatan Motel Bogra, Momo Inn (Bogra)',
      safetyTips: 'Wear comfortable walking shoes. The area is large, so carry enough drinking water.'
    },
    {
      name: 'Sundarban',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sundarban_Tiger.jpg/1280px-Sundarban_Tiger.jpg',
      location: 'Khulna',
      mapQuery: 'Sundarbans+National+Park,+Bangladesh',
      description: 'The largest contiguous mangrove forest in the world and a UNESCO World Heritage Site. Home to the majestic Royal Bengal Tiger.',
      bestVisitingTime: 'November to February',
      estimatedBudget: '৳5,000 - ৳8,000 per day (Package Tours)',
      nearbyHotels: 'Pashur Resort (Mongla), Various Eco-resorts',
      safetyTips: 'Always stay with your tour guide. Do not wander alone in the forest. Use mosquito repellents.'
    },
    {
      name: 'Saint Martin',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Saint_Martin_%286%29.jpg/1280px-Saint_Martin_%286%29.jpg',
      location: 'Bay of Bengal',
      mapQuery: 'St.+Martin+Island,+Bangladesh',
      description: 'The only coral island of Bangladesh, known for its crystal clear blue water, serene coconut groves, and peaceful environment.',
      bestVisitingTime: 'November to February',
      estimatedBudget: '৳3,000 - ৳6,000 per day',
      nearbyHotels: 'Coral View Resort, Blue Marine Resort',
      safetyTips: 'Carry enough cash as there are no ATMs on the island. Use eco-friendly products to save the corals.'
    }
  ];

  // Module requirement onujayi details dekhabar function
  const showDetails = (place) => {
    Swal.fire({
      title: place.name,
      imageUrl: place.image,
      imageWidth: '100%',
      imageHeight: 250,
      imageAlt: place.name,
      html: `
        <div style="text-align: left; margin-top: 10px;">
          <p style="color: #4b5563; margin-bottom: 15px;">${place.description}</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; font-size: 14px;">
            <p style="margin-bottom: 8px;"><strong>🕒 Best Visiting Time:</strong> ${place.bestVisitingTime}</p>
            <p style="margin-bottom: 8px;"><strong>💰 Estimated Budget:</strong> <span style="color: #006a4e; font-weight: bold;">${place.estimatedBudget}</span></p>
            <p style="margin-bottom: 8px;"><strong>🏨 Nearby Hotels:</strong> ${place.nearbyHotels}</p>
            <p style="margin-bottom: 0px;"><strong>🛡️ Safety Tips:</strong> <span style="color: #dc2626;">${place.safetyTips}</span></p>
          </div>
        </div>
      `,
      confirmButtonColor: '#00df9a',
      confirmButtonText: '<span style="color:#0a192f; font-weight:bold;">Close Details</span>',
      customClass: {
        title: 'text-2xl font-bold text-[#0a192f]',
        popup: 'rounded-2xl',
        image: 'rounded-lg object-cover'
      }
    });
  };

  // 🔥 Dhaka theke destination er exact map route dekhabar function
  const openRouteMap = (query) => {
    // Eta sorasori Google Maps e Dhaka theke oi destination er route draw kore dekhabe!
    window.open(`https://www.google.com/maps/dir/Dhaka,+Bangladesh/${query}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-[#0a192f] mb-4">Explore Beautiful Bangladesh 🇧🇩</h1>
        <div className="h-1.5 w-24 bg-[#00df9a] mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {places.map((place, index) => (
          <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
            
            <div className="relative h-56 overflow-hidden">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{place.name}</h3>
              <p className="flex items-center text-gray-500 text-sm mb-4">
                <span className="text-[#00df9a] mr-1.5">📍</span> {place.location}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => showDetails(place)}
                  className="flex-1 bg-[#0a192f] text-white text-sm font-bold py-2.5 rounded-lg hover:bg-[#00df9a] hover:text-[#0a192f] transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => openRouteMap(place.mapQuery)}
                  className="flex-1 bg-green-50 text-green-700 border border-green-200 text-sm font-bold py-2.5 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  🗺️ Route Map
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Bangladesh;