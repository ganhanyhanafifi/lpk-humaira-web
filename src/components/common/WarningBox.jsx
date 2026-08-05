import React from 'react';
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function WarningBox() {
  const conditions = [
    "Cacat fisik permanen",
    "Memiliki tato / bekas tato",
    "Riwayat patah tulang",
    "Tuli / gangguan pendengaran",
    "Hernia",
    "Buta warna"
  ];

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
        <h3 className="font-heading font-bold text-xl text-red-800">
          PERHATIAN — SYARAT WAJIB PENDAFTAR
        </h3>
      </div>
      
      <p className="text-red-900 mb-4 font-medium">
        Peserta dinyatakan TIDAK LOLOS apabila memiliki kondisi fisik berikut:
      </p>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {conditions.map((condition, index) => (
          <li key={index} className="flex items-start gap-2">
            <XCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-red-800">{condition}</span>
          </li>
        ))}
      </ul>
      
      <div className="bg-red-100 p-3 rounded-lg border border-red-200">
        <p className="text-red-800 font-bold italic text-sm text-center">
          Pastikan kondisi fisik kakak memenuhi syarat sebelum mendaftar.
        </p>
      </div>
    </div>
  );
}
