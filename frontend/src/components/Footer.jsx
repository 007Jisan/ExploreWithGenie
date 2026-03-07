import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0a192f] text-white pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
          
          {/* Column 1: Brand & About */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-5 tracking-tight">
              GENNIE<span className="text-[#00df9a]">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              ExploreWithGenie is your AI-powered companion for discovering the hidden gems of Bangladesh. We combine smart routing with interactive maps to make your travel seamless.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 border-b border-gray-700 pb-2 w-fit">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-[#00df9a] transition-colors">Home</Link></li>
              <li><Link to="/country/bangladesh" className="hover:text-[#00df9a] transition-colors">Explore Destinations</Link></li>
              <li><Link to="/login" className="hover:text-[#00df9a] transition-colors">Login / Signup</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5 border-b border-gray-700 pb-2 w-fit">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Email: support@gennie.ai</li>
              <li>Location: Dhaka, Bangladesh</li>
              <li className="flex space-x-4 pt-2">
                {/* Social icons er placeholder */}
                <span className="hover:text-white cursor-pointer">FB</span>
                <span className="hover:text-white cursor-pointer">IG</span>
                <span className="hover:text-white cursor-pointer">LI</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Gennie - ExploreWithGenie. Developed for University Project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;