import React, { useState, useEffect } from 'react';

const AgencyDashboard = () => {
  const token = localStorage.getItem('token');
  const [packages, setPackages] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('packages');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [editingPackageId, setEditingPackageId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    hotelPricing: '',
    location: '',
  });

  const fetchAllData = async () => {
    try {
      const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      setUserData(profileData);

      if (profileData.isVerified) {
        const pkgRes = await fetch('http://localhost:5000/api/agency/packages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const inqRes = await fetch('http://localhost:5000/api/agency/inquiries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (pkgRes.ok) setPackages(await pkgRes.json());
        if (inqRes.ok) setInquiries(await inqRes.json());
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) fetchAllData();
  }, [token]);

  const handleAddPackage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      const endpoint = editingPackageId
        ? `http://localhost:5000/api/agency/packages/${editingPackageId}`
        : 'http://localhost:5000/api/agency/add-package';
      const res = await fetch(endpoint, {
        method: editingPackageId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          price: '',
          duration: '',
          hotelPricing: '',
          location: '',
        });
        setEditingPackageId('');
        setPackages((prev) =>
          editingPackageId
            ? prev.map((pkg) => (pkg._id === data._id ? data : pkg))
            : [data, ...prev]
        );
        setStatusMessage(
          editingPackageId
            ? 'Package updated successfully.'
            : 'New package launched successfully.'
        );
      } else {
        setErrorMessage(data.message || 'Failed to save package.');
      }
    } catch (err) {
      setErrorMessage('Server error!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    setStatusMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/agency/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
        if (editingPackageId === id) {
          setEditingPackageId('');
          setFormData({
            title: '',
            description: '',
            price: '',
            duration: '',
            hotelPricing: '',
            location: '',
          });
        }
        setStatusMessage('Package deleted successfully.');
      } else {
        setErrorMessage(data.message || 'Delete failed.');
      }
    } catch (err) {
      setErrorMessage('Delete failed.');
    }
  };

  const handleReply = async (inquiryId) => {
    const replyMessage = replyDrafts[inquiryId];
    if (!replyMessage?.trim()) {
      setErrorMessage('Write a reply first.');
      return;
    }

    setStatusMessage('');
    setErrorMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/agency/inquiries/${inquiryId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ replyMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inquiry) =>
            inquiry._id === inquiryId
              ? { ...inquiry, status: 'replied', replyMessage }
              : inquiry
          )
        );
        setReplyDrafts((prev) => ({ ...prev, [inquiryId]: '' }));
        setStatusMessage('Reply sent successfully.');
      } else {
        setErrorMessage(data.message || 'Reply failed.');
      }
    } catch (err) {
      setErrorMessage('Reply failed.');
    }
  };

  if (userData && !userData.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-amber-100">
          <div className="text-6xl mb-6">🛡️</div>
          <h2 className="text-2xl font-black text-[#0a192f] mb-4 tracking-tight">Verification Pending</h2>
          <p className="text-slate-500 font-bold text-sm leading-relaxed">
            Hello <span className="text-[#0a192f]">{userData.name}</span>, your agency is currently under review.
            Genie Admin will verify your account shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0a192f] p-8 rounded-[2rem] text-white shadow-xl">
            <p className="text-[#00df9a] text-[10px] font-black uppercase tracking-widest">Active Packages</p>
            <h3 className="text-4xl font-black mt-2">{packages.length}</h3>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">New Inquiries</p>
            <h3 className="text-4xl font-black text-[#0a192f] mt-2">{inquiries.length}</h3>
          </div>
          <div className="bg-[#00df9a] p-8 rounded-[2rem] shadow-lg shadow-[#00df9a]/20">
            <p className="text-[#0a192f] text-[10px] font-black uppercase tracking-widest">Agency Status</p>
            <h3 className="text-2xl font-black text-[#0a192f] mt-2">Verified</h3>
          </div>
        </div>

        <div className="flex gap-4 mb-8 bg-slate-100 p-2 rounded-2xl w-fit border border-slate-200/50">
          <button onClick={() => setActiveTab('packages')} className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'packages' ? 'bg-[#0a192f] text-white shadow-lg' : 'text-slate-500 hover:text-[#0a192f]'}`}>
            Manage Packages
          </button>
          <button onClick={() => setActiveTab('inquiries')} className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'inquiries' ? 'bg-[#0a192f] text-white shadow-lg' : 'text-slate-500 hover:text-[#0a192f]'}`}>
            User Inquiries
          </button>
        </div>

        {activeTab === 'packages' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 h-fit sticky top-28">
              <h2 className="text-[#0a192f] font-black text-lg mb-6">
                {editingPackageId ? 'Update Package' : 'Create Package'}
              </h2>
              {statusMessage && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {statusMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleAddPackage} className="space-y-4">
                <input required type="text" placeholder="Tour Title" value={formData.title} className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#00df9a] font-bold text-sm" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <input required type="text" placeholder="Location" value={formData.location} className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#00df9a] font-bold text-sm" onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Price (BDT)" value={formData.price} className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#00df9a] font-bold text-sm" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  <input required type="text" placeholder="Duration" value={formData.duration} className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#00df9a] font-bold text-sm" onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                </div>
                <input type="text" placeholder="Hotel Pricing Details" value={formData.hotelPricing} className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#00df9a] font-bold text-sm" onChange={(e) => setFormData({ ...formData, hotelPricing: e.target.value })} />
                <textarea required placeholder="Description" value={formData.description} rows="4" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#00df9a] font-bold text-sm resize-none" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <button disabled={loading} type="submit" className="w-full bg-[#00df9a] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:brightness-110 transition-all active:scale-95">
                  {loading ? 'Saving...' : editingPackageId ? 'Save Package' : 'Publish Package'}
                </button>
                {editingPackageId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPackageId('');
                      setFormData({
                        title: '',
                        description: '',
                        price: '',
                        duration: '',
                        hotelPricing: '',
                        location: '',
                      });
                    }}
                    className="w-full bg-slate-100 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <div key={pkg._id} className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex justify-between items-center hover:shadow-xl transition-all duration-300">
                    <div>
                      <h4 className="font-black text-[#0a192f]">{pkg.title}</h4>
                      <p className="text-xs text-slate-400 font-bold tracking-wide">
                        {pkg.location} • {pkg.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00df9a] font-black">BDT {pkg.price}</p>
                      <button
                        onClick={() => {
                          setEditingPackageId(pkg._id);
                          setFormData({
                            title: pkg.title,
                            description: pkg.description,
                            price: pkg.price,
                            duration: pkg.duration,
                            hotelPricing: pkg.hotelPricing || '',
                            location: pkg.location,
                          });
                          setActiveTab('packages');
                          setStatusMessage('');
                          setErrorMessage('');
                        }}
                        className="block ml-auto text-[10px] font-black text-[#0a192f] uppercase mt-1 hover:underline tracking-tighter"
                      >
                        Edit Package
                      </button>
                      <button onClick={() => handleDeletePackage(pkg._id)} className="text-[10px] font-black text-rose-500 uppercase mt-1 hover:underline tracking-tighter">
                        Delete Package
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No packages created yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {statusMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {statusMessage}
              </div>
            )}
            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errorMessage}
              </div>
            )}
            {inquiries.length > 0 ? (
              inquiries.map((inq) => (
                <div key={inq._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className="flex justify-between mb-4">
                    <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0a192f]">
                      From: {inq.userName}
                    </span>
                    <span className="text-[#00df9a] text-[10px] font-black uppercase tracking-widest">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">Package: {inq.package?.title || 'Unknown package'}</p>
                  <p className="text-[#0a192f] font-bold text-sm mb-6 leading-relaxed">"{inq.message}"</p>
                  {inq.replyMessage ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-700">
                      Reply sent: {inq.replyMessage}
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <input type="text" value={replyDrafts[inq._id] || ''} onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [inq._id]: e.target.value }))} placeholder="Type your response..." className="flex-1 bg-slate-50 p-4 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-[#00df9a] transition-all" />
                      <button onClick={() => handleReply(inq._id)} className="bg-[#0a192f] text-white px-8 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#112240] transition-colors">
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No inquiries found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyDashboard;
