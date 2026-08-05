import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function ProgramCard({ title, description, icon, href, index = 0 }) {
  return (
    <Link 
      to={href} 
      className="block group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-700 to-primary-500"></div>
      
      <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      
      <h3 className="font-heading font-semibold text-xl mb-3 text-[#111111]">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center text-primary-700 font-medium group-hover:text-primary-800">
        <span>Selengkapnya</span>
        <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
      </div>
    </Link>
  );
}
