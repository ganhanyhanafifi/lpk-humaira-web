import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import TestimonialCard from '../components/common/TestimonialCard';
import { Link } from 'react-router-dom';
import { 
  CheckBadgeIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon, 
  GlobeAsiaAustraliaIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const partners = [
    { name: 'AO Japan Co.', label: 'Tokyo Accepting Org' },
    { name: 'Nippon Welfare Group', label: 'Osaka Caregiver Org' },
    { name: 'Kanto Logistics Inc.', label: 'Yokohama Driver Org' },
    { name: 'Kansai Food Tech', label: 'Kobe Food Factory' },
    { name: 'Chubu Construction', label: 'Nagoya Builder' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Daftar & Isi Data Diri',
      desc: 'Lengkapi formulir pendaftaran online & upload 5 berkas persyaratan utama (KTP, Akta, KK, Ijazah, Surat Izin).'
    },
    {
      num: '02',
      title: 'Ikuti Seleksi & Pelatihan Bahasa',
      desc: 'Ikuti tes seleksi fisik & psikotes, lalu bimbingan bahasa Jepang intensif dari N5 hingga mahir & siap kerja.'
    },
    {
      num: '03',
      title: 'Keberangkatan & Penempatan Kerja',
      desc: 'Proses pencocokan kerja (Matching Job), pengurusan visa resmi, dan keberangkatan langsung ke Jepang.'
    }
  ];

  return (
    <div className="w-full bg-white font-body">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Partner / Mitra Logos Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            Mitra Kerja Sama & Perusahaan Penerima di Jepang
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary-300 transition-all">
                <p className="font-heading font-bold text-dark text-base">{partner.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{partner.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features / Program Unggulan Section (Grid 4-Kolom High Contrast Color Palette) */}
      <section className="py-24 bg-white" id="program-unggulan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-block bg-dark text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                Program Unggulan
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark max-w-3xl leading-tight">
                Wujudkan karir impian dengan <span className="text-primary-700">program terstruktur</span> dari nol hingga siap terbang.
              </h2>
            </div>
            <p className="text-gray-500 text-sm md:text-base max-w-xs md:text-right font-medium">
              Semua yang kakak butuhkan untuk berangkat kerja ke Jepang secara resmi & terpercaya.
            </p>
          </div>

          {/* Grid 4 Kolom: 1 Foto + 3 High-Contrast Cards (Kontras Tinggi & Tulisan Terbaca Jelas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* ========================================================================= */}
            {/* [SECTION 2: FOTO CARD 1 PROGRAM UNGGULAN] - File: public/hero-fasilitas.jpg */}
            {/* ========================================================================= */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[340px] group border border-gray-100">
              <img 
                src="/hero-fasilitas.jpg" 
                alt="Fasilitas Pelatihan & Asrama LPK Humaira Institute" 
                className="w-full h-full object-cover object-[50%_40%] group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-primary-700 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Fasilitas Lengkap
                </span>
                <h3 className="font-heading font-bold text-xl leading-snug">Asrama & Kelas Pelatihan Modern</h3>
                <p className="text-xs text-gray-300 leading-relaxed">Suasana belajar kondusif dengan instruktur berpengalaman Jepang.</p>
              </div>
            </div>

            {/* Card 2: Deep Dark Card (Magang Kerja) */}
            <div className="bg-[#111111] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 border border-gray-800">
              <span className="absolute -right-4 -bottom-6 font-heading font-black text-8xl text-white/5 select-none pointer-events-none group-hover:scale-110 transition-transform">
                01
              </span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-700/20 text-primary-500 border border-primary-700/30 flex items-center justify-center mb-6 shrink-0">
                  <GlobeAltIcon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-3 text-white">Magang Kerja (Ginou Jisshusei)</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Program pemagangan resmi selama 3-5 tahun di perusahaan terpercaya Jepang dengan uang saku & fasilitas lengkap.
                </p>
              </div>
              <Link to="/program/jepang/intensif" className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-400 hover:text-primary-300 transition-colors">
                Detail Program <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Brand Red Card (Tokutei Ginou) */}
            <div className="bg-primary-700 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:bg-primary-800 hover:-translate-y-1 transition-all duration-300">
              <span className="absolute -right-4 -bottom-6 font-heading font-black text-8xl text-white/10 select-none pointer-events-none group-hover:scale-110 transition-transform">
                02
              </span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 shrink-0 border border-white/20">
                  <BuildingOfficeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-3 text-white">Tokutei Ginou (SSW)</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Program Pekerja Berketerampilan Spesifik dengan gaji standar pekerja Jepang & kontrak kerja hingga 5 tahun.
                </p>
              </div>
              <Link to="/informasi/tokutei-ginou" className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-primary-100 transition-colors">
                Detail Program <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 4: Charcoal Dark Card (Kelas Kaiwa & Matching Job) */}
            <div className="bg-[#1A1A1A] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 border border-gray-800">
              <span className="absolute -right-4 -bottom-6 font-heading font-black text-8xl text-white/5 select-none pointer-events-none group-hover:scale-110 transition-transform">
                03
              </span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-700/20 text-primary-500 border border-primary-700/30 flex items-center justify-center mb-6 shrink-0">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-3 text-white">Kelas Kaiwa & Matching Job</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Bimbingan percakapan intensif N5-N3 & pencocokan wawancara kerja langsung dengan user perusahaan Jepang.
                </p>
              </div>
              <Link to="/program/jepang/kelas-kaiwa" className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-400 hover:text-primary-300 transition-colors">
                Detail Program <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Section Mulai dalam 3 Langkah Mudah (Full-Width Red Background) */}
      <section className="py-24 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        
        {/* Background Decorative Patterns */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Kiri: Kartu Gelap Melengkung Besar (Registration Progress Preview) */}
            <div className="lg:col-span-5">
              <div className="bg-[#111111] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                
                {/* Watermark Text Background */}
                <span className="absolute -right-6 -bottom-8 font-heading font-black text-9xl text-white/5 select-none pointer-events-none">
                  LPK
                </span>

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-700/20 text-primary-500 border border-primary-700/30 flex items-center justify-center font-bold text-sm">
                      01
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Progres Pendaftaran</p>
                      <p className="font-heading font-bold text-white text-sm">Siswa Baru Angkatan 14</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold px-3 py-1 rounded-full">
                    Terverifikasi
                  </span>
                </div>

                {/* Card Body Info */}
                <div className="space-y-4 mb-8">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
                    <p className="text-xs text-gray-400">Program Pilihan</p>
                    <p className="font-heading font-bold text-white text-base">Tokutei Ginou — Pengolahan Makanan</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="text-[11px] text-gray-400">Status Berkas</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">5 File Terunggah</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="text-[11px] text-gray-400">Jadwal Tes</p>
                      <p className="text-xs font-bold text-white mt-1">Tes Fisik & Psikotes</p>
                    </div>
                  </div>
                </div>

                {/* Pill Buttons Action at Bottom */}
                <div className="flex items-center gap-3 pt-2">
                  <Link 
                    to="/pendaftaran" 
                    className="flex-1 bg-white text-dark hover:bg-gray-100 text-center font-bold text-xs py-3 px-4 rounded-full transition-colors shadow-sm"
                  >
                    Cek Status
                  </Link>
                  <Link 
                    to="/pendaftaran" 
                    className="flex-1 border border-white/20 text-white hover:bg-white/10 text-center font-semibold text-xs py-3 px-4 rounded-full transition-colors"
                  >
                    Upload Dokumen
                  </Link>
                  <div className="w-10 h-10 rounded-full bg-primary-700 text-white flex items-center justify-center shadow-lg shrink-0 cursor-pointer hover:bg-primary-800 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                </div>

              </div>
            </div>

            {/* Kanan: Headline + 3 Poin Langkah Mudah */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="inline-block bg-white/10 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-white/20">
                  Alur Mudah
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Mulai Persiapan Kerja ke Jepang dalam 3 Langkah Mudah
                </h2>
              </div>

              {/* 3 Steps List */}
              <div className="space-y-6 pt-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-dark text-white flex items-center justify-center font-heading font-extrabold text-lg shrink-0 border border-gray-800 group-hover:bg-white group-hover:text-primary-700 transition-colors duration-300 shadow-md">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl text-white mb-1">{step.title}</h3>
                      <p className="text-primary-100 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Pill Button */}
              <div className="pt-4">
                <Link 
                  to="/pendaftaran" 
                  className="inline-flex items-center gap-3 bg-white text-primary-800 hover:bg-gray-100 font-extrabold px-8 py-4 rounded-full text-base transition-all shadow-2xl hover:scale-105"
                >
                  MULAI PENDAFTARAN SEKARANG
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Keunggulan Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-primary-50 text-primary-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-primary-100">
              Keunggulan Utama
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-dark">
              Kenapa Memilih <span className="text-primary-700">LPK Humaira Institute</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-300 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckBadgeIcon className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark mb-3">Lembaga Resmi Kemenaker</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Terdaftar & berizin resmi operasional penuh dari Dinas Ketenagakerjaan.</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-300 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AcademicCapIcon className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark mb-3">Sensei Berpengalaman</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Pengajar sertifikasi native & alumni Jepang yang memahami budaya kerja asli.</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-300 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CurrencyDollarIcon className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark mb-3">Fasilitas Talangan</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Tersedia skema cicilan & dana talangan untuk membantu calon peserta.</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-300 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GlobeAsiaAustraliaIcon className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-dark mb-3">50+ Perusahaan Jepang</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Jaringan kerjasama luas dengan accepting organization di berbagai kota Jepang.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Testimoni Alumni Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-dark text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              Kisah Sukses
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-dark">
              Apa Kata Alumni Kami di Jepang?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Ahmad Ridwan"
              role="Alumni Angkatan 8 — Osaka, Jepang"
              quote="Alhamdulillah berkat LPK Humaira saya bisa bekerja di Jepang. Pelatihannya sangat membantu, dari bahasa sampai budaya kerja Jepang semua diajarkan."
              image="https://ui-avatars.com/api/?name=Ahmad+Ridwan&background=b91c1c&color=fff"
            />
            <TestimonialCard 
              name="Siti Nurhaliza"
              role="Alumni Angkatan 10 — Tokyo, Jepang"
              quote="Awalnya saya ragu, tapi setelah ikut pelatihan di LPK Humaira, saya merasa sangat siap. Sekarang sudah 2 tahun bekerja di Tokyo."
              image="https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=b91c1c&color=fff"
            />
            <TestimonialCard 
              name="Budi Santoso"
              role="Alumni Angkatan 12 — Nagoya, Jepang"
              quote="Proses pendaftaran mudah, pelatihan intensif, dan penyalurannya cepat. Terima kasih LPK Humaira Institute!"
              image="https://ui-avatars.com/api/?name=Budi+Santoso&background=b91c1c&color=fff"
            />
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Section */}
      <section className="py-20 bg-[#111111] text-white relative overflow-hidden border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-block bg-primary-700 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Mulai Hari Ini
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Siap Memulai Karir di Jepang?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Konsultasikan rencana karirmu secara gratis atau langsung isi formulir pendaftaran mahasiswa baru.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/pendaftaran" 
              className="bg-primary-700 hover:bg-primary-800 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-xl hover:shadow-primary-700/40 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              DAFTAR SEKARANG DISINI!
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
