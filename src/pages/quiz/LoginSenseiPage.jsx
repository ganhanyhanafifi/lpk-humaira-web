import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

/**
 * LoginSenseiPage - Sensei (Teacher) login page
 */
const LoginSenseiPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Username dan password wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login(formData.username, formData.password, 'sensei');
      navigate('/quiz/dashboard-sensei');
    } catch (err) {
      console.error('Login error:', err);
      // Custom message for invalid role
      if (err.message?.includes('bukan akun sensei') || err.message?.includes('role')) {
        setError('Akses ditolak: Akun ini bukan akun sensei.');
      } else {
        setError(err.message || 'Gagal login. Periksa kembali username dan password Anda.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-[#111111] rounded-full flex items-center justify-center text-[#D4A017] shadow-lg">
            <AcademicCapIcon className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-poppins">
          Login Sensei
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masuk ke dashboard pengajar untuk mengelola quiz
        </p>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-[#111111] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-800 relative overflow-hidden">
          {/* Decorative gold accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

          {error && (
            <div className="mb-4 bg-red-900/50 border-l-4 border-red-500 p-4 rounded text-sm text-red-200">
              {error}
            </div>
          )}

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-[#D4A017] focus:border-[#D4A017] sm:text-sm transition-colors"
                  placeholder="Masukkan username sensei"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-[#D4A017] focus:border-[#D4A017] sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#111111] bg-[#D4A017] hover:bg-[#F5B700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#D4A017] disabled:opacity-70 transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#111111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Masuk Dashboard'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#111111] text-gray-500">Atau</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/quiz/login-siswa" 
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-300 hover:bg-gray-800 focus:outline-none font-medium transition-colors"
              >
                Kembali ke Login Siswa
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSenseiPage;
