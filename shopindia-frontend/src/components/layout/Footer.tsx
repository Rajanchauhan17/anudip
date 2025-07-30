import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer-gradient text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛍️</span>
              <span className="text-xl font-bold">SHOPINDIA</span>
            </div>
            <p className="text-gray-300 mb-4">
              Discover Incredible India through authentic products, traditional crafts, and modern innovations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">📘</a>
              <a href="#" className="text-gray-300 hover:text-white">📷</a>
              <a href="#" className="text-gray-300 hover:text-white">🐦</a>
              <a href="#" className="text-gray-300 hover:text-white">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/categories/fashion" className="text-gray-300 hover:text-white">Fashion & Apparel</Link></li>
              <li><Link to="/categories/handicrafts" className="text-gray-300 hover:text-white">Handicrafts</Link></li>
              <li><Link to="/categories/spices" className="text-gray-300 hover:text-white">Spices & Food</Link></li>
              <li><Link to="/categories/jewelry" className="text-gray-300 hover:text-white">Jewelry</Link></li>
              <li><Link to="/categories/home-decor" className="text-gray-300 hover:text-white">Home Decor</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <p>📞 +91-800-SHOPINDIA</p>
              <p>📧 support@shopindia.com</p>
              <p>📍 Mumbai, Maharashtra, India</p>
              <p>🕒 24/7 Customer Support</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 SHOPINDIA. All rights reserved. Made with ❤️ for showcasing India's incredible heritage.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;