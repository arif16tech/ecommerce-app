import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, cart, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gray-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold">StyleStore</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          {user ? (
            <>
              <Link to="/cart" className="relative hover:text-gray-300 transition">
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:text-gray-300 transition">Orders</Link>
              <Link to="/profile" className="hover:text-gray-300 transition">Profile</Link>
              {user.isAdmin && (
                <Link to="/admin" className="text-yellow-400 font-semibold hover:text-yellow-300 transition">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition">Login</Link>
              <Link to="/register" className="hover:text-gray-300 transition">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col space-y-1"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block hover:text-gray-300 py-2">Home</Link>
          {user ? (
            <>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block hover:text-gray-300 py-2">
                Cart {cartItemCount > 0 && <span className="text-red-400">({cartItemCount})</span>}
              </Link>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block hover:text-gray-300 py-2">Orders</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block hover:text-gray-300 py-2">Profile</Link>
              {user.isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-yellow-400 hover:text-yellow-300 py-2">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block hover:text-gray-300 py-2">Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block hover:text-gray-300 py-2">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
