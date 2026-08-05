import React from 'react';

export default function LoadingSkeleton({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 animate-pulse">
        <div className="w-14 h-14 bg-gray-200 rounded-full mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }
  
  if (type === 'text') {
    return (
      <div className="animate-pulse space-y-3 w-full">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse"></div>
    );
  }

  if (type === 'form') {
    return (
      <div className="space-y-6 animate-pulse w-full">
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/5 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return null;
}
