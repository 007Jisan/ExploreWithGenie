import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // সাবমিট করার আগে আগের এরর মুছে দিচ্ছি

    try {
      // ব্যাকএন্ডে লগইনের রিকোয়েস্ট পাঠানো হচ্ছে
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ টোকেন এবং ইউজারের রোল localStorage-এ সেভ করা হচ্ছে
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role); 

        alert('Login Successful! 🧞‍♂️');

        // 🔥 ইউজারের রোল অনুযায়ী তাকে নির্দিষ্ট ড্যাশবোর্ডে পাঠিয়ে দেওয়া হচ্ছে
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'agency') {
          navigate('/agency-login');
        } else {
          navigate('/'); // সাধারণ ট্যুরিস্ট হলে হোম পেজে যাবে
        }
        
        // Navbar-এ যেন সাথে সাথে প্রোফাইলের ছবি চলে আসে, তাই পেজ রিলোড
        window.location.reload(); 
      } else {
        // লগইন ফেইল করলে ব্যাকএন্ডের মেসেজটা দেখাবে
        setErrorMessage(data.message || 'Login failed! Please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        {/* হেডার অংশ */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0a192f]">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Login to your ExploreWithGenie account</p>
        </div>

        {/* এরর মেসেজ দেখানোর জায়গা */}
        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* লগইন ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0a192f] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#00df9a] hover:text-[#0a192f] transition-all duration-300 transform active:scale-95 shadow-md"
          >
            Log In
          </button>
        </form>

        {/* সাইনআপ পেজের লিংক */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#00df9a] font-bold hover:text-[#00b37a] transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;