import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🟢 নেভিগেট ইম্পোর্ট করা হয়েছে

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ব্যাকএন্ড থেকে সব প্যাকেজ আনবে
    fetch('http://localhost:5000/api/packages/all')
      .then(res => res.json())
      .then(data => {
        setPackages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching packages:", err);
        setLoading(false);
      });
  }, []);

  // 🟢 বুকিং ফাংশন (API কল এবং ডিবাগিং সহ)
  const handleBookNow = async (pkg) => {
    console.log("✅ Button Clicked! Package:", pkg.title); // ডিবাগিং

    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("⚠️ You need to log in first to book a package!");
      navigate('/login');
      return;
    }

    try {
      console.log("🚀 Sending request to backend..."); // ডিবাগিং

      const res = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId: pkg._id,
          agencyId: pkg.agencyId._id
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message); // সাকসেস মেসেজ দেখাবে
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (error) {
      console.error("Booking Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#0a192f] mb-4">
          Explore <span className="text-[#00df9a]">Tour Packages</span>
        </h2>
        <p className="text-gray-600">Discover amazing trips curated by our verified agencies.</p>
      </div>

      {loading ? (
        <div className="text-center text-[#00df9a] font-bold text-xl">Loading Packages...</div>
      ) : packages.length === 0 ? (
        <div className="text-center text-gray-500">No tour packages available right now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-[#0a192f]">{pkg.title}</h3>
                  <span className="bg-[#00df9a] text-[#0a192f] font-bold px-3 py-1 rounded-full text-sm">
                    ৳{pkg.price}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Agency: {pkg.agencyId?.name || "Unknown"}
                </span>
                <p className="text-gray-600 mt-4 text-sm whitespace-pre-line">
                  {pkg.description}
                </p>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                
                {/* 🟢 এখানে onClick ইভেন্ট যোগ করা হয়েছে */}
                <button 
                  onClick={() => handleBookNow(pkg)}
                  className="w-full bg-[#0a192f] text-white font-bold py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Book Now
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourPackages;