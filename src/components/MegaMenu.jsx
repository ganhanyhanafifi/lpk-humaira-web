import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

export default function MegaMenu({ items }) {
  return (
    <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 animate-slide-down z-50 min-w-[240px]">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-2 max-h-[70vh] overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="relative group/sub">
            <Link 
              to={item.href || '#'} 
              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 hover:border-l-4 hover:border-primary-700 transition-all"
            >
              <span>{item.label}</span>
              {item.children && <ChevronRightIcon className="w-4 h-4 ml-2" />}
            </Link>
            {item.children && (
              <div className="absolute top-0 left-full pl-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 min-w-[240px]">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-2">
                  {item.children.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.href || '#'}
                      className="block px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 hover:border-l-4 hover:border-primary-700 transition-all"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
