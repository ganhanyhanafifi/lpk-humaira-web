import React from 'react';

export default function SectionTitle({ title, subtitle, centered = true, light = false }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center flex flex-col items-center' : ''}`}>
      <h2 className={`font-heading text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-[#111111]'}`}>
        {title}
      </h2>
      <div className={`w-16 h-1 bg-primary-700 rounded ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-lg ${light ? 'text-gray-300' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
