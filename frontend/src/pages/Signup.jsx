import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  
  // ফর্মের ডাটা স্টেট
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tourist' // 🔥 ডিফল্ট হিসেবে tourist সিলেক্ট করা থাকবে
  });
  
  const [errorMessage, setErrorMessage] = useState('');

  // ইনপুট ফিল্ড চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // সাবমিট করার আগে আগের এরর মুছে দিচ্ছি

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // name, email, password এবং role ব্যাকএন্ডে যাচ্ছে
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully! 🎉 Please log in.');
        navigate('/login'); // সাকসেস হলে লগইন পেজে পাঠিয়ে দেবে
      } else {
        setErrorMessage(data.message || 'Signup failed! Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        {/* হেডার অংশ */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0a192f]">Create Account</h2>
          <p className="text-gray-500 mt-2">Join ExploreWithGenie today</p>
        </div>

        {/* এরর মেসেজ দেখানোর জায়গা */}
        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* সাইনআপ ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="name@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          {/* 🔥 Account Type / Role (নতুন অ্যাড করা হয়েছে) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type</label>
            <select 
              name="role" 
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value="tourist">Tourist (Traveler)</option>
              <option value="agency">Travel Agency</option>
              <option value="admin">System Admin</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Select your role to access specific features.</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#00df9a] text-[#0a192f] font-bold py-3 px-4 rounded-lg hover:bg-[#00c789] transition-all duration-300 transform active:scale-95 shadow-md mt-4"
          >
            Sign Up
          </button>
        </form>

        {/* লগইন পেজের লিংক */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0a192f] font-bold hover:text-[#00df9a] transition-colors">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;