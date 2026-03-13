import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Check authentication status on mount (reads from cookie)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated by calling backend
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/check');
      if (response.data.success && response.data.authenticated) {
        setUser(response.data.user);
        await fetchCart(); // Fetch cart if authenticated
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        setCart(response.data.cart);
        setCartTotal(response.data.total);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  // Login function (cookie set by backend)
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function (cookie set by backend)
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout function (cookie cleared by backend)
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setCart([]);
      setCartTotal(0);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state anyway
      setUser(null);
      setCart([]);
      setCartTotal(0);
    }
  };

  // Update user state
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCartTotal(0);
  };

  const value = {
    user,
    loading,
    cart,
    cartTotal,
    login,
    register,
    logout,
    updateUser,
    fetchCart,
    clearCart,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
