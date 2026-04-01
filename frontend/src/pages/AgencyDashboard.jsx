import React, { useState, useEffect } from 'react';

const AgencyDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [packages, setPackages] = useState([]);
  const [editId, setEditId] = useState(null); 
  
  // 🟢 বুকিংয়ের জন্য নতুন State
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false); // বুকিং সেকশন দেখানোর টগল

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    hotelPricing: '',
    description: ''
  });

  useEffect(() => {
    fetchPackages();
    fetchBookings(); // 🟢 পেজ লোড হলে বুকিংগুলোও আনবে
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/packages/my-packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  // 🟢 ডাটাবেস থেকে এজেন্সির বুকিংগুলো আনার ফাংশন
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings/agency-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // 🟢 বুকিং Approve বা Reject করার ফাংশন
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/update-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchBookings(); // স্ট্যাটাস আপডেট হলে লিস্ট রিফ্রেশ করবে
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editId 
        ? `http://localhost:5000/api/packages/update/${editId}` 
        : 'http://localhost:5000/api/packages/create';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setFormData({ title: '', price: '', hotelPricing: '', description: '' }); 
        setEditId(null);
        setShowForm(false); 
        fetchPackages(); 
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };

  const handleEdit = (pkg) => {
    setFormData({ title: pkg.title, price: pkg.price, hotelPricing: pkg.hotelPricing || '', description: pkg.description });
    setEditId(pkg._id);
    setShowForm(true);
    setShowBookings(false);
    window.scrollTo(0, 0); 
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this package?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/packages/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', price: '', hotelPricing: '', description: '' });
    setEditId(null);
    setShowForm(false);
  };

  // 🟢 পেন্ডিং বুকিং কয়টা আছে তা গোনার জন্য
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-[#0a192f]">
            <span className="text-[#00df9a] mr-2">💼</span> Agency Dashboard
          </h2>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">Agency Account</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => { handleCancel(); setShowForm(!showForm); setShowBookings(false); }} 
            className={`p-6 rounded-xl border hover:shadow-md transition-shadow cursor-pointer text-center ${showForm ? 'bg-[#00df9a]/10 border-[#00df9a]' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800">Create New Tour Package</h3>
            <p className="text-gray-500 text-sm mt-2">Add a new destination, pricing, and itinerary.</p>
          </div>
          
          <div 
            onClick={() => { setShowBookings(!showBookings); setShowForm(false); }}
            className={`p-6 rounded-xl border hover:shadow-md transition-shadow cursor-pointer text-center relative overflow-hidden ${showBookings ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-gray-800">User Inquiries & Bookings</h3>
            <p className="text-gray-500 text-sm mt-2">Respond to tourist messages and manage requests.</p>
            {/* 🟢 ডায়নামিক ব্যাজ */}
            {pendingCount > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                {pendingCount} New
              </span>
            )}
          </div>
        </div>

        {/* --- Form Section --- */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in border-l-4 border-l-[#00df9a]">
            {/* ... (আগের ফর্ম কোডটাই আছে) ... */}
            <h3 className="text-xl font-bold text-[#0a192f] mb-4">
              {editId ? '✏️ Edit Package Details' : '📝 Add New Package'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00df9a]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Price (BDT)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00df9a]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Pricing Details</label>
                <input type="text" name="hotelPricing" value={formData.hotelPricing} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00df9a]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description & Itinerary</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00df9a]"></textarea>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="bg-[#00df9a] text-[#0a192f] font-bold py-2 px-6 rounded-lg hover:bg-green-400">{editId ? 'Update Package' : 'Save Package'}</button>
                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* 🟢 --- New Bookings Management Section --- */}
        {showBookings && (
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-[#0a192f] mb-4">Tourist Booking Requests</h3>
            {bookings.length === 0 ? (
              <p className="text-gray-500 italic">No bookings received yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <h4 className="font-bold text-lg text-blue-900">{booking.package?.title}</h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Tourist:</span> {booking.user?.name} ({booking.user?.email})
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Date:</span> {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        booking.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                      
                      {booking.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleStatusUpdate(booking._id, 'Approved')} className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-600">Accept</button>
                          <button onClick={() => handleStatusUpdate(booking._id, 'Rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-600">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Manage My Packages List (Hidden when bookings are shown) --- */}
        {!showBookings && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-[#0a192f] mb-4">Manage My Packages</h3>
            {packages.length === 0 ? (
              <p className="text-gray-500 italic">No packages created yet. Click above to add one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-[#0a192f]">{pkg.title}</h4>
                        <span className="bg-[#0a192f] text-[#00df9a] text-xs px-2 py-1 rounded font-bold">৳{pkg.price}</span>
                      </div>
                      {pkg.hotelPricing && (
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-[#00df9a] bg-[#0a192f]/5 px-2 py-1 rounded-md border border-[#00df9a]/20 inline-flex items-center">🏨 {pkg.hotelPricing}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{pkg.description}</p>
                    </div>
                    <div className="flex space-x-3 border-t border-gray-100 pt-3 mt-auto">
                      <button onClick={() => handleEdit(pkg)} className="flex-1 bg-blue-50 text-blue-600 font-semibold py-1.5 rounded hover:bg-blue-100 transition-colors text-sm flex justify-center items-center">✏️ Edit</button>
                      <button onClick={() => handleDelete(pkg._id)} className="flex-1 bg-red-50 text-red-600 font-semibold py-1.5 rounded hover:bg-red-100 transition-colors text-sm flex justify-center items-center">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AgencyDashboard;