import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount (reads from cookie)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/check');
      if (response.data.success && response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };



  // Login function (cookie set by backend)
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      if (error.response?.data?.requiresVerification) {
        return { success: false, requiresVerification: true, message: error.response.data.message };
      }
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
        // Don't set user here, just return success to trigger OTP flow
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Verify Email (OTP)
  const verifyEmail = async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-email', { email, otp });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Verification failed' };
    }
  };

  // Resend OTP
  const resendOTP = async (email) => {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to resend OTP' };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send reset email' };
    }
  };

  // Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { email, otp, newPassword });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
    }
  };

  // Logout function (cookie cleared by backend)
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state anyway
      setUser(null);
    }
  };

  // Update user state
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };



  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus,
    verifyEmail,
    resendOTP,
    forgotPassword,
    resetPassword
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
