import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#111111] text-gray-400 pt-16 pb-8 border-t-4 border-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Social Links */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="LPK Humaira Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
              <span className="font-heading font-bold text-2xl text-white">LPK Humaira Institute</span>
            </div>
            <p className="mb-6 leading-relaxed text-sm">
              Lembaga Pelatihan Kerja terpercaya yang menyiapkan tenaga kerja profesional dan kompeten untuk meraih peluang karir global di Jepang.
            </p>
            
            {/* Social Media Image Buttons */}
            <div className="flex items-center space-x-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/lpk_humairainstitute/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all border border-white/10 bg-white/5"
                title="Instagram LPK Humaira Institute"
              >
                <img src="/icon-ig.png" alt="Instagram" className="w-full h-full object-cover" />
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/profile.php?id=61565595830524" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 transition-all border border-white/10 bg-white/5"
                title="Facebook LPK Humaira Institute"
              >
                <img src="/icon-fb.png" alt="Facebook" className="w-full h-full object-cover" />
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@humairainstitute?is_from_webapp=1&sender_device=pc" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/30 transition-all border border-white/10 bg-white/5"
                title="TikTok LPK Humaira Institute"
              >
                <img src="/icon-tiktok.png" alt="TikTok" className="w-full h-full object-cover" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-primary-700 rounded"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/program/jepang/intensif" className="hover:text-primary-400 transition-colors">Program Intensif</Link></li>
              <li><Link to="/program/jepang/matching-job" className="hover:text-primary-400 transition-colors">Matching Job</Link></li>
              <li><Link to="/program/jepang/kelas-kaiwa" className="hover:text-primary-400 transition-colors">Kelas Kaiwa</Link></li>
              <li><Link to="/ujian" className="hover:text-primary-400 transition-colors">Ujian</Link></li>
            </ul>
          </div>

          {/* Column 3: Informasi */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-6 relative inline-block">
              Informasi
              <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-primary-700 rounded"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/informasi/bidang-kerja" className="hover:text-primary-400 transition-colors">Bidang Kerja</Link></li>
              <li><Link to="/informasi/biaya" className="hover:text-primary-400 transition-colors">Biaya</Link></li>
              <li><Link to="/informasi/fasilitas" className="hover:text-primary-400 transition-colors">Fasilitas</Link></li>
              <li><Link to="/informasi/lowongan" className="hover:text-primary-400 transition-colors">Lowongan Kerja</Link></li>
            </ul>
          </div>

          {/* Column 4: Kontak Resmi */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-6 relative inline-block">
              Kontak
              <span className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-primary-700 rounded"></span>
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="leading-snug">Jl. Tanwiriyyah, Sindanglaka, Kec. Karangtengah, Kabupaten Cianjur, Jawa Barat 43281</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-primary-500 shrink-0" />
                <a href="tel:+6285798501628" className="hover:text-white transition-colors">+62-857-9850-1628</a>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-500 shrink-0" />
                <a href="mailto:lpkhai23@gmail.com" className="hover:text-white transition-colors">lpkhai23@gmail.com</a>
              </li>
              <li className="pt-1">
                <a 
                  href="https://wa.me/6285798501628" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md hover:scale-105"
                >
                  WhatsApp Admin
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs">© 2024 LPK Humaira Institute. All rights reserved.</p>
          <button onClick={scrollToTop} className="mt-4 md:mt-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-700 text-white transition-colors" title="Kembali ke atas">
            <ArrowUpIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
