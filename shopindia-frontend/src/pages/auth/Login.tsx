import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center mb-8">
            <span className="text-4xl">🛍️</span>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to SHOPINDIA
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                create a new account
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-soft">
          <p className="text-center text-gray-700">Login form is under development...</p>
          <div className="mt-4 text-center">
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;