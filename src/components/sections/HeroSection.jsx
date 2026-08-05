import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  PlayIcon, 
  AcademicCapIcon, 
  CheckCircleIcon, 
  UserGroupIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  BookOpenIcon,
  DocumentCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/solid';

import HeroBackgroundSlider from './HeroBackgroundSlider';

export default function HeroSection() {
  const tagsRow1 = [
    { label: 'Magang Kerja Jepang' },
    { label: 'Tokutei Ginou (SSW)' },
    { label: 'Kelas Bahasa N5-N3' },
  ];

  const tagsRow2 = [
    { label: 'Matching Job Perusahaan' },
    { label: 'Persiapan Ujian JLPT/JFT' },
    { label: 'Program Dana Talangan' },
  ];

  return (
    <div className="relative pt-8 pb-16 md:pt-12 md:pb-24 bg-gradient-to-b from-gray-50 via-white to-white overflow-hidden">
      {/* Background Auto Crossfade Image Slider */}
      <HeroBackgroundSlider />

      {/* Decorative Background Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl pointer-events-none z-10"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-gray-100/60 rounded-full blur-2xl pointer-events-none z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Kolom Kiri: Headline, Subheading, CTAs, Pill Tags */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Small Top Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-700 animate-pulse"></span>
              <span className="text-xs md:text-sm font-semibold text-primary-800 uppercase tracking-wider">
                Lembaga Pelatihan Kerja Resmi Kemenaker
              </span>
            </div>

            {/* Headline Besar (Mixed Color: Hitam & Merah) */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark leading-[1.15] tracking-tight">
              Wujudkan <span className="text-primary-700 relative inline-block">
                Karir di Jepang
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-200 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,5 100,15" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
              </span> bersama LPK Humaira
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl font-body">
              Pelatihan bahasa & persiapan keterampilan kerja profesional dari dasar hingga siap berangkat ke Jepang. Garansi bimbingan sampai lulus.
            </p>

            {/* 2 CTA Buttons (Highlight Red Pill + Black Outline Video) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              
              {/* Highlight Button: KLIK UNTUK DAFTAR SEKARANG! */}
              <Link 
                to="/pendaftaran" 
                className="group relative flex items-center justify-center bg-primary-700 hover:bg-primary-800 text-white font-extrabold px-9 py-4.5 rounded-full text-base md:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary-700/50 hover:scale-105 active:scale-100 ring-4 ring-primary-700/20"
              >
                <span>KLIK UNTUK DAFTAR SEKARANG!</span>
              </Link>

              <Link 
                to="/program" 
                className="flex items-center justify-center gap-2.5 border-2 border-dark text-dark hover:bg-dark hover:text-white font-semibold px-7 py-4.5 rounded-full text-base md:text-lg transition-all duration-300"
              >
                <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center group-hover:bg-white">
                  <PlayIcon className="w-4 h-4 ml-0.5" />
                </div>
                Lihat Program
              </Link>

            </div>

            {/* Baris Tag Pill Kecil (2 Baris Outline Pills) */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Program Unggulan:</p>
              
              {/* Row 1 */}
              <div className="flex flex-wrap gap-2">
                {tagsRow1.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center text-xs md:text-sm font-semibold px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Row 2 */}
              <div className="flex flex-wrap gap-2">
                {tagsRow2.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center text-xs md:text-sm font-semibold px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Floating Cards Composition */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Lingkaran Dashed Dekoratiff Background */}
            <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border-2 border-dashed border-gray-300 animate-spin-slow pointer-events-none"></div>

            {/* Floating Mini Card Stat 1 (Top Left Overlap) */}
            <div className="absolute -top-4 -left-2 sm:-left-6 z-20 bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 flex items-center gap-3 animate-float">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Alumni Bekerja</p>
                <p className="text-lg font-bold font-heading text-dark">200+ Siswa</p>
              </div>
            </div>

            {/* Big Main Card (Dark Rounded 3XL) */}
            <div className="w-full max-w-md bg-[#111111] text-white rounded-3xl p-6 shadow-2xl relative border border-gray-800 z-10 hover:shadow-primary-700/20 transition-all">
              
              {/* ========================================================================= */}
              {/* [SECTION 1: FOTO BANNER UTAMA HERO] - File: public/hero-banner.jpg        */}
              {/* ========================================================================= */}
              <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden relative mb-5 bg-gray-800 border border-white/10">
                <img 
                  src="/hero-banner.jpg" 
                  alt="Dokumentasi Keberangkatan Siswa LPK Humaira Institute" 
                  className="w-full h-full object-cover object-[50%_40%] md:object-[50%_35%] hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Image Overlay Tag tanpa Emoji */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold tracking-wide">Pelepasan Keberangkatan Siswa</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Text */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-primary-400 font-bold tracking-wider uppercase">Keberangkatan Resmi</span>
                  <span className="text-xs text-gray-400 font-medium">100% Visa Resmi</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Pelepasan Kontingen Mahasiswa LPK Humaira ke Jepang
                </h3>
              </div>

            </div>

            {/* Floating Red Circle Badge (Bottom Right Overlap) */}
            <div className="absolute -bottom-4 -right-2 sm:-right-4 z-20 bg-primary-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
              <AcademicCapIcon className="w-7 h-7" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
