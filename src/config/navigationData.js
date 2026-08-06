export const navigationItems = [
  {
    label: 'Profile',
    href: '/profile',
    children: [
      { 
        label: 'Company Profile', 
        href: '/profile/company',
        children: [
          { label: 'Izin S.O', href: '/profile/company/izin-so' },
          { label: 'Our Team', href: '/profile/company/our-team' },
          { label: 'Lokasi Pendidikan & Pelatihan', href: '/profile/company/lokasi' },
          { label: 'Alamat Kantor Pusat', href: '/profile/company/alamat' },
        ]
      },
    ],
  },
  {
    label: 'Informasi',
    href: '/informasi',
    children: [
      { label: 'Bidang Kerja', href: '/informasi/bidang-kerja' },
      { 
        label: 'Biaya', href: '/informasi/biaya',
        children: [
          { label: 'Rincian Biaya Program', href: '/informasi/biaya/rincian' },
          { label: 'Metode Pembayaran', href: '/informasi/biaya/metode' },
        ]
      },
      { 
        label: 'Khusus Alumni', href: '/informasi/alumni',
        children: [
          { label: 'Program Alumni', href: '/informasi/alumni/program' },
          { label: 'Testimoni Alumni', href: '/informasi/alumni/testimoni' },
        ]
      },
      { 
        label: 'Fasilitas', href: '/informasi/fasilitas',
        children: [
          { label: 'Fasilitas Pelatihan', href: '/informasi/fasilitas/pelatihan' },
          { label: 'Fasilitas Asrama', href: '/informasi/fasilitas/asrama' },
        ]
      },
      { 
        label: 'Dokumen & Sertifikat', href: '/informasi/dokumen',
        children: [
          { label: 'Persyaratan Dokumen', href: '/informasi/dokumen/persyaratan' },
          { label: 'Sertifikat yang Diperoleh', href: '/informasi/dokumen/sertifikat' },
        ]
      },
      { 
        label: 'Perbedaan Antara', href: '/informasi/perbedaan',
        children: [
          { label: 'Magang vs Tokutei Ginou', href: '/informasi/perbedaan/magang-vs-tokugi' },
        ]
      },
      { label: 'Biaya Hidup di Jepang', href: '/informasi/biaya-hidup-jepang' },
      { label: 'Nihongo Gakkou', href: '/informasi/nihongo-gakkou' },
      { label: 'Parttime Job', href: '/informasi/parttime-job' },
      { label: 'Lowongan Kerja', href: '/informasi/lowongan-kerja' },
      { label: 'Tokutei Ginou', href: '/informasi/tokutei-ginou' },
      { label: 'Kerja di Jepang', href: '/informasi/kerja-di-jepang' },
      { label: 'Syarat Beasiswa Kerja di Jepang', href: '/informasi/syarat-beasiswa' },
      { label: 'Prosedur Ujian Kemampuan Bahasa Jepang', href: '/informasi/prosedur-ujian' },
    ],
  },
  {
    label: 'Program',
    href: '/program',
    children: [
      { label: 'Intensif', href: '/program/jepang/intensif' },
      { label: 'Full Dana Talangan', href: '/program/jepang/full-dana-talangan' },
      { label: 'Persiapan Ujian', href: '/program/jepang/persiapan-ujian' },
      { label: 'Kelas Kaiwa', href: '/program/jepang/kelas-kaiwa' },
      { label: 'Driver (Logistik)', href: '/program/jepang/driver-logistik' },
      { label: 'Matching Job', href: '/program/jepang/matching-job' },
      { label: 'Nihongo Gakkou', href: '/program/jepang/nihongo-gakkou' },
      { label: 'Free Trial Online Class', href: '/program/jepang/free-trial' },
    ],
  },
  {
    label: 'Ujian',
    href: '/ujian',
    children: [
      { label: 'JLPT', href: '/ujian/jlpt' },
      { label: 'JFT', href: '/ujian/jft' },
      { label: 'NatTest', href: '/ujian/nattest' },
      { label: 'JTest', href: '/ujian/jtest' },
      { label: 'SSW', href: '/ujian/ssw' },
      { label: 'Quiz Online', href: '/quiz', badge: 'NEW', accentColor: true },
    ],
  },
  {
    label: 'Karir & Kerja Sama',
    href: '/karir',
    children: [
      { label: 'Team Recruitment', href: '/karir/recruitment' },
      { label: 'Daftar Mitra', href: '/karir/mitra' },
      {
        label: 'Kerjasama Program',
        href: '/karir/kerjasama',
        children: [
          { label: 'Kerjasama dengan Sekolah', href: '/karir/kerjasama/sekolah' },
          { label: 'Kerjasama dengan Perusahaan', href: '/karir/kerjasama/perusahaan' },
        ]
      },
    ],
  },
  {
    label: 'Kelas Intensif',
    href: '/kelas-intensif',
    children: null, // direct link, no dropdown
  },
];
