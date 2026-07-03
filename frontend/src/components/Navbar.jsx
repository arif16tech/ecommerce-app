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
      className="sticky top-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20 relative">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          {/* A sleek minimal icon/logo placeholder for dark theme */}
          <div className="w-8 h-8 bg-white rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
          </div>
          STYLESTORE
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center font-medium text-base">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}>
              <motion.span
                whileHover={{ y: -1 }}
                className={`transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.name}
              </motion.span>
            </Link>
          ))}

          <form onSubmit={handleSearch} className="relative ml-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/80 text-white text-base px-5 py-2 rounded-full border border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-500 focus:border-slate-500 w-48 transition-all focus:w-64 placeholder-slate-400"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </form>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="relative text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[11px] font-bold text-slate-900 bg-white rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors text-base font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link to="/login" className="text-slate-400 hover:text-white font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-white hover:bg-slate-200 text-slate-900 px-5 py-2 rounded-full transition-all text-base font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Elements */}
        <div className="flex md:hidden items-center space-x-4">
          {user && (
            <Link to="/cart" className="relative text-slate-400 hover:text-white p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-slate-900 bg-white rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-full hover:bg-slate-800 transition-colors z-50"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'translate-y-0.5'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 absolute ${isMenuOpen ? '-rotate-45' : 'opacity-0'}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-xl z-40 overflow-hidden"
          >
            <div className="px-4 py-5 space-y-2 font-medium text-lg">
              <form onSubmit={handleSearch} className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-white px-5 py-3 rounded-xl border border-slate-700 focus:outline-hidden focus:border-slate-500 placeholder-slate-400"
                />
              </form>
              
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`block px-5 py-3 rounded-xl transition-colors ${
                    location.pathname === link.path ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-5 border-t border-slate-800 mt-4 flex flex-col gap-3">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="block px-5 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-center font-semibold"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="block px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-200 text-center font-bold transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;