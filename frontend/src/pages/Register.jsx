import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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
      toast.success('Registration successful!');
      navigate('/');
    } else {
      setError(result.message);
      toast.error(result.message || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-blue-600"></div>
        
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Join StyleStore today</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 font-bold shadow-md shadow-purple-500/20 transition-all active:scale-[0.98] mt-2"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 hover:underline transition-all font-bold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
