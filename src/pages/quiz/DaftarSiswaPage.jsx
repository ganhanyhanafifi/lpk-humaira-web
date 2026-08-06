import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { checkUsernameAvailable } from '../../firebase/quizService';

/**
 * DaftarSiswaPage - Student registration form
 */
const DaftarSiswaPage = () => {
  const [formData, setFormData] = useState({
    nama: '',
    kelas: '',
    telepon: '',
    username: '',
    password: '',
    konfirmasiPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();
  const { register } = useAuth();

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(async () => {
      const username = formData.username;
      
      // Basic validation
      if (!username || username.length < 4) {
        setIsUsernameAvailable(null);
        return;
      }
      
      const alphanumericUnderscoreRegex = /^[a-zA-Z0-9_]+$/;
      if (!alphanumericUnderscoreRegex.test(username)) {
        setIsUsernameAvailable(false);
        setErrors(prev => ({ ...prev, username: 'Username hanya boleh berisi huruf, angka, dan underscore (_)' }));
        return;
      }

      setIsCheckingUsername(true);
      try {
        const available = await checkUsernameAvailable(username);
        setIsUsernameAvailable(available);
        if (!available) {
          setErrors(prev => ({ ...prev, username: 'Username sudah digunakan' }));
        } else {
          setErrors(prev => ({ ...prev, username: null }));
        }
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama lengkap wajib diisi';
      isValid = false;
    }

    if (!formData.kelas) {
      newErrors.kelas = 'Silakan pilih kelas';
      isValid = false;
    }

    // Indonesian phone validation (starts with 08 or +62, min 10 digits)
    const phoneRegex = /^(08|\+62)\d{8,13}$/;
    if (!formData.telepon || !phoneRegex.test(formData.telepon.replace(/[\s-]/g, ''))) {
      newErrors.telepon = 'Nomor telepon tidak valid (contoh: 08123456789)';
      isValid = false;
    }

    if (!formData.username || formData.username.length < 4) {
      newErrors.username = 'Username minimal 4 karakter';
      isValid = false;
    } else if (isUsernameAvailable === false) {
      newErrors.username = 'Username sudah digunakan';
      isValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      isValid = false;
    }

    if (formData.password !== formData.konfirmasiPassword) {
      newErrors.konfirmasiPassword = 'Konfirmasi password tidak cocok';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    if (isUsernameAvailable === false) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        nama: formData.nama,
        kelas: formData.kelas,
        telepon: formData.telepon,
        username: formData.username,
        password: formData.password,
        role: 'siswa'
      });
      
      // Success, redirect to login
      navigate('/quiz/login-siswa', { 
        state: { message: 'Pendaftaran berhasil! Silakan login dengan akun Anda.' } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.';
      if (error.message === 'Username sudah digunakan') {
        errorMessage = 'Username ini sudah digunakan, silakan pilih yang lain.';
        setIsUsernameAvailable(false);
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-inter">
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-red-700 py-6 px-8">
          <h2 className="text-2xl font-bold font-poppins text-white text-center">Daftar Akun Siswa</h2>
          <p className="text-red-100 text-sm text-center mt-1">Lengkapi data di bawah untuk bergabung</p>
        </div>

        <div className="p-8">
          {submitError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                autoComplete="name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
            </div>

            <div>
              <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <select
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.kelas ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Pilih Kelas</option>
                <option value="1">Kelas 1</option>
                <option value="2">Kelas 2</option>
                <option value="3">Kelas 3</option>
              </select>
              {errors.kelas && <p className="mt-1 text-xs text-red-600">{errors.kelas}</p>}
            </div>

            <div>
              <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <input
                type="tel"
                id="telepon"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                autoComplete="tel"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.telepon ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="08xxxxxxxxxx"
              />
              {errors.telepon && <p className="mt-1 text-xs text-red-600">{errors.telepon}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Buat username"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {isCheckingUsername && (
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {!isCheckingUsername && formData.username.length >= 4 && isUsernameAvailable === true && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                  {!isCheckingUsername && formData.username.length >= 4 && isUsernameAvailable === false && (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              {errors.username ? (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Minimal 4 karakter, hanya huruf, angka, dan underscore.</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Minimal 6 karakter"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="konfirmasiPassword" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <input
                type="password"
                id="konfirmasiPassword"
                name="konfirmasiPassword"
                value={formData.konfirmasiPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.konfirmasiPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ulangi password"
              />
              {errors.konfirmasiPassword && <p className="mt-1 text-xs text-red-600">{errors.konfirmasiPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isCheckingUsername || isUsernameAvailable === false}
              className="w-full mt-4 bg-red-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </>
              ) : (
                'Daftar Akun'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/quiz/login-siswa" className="text-red-700 font-medium hover:underline">
              Login di sini
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DaftarSiswaPage;
