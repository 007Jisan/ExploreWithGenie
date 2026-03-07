import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // 🔥 SweetAlert2 ইম্পোর্ট করলাম

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const countries = [
    {
      name: 'Bangladesh',
      image: 'https://images.pexels.com/photos/725100/pexels-photo-725100.jpeg',
      locked: false
    },
    {
      name: 'Thailand',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      locked: true
    },
    {
      name: 'Pakistan',
      image: 'https://www.wanderlustmagazine.com/wp-content/uploads/2023/11/cropped-shutterstock_1179564547.jpg',
      locked: true
    },
    {
      name: 'Sri Lanka',
      image: 'https://www.distinctdestinations.in/DistinctDestinationsBackEndImg/BlogImage/sri-lanka-an-11-day-journey-through-culture-nature-and-heritage-L-distinctdestinations.jpg',
      locked: true
    },
    {
      name: 'India',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
      locked: true
    },
    {
      name: 'Nepal',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      locked: true
    },
    {
      name: 'Maldives',
      image: 'https://images.squarespace-cdn.com/content/v1/6003af59c8cd610112a4eff3/606da269-941d-4127-a8d9-91a4529e42cb/Island_Overview_Pano2.jpeg?format=2500w',
      locked: true
    },
    {
      name: 'Bhutan',
      image: 'https://images.squarespace-cdn.com/content/v1/55ee34aae4b0bf70212ada4c/1582321466471-V1B8ONAQDVFQQVH5UKBP/image-asset.jpeg?format=2500w',
      locked: true
    },
    {
      name: 'Malaysia',
      image: 'https://greenglobaltravel.com/wp-content/uploads/2016/08/Things-to-do-in-Malaysia-for-Nature-Lovers.jpg',
      locked: true
    }
  ];

  const handleExplore = (country) => {
    if (country.name === 'Bangladesh') {
      if (token) {
        navigate('/country/bangladesh'); 
      } else {
        // লগইন না থাকলে সুন্দর পপ-আপ
        Swal.fire({
          title: 'Access Restricted!',
          text: 'Please login first to explore Bangladesh! 🧞‍♂️',
          icon: 'warning',
          confirmButtonColor: '#006a4e',
          confirmButtonText: 'Go to Login'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      }
    } else {
      // 🔥 অন্য কান্ট্রিতে ক্লিক করলে এই পপ-আপ আসবে
      Swal.fire({
        title: `${country.name} is Locked! 🔒`,
        text: 'Our AI Genie is currently working on this destination. It will be available soon!',
        icon: 'info',
        confirmButtonColor: '#0a192f',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10 text-[#006a4e]">Where do you want to explore?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {countries.map((country, index) => (
          <div 
            key={index} 
            onClick={() => handleExplore(country)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={country.image} 
                alt={country.name} 
                className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${country.locked ? 'grayscale-[50%]' : ''}`} 
              />
              {country.locked && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800">{country.name}</h3>
              <p className="text-sm font-medium text-[#006a4e] mt-1">
                {country.name === 'Bangladesh' ? 'Available Now ✨' : 'Coming Soon 🔒'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;