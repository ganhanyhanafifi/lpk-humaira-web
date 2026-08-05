import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function FormInput({ 
  label, name, type = 'text', value, onChange, error, 
  required, placeholder, options = [], disabled, children 
}) {
  const baseClasses = `w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none
    ${error ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-primary-700 focus:ring-2 focus:ring-primary-100'}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white'}`;

  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            rows={4}
            className={baseClasses}
            required={required}
          />
        ) : type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={baseClasses}
            required={required}
          >
            <option value="" disabled>{placeholder || 'Pilih salah satu...'}</option>
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : children ? (
          children
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={baseClasses}
            required={required}
          />
        )}
      </div>
      
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-500 font-medium">
          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}
