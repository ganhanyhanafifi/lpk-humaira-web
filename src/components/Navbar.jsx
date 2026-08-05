import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { navigationItems } from '../config/navigationData';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Kiri */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <img 
                  src="/logo.png" 
                  alt="LPK Humaira Logo" 
                  className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
                />
                <span className="font-heading font-bold text-xl tracking-tight text-dark">
                  LPK Humaira <span className="text-primary-700">Institute</span>
                </span>
              </Link>
            </div>
            
            {/* Menu Navigasi Tengah */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative group px-3 py-2">
                  <Link 
                    to={item.href || '#'} 
                    className="font-medium text-gray-700 hover:text-primary-700 transition-colors py-2 flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                  {item.children && <MegaMenu items={item.children} />}
                </div>
              ))}
            </div>

            {/* Tombol Akses Kanan (Solid Red Pill) */}
            <div className="hidden lg:flex items-center">
              <Link 
                to="/pendaftaran" 
                className="bg-primary-700 hover:bg-primary-800 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-md hover:shadow-primary-700/40 hover:-translate-y-0.5"
              >
                Daftar Sekarang
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="p-2 rounded-xl text-dark hover:bg-gray-100 focus:outline-none"
              >
                <Bars3Icon className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
