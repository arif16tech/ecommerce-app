import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });
  const [step, setStep] = useState('login'); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      if (result.requiresVerification) {
         toast.error(result.message);
      } else {
         setError(result.message);
         toast.error(result.message || 'Login failed');
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await forgotPassword(resetData.email);

    if (result.success) {
      toast.success(result.message || 'OTP sent to your email.');
      setStep('resetPassword');
    } else {
      setError(result.message);
      toast.error(result.message || 'Failed to send OTP');
    }

    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await resetPassword(resetData.email, resetData.otp, resetData.newPassword);

    if (result.success) {
      toast.success('Password reset successfully! You can now log in.');
      setStep('login');
      setFormData({ ...formData, email: resetData.email });
    } else {
      setError(result.message);
      toast.error(result.message || 'Failed to reset password');
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 w-full max-w-[400px] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
        
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">
          {step === 'login' ? 'Welcome Back' : step === 'forgotPassword' ? 'Reset Password' : 'New Password'}
        </h2>
        <p className="text-center text-slate-400 mb-8 font-medium">
          {step === 'login' ? 'Log in to your StyleStore account' : step === 'forgotPassword' ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}

        {step === 'login' && (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-300">Password</label>
                  <button type="button" onClick={() => setStep('forgotPassword')} className="text-sm font-medium text-slate-400 hover:text-white hover:underline transition-colors">
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-slate-900 py-3.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold shadow-lg transition-all active:scale-[0.98]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-700 rounded-xl shadow-sm bg-slate-800 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>
            </div>

            <p className="text-center text-sm text-slate-400 mt-8 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline transition-all font-bold">
                Create one
              </Link>
            </p>
          </>
        )}

        {step === 'forgotPassword' && (
          <motion.form 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleForgotPassword} className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={resetData.email}
                onChange={(e) => setResetData({...resetData, email: e.target.value})}
                required
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-900 py-3.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'Sending OTP...' : 'Send Reset OTP'}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => setStep('login')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Back to Login
              </button>
            </div>
          </motion.form>
        )}

        {step === 'resetPassword' && (
          <motion.form 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleResetPassword} className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">OTP</label>
              <input
                type="text"
                value={resetData.otp}
                onChange={(e) => setResetData({...resetData, otp: e.target.value})}
                required maxLength="6"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white tracking-widest text-center font-mono placeholder-slate-500"
                placeholder="------"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={resetData.newPassword}
                onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                required minLength="6"
                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-900 py-3.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => setStep('login')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Back to Login
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
