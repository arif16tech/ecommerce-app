import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { register, verifyEmail, resendOTP } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      toast.success(result.message || 'Registration successful! Check your email for OTP.');
      setStep(2); 
    } else {
      setError(result.message);
      toast.error(result.message || 'Registration failed');
    }

    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyEmail(formData.email, otp);

    if (result.success) {
      toast.success('Email verified successfully!');
      navigate('/');
    } else {
      setError(result.message);
      toast.error(result.message || 'Verification failed');
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');
    
    const result = await resendOTP(formData.email);
    
    if (result.success) {
      toast.success('A new OTP has been sent to your email.');
    } else {
      setError(result.message);
      toast.error(result.message || 'Failed to resend OTP');
    }
    
    setResending(false);
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
        
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">Create Account</h2>
        <p className="text-center text-slate-400 mb-8 font-medium">Join StyleStore today</p>

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

        {step === 1 ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
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
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 py-3.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold shadow-lg transition-all active:scale-[0.98] mt-2"
          >
            {loading ? 'Creating Account...' : 'Register'}
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
            Sign up with Google
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline transition-all font-bold">
            Log in
          </Link>
        </p>
        </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <p className="text-sm text-slate-400 mb-4 text-center">
              We've sent a 6-digit verification code to <strong className="text-white">{formData.email}</strong>
            </p>
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                  className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-white placeholder-slate-500 text-center tracking-widest text-2xl font-mono"
                  placeholder="------"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-white text-slate-900 py-3.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-bold shadow-lg transition-all active:scale-[0.98] mt-2"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <div className="text-center mt-6">
              <button 
                onClick={handleResendOTP}
                disabled={resending}
                className="text-sm text-slate-300 hover:text-white font-semibold disabled:opacity-50 transition-colors underline underline-offset-4"
              >
                {resending ? 'Sending...' : "Didn't receive code? Resend OTP"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
