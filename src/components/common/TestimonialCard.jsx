import React from 'react';

export default function TestimonialCard({ name, quote, role, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-primary-700 relative">
      <div className="absolute top-4 right-6 text-6xl text-primary-100 font-heading leading-none">
        "
      </div>
      
      <p className="text-gray-600 italic mb-6 relative z-10 leading-relaxed">
        "{quote}"
      </p>
      
      <div className="flex items-center gap-4">
        {image ? (
          <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-bold text-[#111111]">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
