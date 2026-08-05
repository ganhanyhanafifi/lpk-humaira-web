import React from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function StepTimeline() {
  return (
    <div className="py-8">
      <h3 className="font-heading font-bold text-2xl text-[#111111] mb-8 text-center">
        TAHAPAN SELEKSI
      </h3>
      
      <div className="max-w-xl mx-auto">
        <div className="relative pl-6 sm:pl-0">
          {/* Timeline Line */}
          <div className="hidden sm:block absolute left-[28px] top-4 bottom-12 w-0.5 bg-gray-300"></div>
          <div className="sm:hidden absolute left-[19px] top-4 bottom-12 w-0.5 bg-gray-300"></div>

          {/* Step 1 */}
          <div className="relative flex items-start gap-6 mb-10">
            <div className="absolute -left-1 sm:static w-10 h-10 rounded-full bg-primary-700 text-white font-bold flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-md">
              1
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 w-full ml-8 sm:ml-0">
              <h4 className="font-bold text-lg text-primary-800 mb-2">Tes Fisik</h4>
              <p className="text-gray-600">Meliputi lari, tes keseimbangan, push up, dan sit up.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-start gap-6 mb-10">
            <div className="absolute -left-1 sm:static w-10 h-10 rounded-full bg-primary-700 text-white font-bold flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-md">
              2
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 w-full ml-8 sm:ml-0">
              <h4 className="font-bold text-lg text-primary-800 mb-2">Psikotes</h4>
              <p className="text-gray-600">Meliputi tes Hiragana, Matematika, Tes Ketelitian, dan Tes Kreplin.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-start gap-6 mb-12">
            <div className="absolute -left-1 sm:static w-10 h-10 rounded-full bg-primary-700 text-white font-bold flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-md">
              3
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 w-full ml-8 sm:ml-0">
              <h4 className="font-bold text-lg text-primary-800 mb-2">MCU (Medical Check Up)</h4>
              <p className="text-gray-600">Pemeriksaan kesehatan menyeluruh di klinik/rumah sakit rujukan.</p>
            </div>
          </div>
        </div>

        {/* Success Section */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <CheckBadgeIcon className="w-8 h-8 text-green-600" />
            <h4 className="font-bold text-green-800 text-lg">
              Setelah dinyatakan LULUS SEMUA TES, kakak akan:
            </h4>
          </div>
          <ul className="space-y-3 ml-1">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
              <span className="text-green-800">Dimasukkan ke grup WhatsApp/Telegram Angkatan 14</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
              <span className="text-green-800">Menerima Surat Orientasi berisi daftar persiapan yang harus disiapkan</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
