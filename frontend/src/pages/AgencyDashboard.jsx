import React from 'react';

const AgencyDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-[#0a192f]">
            <span className="text-[#00df9a] mr-2">💼</span> Agency Dashboard
          </h2>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">Agency Account</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action Cards */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800">Create New Tour Package</h3>
            <p className="text-gray-500 text-sm mt-2">Add a new destination and itinerary for tourists.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-gray-800">Manage Bookings</h3>
            <p className="text-gray-500 text-sm mt-2">View and approve tourist booking requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;