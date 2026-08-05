import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const SuksesPendaftaran = () => {
  useEffect(() => {
    // Generate confetti dynamically
    const colors = ['#B91C1C', '#111111', '#4F46E5', '#10B981', '#F59E0B'];
    const createConfetti = () => {
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 1}s`;
        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }
    };
    
    createConfetti();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-16 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center animate-bounce-in">
            <CheckCircleIcon className="w-20 h-20 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-dark mb-4 animate-slide-up">
          Pendaftaran Berhasil Dikirim! 🎉
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Terima kasih telah mendaftar di LPK Humaira Institute.
        </p>
        
        <div className="bg-primary-50 rounded-2xl p-6 text-left mb-10 border border-primary-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-bold text-primary-800 text-lg mb-3">Langkah Selanjutnya:</h3>
          <ul className="space-y-3 text-primary-700">
            <li className="flex items-start">
              <span className="mr-2">👉</span> 
              Tim kami akan segera mereview pendaftaran kakak.
            </li>
            <li className="flex items-start">
              <span className="mr-2">👉</span>
              Kami akan menghubungi kakak melalui WhatsApp/Email dalam 1-3 hari kerja.
            </li>
            <li className="flex items-start">
              <span className="mr-2">👉</span>
              Mohon siapkan diri untuk mengikuti tahapan seleksi berikutnya.
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/" className="btn-outline w-full sm:w-auto text-center">
            Kembali ke Beranda
          </Link>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary w-full sm:w-auto text-center bg-green-500 hover:bg-green-600 border-none"
          >
            Hubungi Kami via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuksesPendaftaran;
