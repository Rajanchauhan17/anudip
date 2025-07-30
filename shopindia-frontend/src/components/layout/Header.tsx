import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/store';

const Header: React.FC = () => {
  const { totalItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛍️</span>
            <span className="text-xl font-bold text-gradient">SHOPINDIA</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-500 transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary-500 transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-500 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-500 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/wishlist" className="text-gray-700 hover:text-primary-500">
                  ❤️
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-500">
                  🛒
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary-500">
                  👤 {user?.firstName}
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-500">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;