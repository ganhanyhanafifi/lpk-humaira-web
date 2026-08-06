import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { navigationItems } from '../../config/navigationData';

export default function MobileMenu({ isOpen, onClose }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderItems = (items, level = 0) => {
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems[item.label];

      return (
        <div key={index} className="w-full">
          {hasChildren ? (
            <div 
              className={`flex items-center justify-between py-3 px-4 border-b border-gray-100 text-gray-800 ${level > 0 ? 'pl-' + (4 + level * 4) : ''}`}
              onClick={() => toggleExpand(item.label)}
            >
              <span className="font-medium text-lg">{item.label}</span>
              <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          ) : (
            <Link 
              to={item.href || '#'} 
              className={`block py-3 px-4 border-b border-gray-100 font-medium text-lg ${level > 0 ? 'pl-' + (4 + level * 4) : ''} ${
                item.accentColor 
                  ? 'text-amber-700 bg-amber-50' 
                  : 'text-gray-800'
              }`}
              onClick={onClose}
            >
              <span className="flex items-center gap-2">
                {item.label}
                {item.badge && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </span>
            </Link>
          )}
          {hasChildren && (
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}>
              <div className="bg-gray-50">
                {renderItems(item.children, level + 1)}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col transform transition-transform duration-300 translate-x-0 overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-primary-700 rounded-full inline-block"></span>
          <span className="font-heading font-bold text-xl text-dark">LPK Humaira</span>
        </div>
        <button onClick={onClose} className="p-2 text-gray-600 hover:text-dark">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 pb-24">
        {renderItems(navigationItems)}
      </div>
      <div className="fixed bottom-0 w-full p-4 bg-white border-t border-gray-100">
        <Link 
          to="/pendaftaran" 
          className="block w-full text-center bg-primary-700 text-white py-3 rounded-xl font-bold shadow-lg"
          onClick={onClose}
        >
          DAFTAR SEKARANG
        </Link>
      </div>
    </div>
  );
}
