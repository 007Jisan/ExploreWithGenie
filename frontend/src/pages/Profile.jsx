import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // কম্পোনেন্ট লোড হওয়ার সাথে সাথে ইউজারের ডাটা ব্যাকএন্ড থেকে আনবে
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        // তোমার ব্যাকএন্ডের পোর্ট যদি 5000 না হয়, তাহলে সেটা চেঞ্জ করে নিও
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (response.ok) {
          setFormData({
            name: data.name || '',
            email: data.email || '', // ইমেইল শুধু দেখানোর জন্য, এডিট করা যাবে না
            age: data.age || '',
            phone: data.phone || '',
            address: data.address || '',
            bio: data.bio || ''
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // ইনপুট ফিল্ডের ভ্যালু চেঞ্জ হলে স্টেট আপডেট করবে
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ফর্ম সাবমিট (Save) করলে ব্যাকএন্ডে ডাটা পাঠাবে
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio
        })
      });

      if (response.ok) {
        setMessage('Profile updated successfully! ✅');
        setTimeout(() => setMessage(''), 3000); // ৩ সেকেন্ড পর মেসেজ গায়েব হয়ে যাবে
      } else {
        setMessage('Failed to update profile ❌');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Server error ❌');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-[#006a4e]">Loading Profile... 🧞‍♂️</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* প্রোফাইল হেডার */}
        <div className="bg-[#0a192f] p-8 text-center">
          <div className="inline-block h-24 w-24 rounded-full bg-[#00df9a] text-[#0a192f] flex items-center justify-center text-4xl font-extrabold border-4 border-white mb-4">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold text-white">{formData.name}'s Dashboard</h2>
          <p className="text-gray-400 mt-2">{formData.email}</p>
        </div>

        {/* এডিট ফর্ম */}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Personal Information</h3>
          
          {message && (
            <div className={`p-4 mb-6 rounded-lg font-medium text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input 
                  type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 25"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 1..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none"
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" value={formData.email} disabled
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input 
                type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Your City, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Me (Bio)</label>
              <textarea 
                name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="I love exploring new places..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-[#0a192f] text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-[#00df9a] hover:text-[#0a192f] transition-all transform active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;