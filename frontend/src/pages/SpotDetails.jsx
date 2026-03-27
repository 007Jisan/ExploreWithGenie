import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import MapComponent from '../components/MapComponent'; // জিসানের ম্যাপ কম্পোনেন্ট

const SpotDetails = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // স্পটের ডাটা ফেচ করা হচ্ছে
    fetch('http://localhost:5000/api/spots')
      .then(res => res.json())
      .then(data => {
        const selectedSpot = data.find(s => s._id === id);
        setSpot(selectedSpot);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching spot:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Genie's Magic... 🧞‍♂️</div>;
  if (!spot) return <div className="text-center mt-20 text-red-500">Spot not found!</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/bangladesh" className="text-teal-600 font-semibold mb-6 inline-block hover:underline">
        &larr; Back to Destinations
      </Link>

      {/* Spot Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <img src={spot.mainImage} alt={spot.name} className="w-full h-96 object-cover" />
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{spot.name}</h1>
            <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-semibold">📍 {spot.location}</span>
          </div>
          <p className="text-gray-600 text-lg mb-6">{spot.description}</p>
          
          {/* Eshita's Required Info Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-lg border">
            <div>
              <h4 className="font-bold text-teal-700">Best Time to Visit</h4>
              <p>{spot.bestVisitingTime}</p>
            </div>
            <div>
              <h4 className="font-bold text-teal-700">Estimated Budget</h4>
              <p>{spot.estimatedBudget}</p>
            </div>
            <div>
              <h4 className="font-bold text-teal-700">Nearby Hotels</h4>
              <p>{spot.nearbyHotels}</p>
            </div>
            <div>
              <h4 className="font-bold text-teal-700">Safety Tips</h4>
              <p className="text-red-500 text-sm">{spot.safetyTips}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jisan's Map Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Route Map 🗺️</h3>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
           {/* এখানে আপনার MapComponent রেন্ডার হবে */}
           <MapComponent lat={spot.lat} lng={spot.lng} destinationName={spot.name} />
        </div>
      </div>

      {/* Sujan's Review Section */}
      <ReviewSection spotId={spot._id} existingReviews={spot.reviews} />
    </div>
  );
};

export default SpotDetails;