import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { pagesContent } from '../config/pagesContent';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

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
            Halaman yang kakak cari sedang dalam proses pengembangan. Silakan kembali lagi nanti ya kalo saya sudah masuk dalam jajaran staff LPK Humaira Institute. ini hanya untuk portofolio Raihan Ganhany
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
  
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="py-12 md:py-16 pb-16 bg-gradient-to-r from-primary-800 to-primary-600 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4 animate-slide-up">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="text-primary-50 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {content.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
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

        {/* Content Sections */}
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
      </div>
    </div>
  );
};

export default GenericPage;
