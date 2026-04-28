import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(user ? [
      { name: 'Orders', path: '/orders' },
      { name: 'Profile', path: '/profile' },
      ...(user.isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
    ] : []),
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      // Ensure the nav container is relative so the absolute menu positions against it
      className="sticky top-0 z-50 bg-slate-900 border-b border-blue-900/50 shadow-lg shadow-blue-900/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20 bg-slate-900 z-50 relative">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-300">
            StyleStore
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2 items-center font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-blue-400 bg-blue-900/20' : 'text-slate-300 hover:text-blue-300'
                }`}
              >
                {link.name}
              </motion.div>
            </Link>
          ))}

          <form onSubmit={handleSearch} className="relative ml-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 text-slate-200 text-sm px-4 py-2 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-48 transition-all focus:w-64"
            />
          </form>

          {user ? (
            <>
              <Link to="/cart">
                <motion.div
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-xl transition-colors duration-200 flex items-center gap-1.5 ${
                    location.pathname === '/cart' ? 'text-blue-400 bg-blue-900/20' : 'text-slate-300 hover:text-blue-300'
                  }`}
                >
                  Cart
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full shadow-md shadow-blue-500/40"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="ml-4 bg-slate-800 text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300 px-5 py-2 rounded-xl transition-all text-sm font-semibold"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <div className="flex items-center space-x-3 ml-4">
              <Link to="/login" className="text-slate-300 hover:text-blue-400 px-4 py-2 font-medium transition-colors">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 font-medium">
                  Register
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Elements (Search, Cart, Menu) */}
        <div className="flex md:hidden items-center space-x-1 sm:space-x-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 text-slate-200 text-sm px-3 py-1.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-28 sm:w-36 transition-all"
            />
          </form>

          {user && (
            <Link to="/cart" className="relative text-slate-300 hover:text-blue-300 p-1.5">
              <span className="sr-only">Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col space-y-1.5 p-2 rounded-lg hover:bg-slate-800 transition-colors z-50 ml-1"
          >
            <span className={`block w-6 h-0.5 bg-blue-400 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-blue-400 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-blue-400 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Absolute Positioning) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            // absolute, top-20 (height of navbar), left-0, w-full ensures it overlays content
            className="absolute top-20 left-0 w-full md:hidden bg-slate-900 border-b border-blue-900/50 shadow-xl shadow-slate-900/50 z-40"
          >
            <div className="px-4 py-4 space-y-2 font-medium max-h-[calc(100vh-5rem)] overflow-y-auto">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`block px-4 py-3 rounded-xl transition-colors ${
                    location.pathname === link.path ? 'bg-blue-900/30 text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-blue-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 mt-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-2 flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-300 transition-colors text-center border border-slate-700"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors text-center shadow-lg shadow-blue-900/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;