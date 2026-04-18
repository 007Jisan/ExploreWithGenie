import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^.{8,64}$/;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tourist',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const normalizedName = formData.name.trim().replace(/\s+/g, ' ');
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (normalizedName.length < 2 || normalizedName.length > 60) {
      setErrorMessage('Full name must be between 2 and 60 characters.');
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!PASSWORD_REGEX.test(formData.password)) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name: normalizedName,
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully. Please log in.');
        navigate('/login');
      } else {
        setErrorMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0a192f]">Create Account</h2>
          <p className="text-gray-500 mt-2">Join ExploreWithGenie today</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={60}
              autoComplete="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              inputMode="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Enter at least 8 characters"
            />
            <p className="text-xs text-gray-400 mt-2">Password must be at least 8 characters long.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00df9a] focus:border-[#0a192f] outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Re-enter your password"
            />
            {formData.confirmPassword && (
              <p className={`text-xs mt-2 font-medium ${formData.password === formData.confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                {formData.password === formData.confirmPassword ? 'Passwords match.' : 'Passwords do not match.'}
              </p>
            )}
          </div>

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
            </select>
            <p className="text-xs text-gray-400 mt-1">Select your role to access specific features.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00df9a] text-[#0a192f] font-bold py-3 px-4 rounded-lg hover:bg-[#00c789] transition-all duration-300 transform active:scale-95 shadow-md mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

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
