import React, { useRef } from 'react';
import { CloudArrowUpIcon, XCircleIcon, DocumentIcon } from '@heroicons/react/24/outline';

export default function FileUpload({ 
  label, name, accept = '.jpg,.jpeg,.png,.pdf', maxSize = 5, 
  onFileSelect, file, progress, error, preview 
}) {
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0], name);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0], name);
    }
  };

  return (
    <div className="w-full mb-6">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
            ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-primary-700 hover:bg-primary-50'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input 
            type="file" 
            ref={inputRef}
            className="hidden" 
            accept={accept} 
            onChange={handleChange} 
          />
          <CloudArrowUpIcon className={`w-12 h-12 mx-auto mb-3 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <p className="text-gray-700 font-medium mb-1">Seret file ke sini atau klik untuk memilih</p>
          <p className="text-gray-500 text-sm">JPG, PNG, atau PDF (Maks. {maxSize}MB)</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {preview && preview !== 'pdf' ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <DocumentIcon className="w-6 h-6 text-primary-700" />
              )}
            </div>
            <div className="truncate pr-4">
              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => onFileSelect(null, name)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      )}
      
      {progress !== undefined && progress > 0 && progress < 100 && (
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">{progress}%</p>
        </div>
      )}
      
      {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
