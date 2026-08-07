import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { pagesContent } from '../config/pagesContent';
import { teamData } from '../config/teamData';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { MapPinIcon, PhoneIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const GenericPage = () => {
  const location = useLocation();
  const path = location.pathname;
  const content = pagesContent?.[path];

  if (!content) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="text-center animate-fade-in max-w-lg mx-auto">
          <div className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-primary-700 text-6xl">🚧</span>
          </div>
          <h1 className="text-4xl font-bold font-heading text-dark mb-4">Halaman Segera Hadir</h1>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Halaman yang kakak cari sedang dalam proses pengembangan. Silakan kembali lagi nanti ya.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Generate breadcrumbs from path
  const pathParts = path.split('/').filter(Boolean);
  
  // Sort team data by urutan ascending (1 = pimpinan/tertinggi)
  const sortedTeam = [...teamData].sort((a, b) => (a.urutan || 99) - (b.urutan || 99));

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="py-12 md:py-16 pb-16 bg-gradient-to-r from-primary-800 to-primary-600 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4 animate-slide-up">
            {content.heroTitle || content.title}
          </h1>
          {content.heroSubtitle && (
            <p className="text-primary-50 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {content.heroSubtitle}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Breadcrumbs */}
        <nav className="bg-white px-6 py-3 rounded-xl shadow-md mb-8 flex text-sm text-gray-500 font-medium overflow-x-auto">
          <ol className="flex items-center space-x-2 whitespace-nowrap">
            <li>
              <Link to="/" className="hover:text-primary-700 transition-colors">Beranda</Link>
            </li>
            {pathParts.map((part, index) => {
              const isLast = index === pathParts.length - 1;
              const formattedPart = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              const to = `/${pathParts.slice(0, index + 1).join('/')}`;
              
              return (
                <React.Fragment key={to}>
                  <li><ChevronRightIcon className="w-5 h-5 text-gray-400" /></li>
                  <li>
                    {isLast ? (
                      <span className="text-primary-700">{formattedPart}</span>
                    ) : (
                      <Link to={to} className="hover:text-primary-700 transition-colors">
                        {formattedPart}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>

        {/* Custom Layout for Alamat Kantor */}
        {content.type === 'contact_page' && (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold font-heading text-dark mb-6 border-b border-gray-100 pb-4">
                Informasi Kantor Pusat & Kontak
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Item 1: Alamat */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm uppercase tracking-wider mb-1">Alamat Kantor</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      [ISI ALAMAT ASLI KANTOR PUSAT DI SINI]<br/>
                      Jl. Tanwiriyyah, Sindanglaka, Kec. Karangtengah, Kabupaten Cianjur, Jawa Barat 43281
                    </p>
                  </div>
                </div>

                {/* Item 2: Telepon */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm uppercase tracking-wider mb-1">Telepon & WhatsApp</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      [ISI NOMOR TELEPON ASLI DI SINI]<br/>
                      +62 812-3456-7890 / 0263-123456
                    </p>
                  </div>
                </div>

                {/* Item 3: Jam Operasional */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <ClockIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm uppercase tracking-wider mb-1">Jam Operasional</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      [ISI JAM OPERASIONAL ASLI DI SINI]<br/>
                      Senin - Jumat: 08.00 - 17.00 WIB<br/>
                      Sabtu: 08.00 - 15.00 WIB
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed Placeholder */}
              <div>
                <h3 className="font-bold text-dark text-lg mb-3">Peta Lokasi Google Maps</h3>
                <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-100 relative">
                  <iframe 
                    title="Google Maps Lokasi LPK Humaira Institute"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.570123456789!2d107.150000!3d-6.820000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDknMTIuMCJTIDEwN8KwMDknMDAuMCJF!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  [GANTI LINK EMBED GOOGLE MAPS DI SINI]
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Layout for Our Team */}
        {content.type === 'team_page' && (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold font-heading text-dark mb-2 border-b border-gray-100 pb-4">
                Jajaran Tim & Pengajar
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                Struktur organisasi dan staf profesional LPK Humaira Institute yang berdedikasi membimbing para siswa menuju sukses di Jepang.
              </p>

              {/* Grid Staff Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedTeam.map((staff) => (
                  <div 
                    key={staff.id} 
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-md hover:border-primary-300 transition-all duration-300 flex flex-col items-center"
                  >
                    {staff.fotoUrl ? (
                      <img 
                        src={staff.fotoUrl} 
                        alt={staff.nama} 
                        className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary-500 shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-300 text-gray-400 flex items-center justify-center mb-4 shadow-inner">
                        <UserIcon className="w-12 h-12" />
                      </div>
                    )}
                    <h3 className="font-bold text-dark text-base mb-1 font-heading">{staff.nama}</h3>
                    <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                      {staff.jabatan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Default Content Sections */}
        {!content.type && (
          <div className="space-y-8">
            {content.sections?.map((section, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-8 animate-slide-up"
                style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}
              >
                {section.title && (
                  <h2 className="text-2xl font-bold font-heading text-dark mb-6 border-b border-gray-100 pb-4">
                    {section.title}
                  </h2>
                )}
                <div 
                  className="prose prose-lg prose-primary max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericPage;
