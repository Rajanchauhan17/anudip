import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              🛍️ SHOPINDIA
            </h1>
            <p className="text-xl mb-4">Discover Incredible India</p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Explore authentic Indian products, from traditional handicrafts to modern innovations. 
              Experience the rich heritage and craftsmanship of India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary bg-white text-primary-500 hover:bg-gray-100">
                Shop Now
              </Link>
              <Link to="/categories" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover authentic Indian products across various categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Fashion & Apparel', icon: '👗', slug: 'fashion' },
              { name: 'Handicrafts & Art', icon: '🎨', slug: 'handicrafts' },
              { name: 'Spices & Food', icon: '🌶️', slug: 'spices' },
              { name: 'Jewelry & Accessories', icon: '💍', slug: 'jewelry' },
              { name: 'Home & Decor', icon: '🏠', slug: 'home-decor' },
              { name: 'Electronics', icon: '📱', slug: 'electronics' },
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/categories/${category.slug}`}
                className="card p-6 text-center card-hover"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SHOPINDIA?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Authentic Products',
                description: 'Genuine Indian products sourced directly from artisans and manufacturers',
              },
              {
                icon: '🚚',
                title: 'Fast Delivery',
                description: 'Quick and reliable delivery across India with real-time tracking',
              },
              {
                icon: '🔒',
                title: 'Secure Shopping',
                description: 'Safe and secure payment options with 100% buyer protection',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-secondary text-white section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore India?</h2>
          <p className="text-xl mb-8">Join thousands of customers who trust SHOPINDIA for authentic Indian products</p>
          <Link to="/register" className="btn-primary bg-white text-secondary-500 hover:bg-gray-100">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;