import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-[#0a192f]">
            <span className="text-red-500 mr-2">🛡️</span> Admin Panel
          </h2>
          <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-bold">Admin Privileges</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
            <h3 className="text-gray-500 font-medium">Total Users</h3>
            <p className="text-4xl font-bold text-[#006a4e] mt-2">1,245</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
            <h3 className="text-gray-500 font-medium">Total Agencies</h3>
            <p className="text-4xl font-bold text-[#006a4e] mt-2">42</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
            <h3 className="text-gray-500 font-medium">Pending Approvals</h3>
            <p className="text-4xl font-bold text-orange-500 mt-2">7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;