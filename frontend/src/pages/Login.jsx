import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userId', data.user.id || data.user._id || '');
        localStorage.setItem('name', data.user.name || '');

        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else if (data.user.role === 'agency') {
          window.location.href = '/agency-dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        setErrorMessage(data.message || 'Login failed! Please check your credentials.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0a192f]">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Login to your ExploreWithGenie account</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

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
              placeholder="********"
            />
          </div>

          <button type="submit" className="w-full bg-[#0a192f] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#00df9a] hover:text-[#0a192f] transition-all duration-300 transform active:scale-95 shadow-md">
            Log In
          </button>
        </form>

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
