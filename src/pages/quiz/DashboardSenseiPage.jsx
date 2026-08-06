import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllSiswa, 
  getAllQuiz, 
  getQuizSoal, 
  getAllHasilQuiz, 
  submitSoalRecord 
} from '../../firebase/quizService';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardSenseiPage = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('siswa');

  // =====================
  // STATE: Tab A - Siswa
  // =====================
  const [siswaList, setSiswaList] = useState([]);
  const [isSiswaLoading, setIsSiswaLoading] = useState(false);
  const [siswaSearch, setSiswaSearch] = useState('');
  const [siswaKelasFilter, setSiswaKelasFilter] = useState('Semua');

  // =====================
  // STATE: Tab B - Quiz
  // =====================
  const [quizList, setQuizList] = useState([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizSoalList, setQuizSoalList] = useState([]);
  const [isSoalLoading, setIsSoalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =====================
  // STATE: Tab C - Hasil
  // =====================
  const [hasilList, setHasilList] = useState([]);
  const [isHasilLoading, setIsHasilLoading] = useState(false);
  const [hasilKelasFilter, setHasilKelasFilter] = useState('Semua');
  const [hasilQuizFilter, setHasilQuizFilter] = useState('Semua');

  // =====================
  // STATE: Tab D - Submit
  // =====================
  const [submitForm, setSubmitForm] = useState({ judul: '', kelasTarget: 'Kelas 1', file: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  // =====================
  // DATA FETCHING
  // =====================
  useEffect(() => {
    if (activeTab === 'siswa' && siswaList.length === 0) {
      fetchSiswa();
    } else if (activeTab === 'quiz' && quizList.length === 0) {
      fetchQuiz();
    } else if (activeTab === 'hasil' && hasilList.length === 0) {
      fetchHasil();
    }
  }, [activeTab]);

  const fetchSiswa = async () => {
    setIsSiswaLoading(true);
    try {
      const data = await getAllSiswa();
      setSiswaList(data || []);
    } catch (error) {
      console.error('Error fetching siswa:', error);
    } finally {
      setIsSiswaLoading(false);
    }
  };

  const fetchQuiz = async () => {
    setIsQuizLoading(true);
    try {
      const data = await getAllQuiz();
      setQuizList(data || []);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleLihatDetail = async (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
    setIsSoalLoading(true);
    setQuizSoalList([]);
    try {
      const data = await getQuizSoal(quiz.id);
      // Sort soal by urutan
      const sorted = (data || []).sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
      setQuizSoalList(sorted);
    } catch (error) {
      console.error('Error fetching soal:', error);
    } finally {
      setIsSoalLoading(false);
    }
  };

  const fetchHasil = async () => {
    setIsHasilLoading(true);
    try {
      const data = await getAllHasilQuiz();
      setHasilList(data || []);
    } catch (error) {
      console.error('Error fetching hasil:', error);
    } finally {
      setIsHasilLoading(false);
    }
  };

  // =====================
  // FILTERING logic
  // =====================
  const filteredSiswaList = siswaList.filter(s => {
    const matchName = s.nama?.toLowerCase().includes(siswaSearch.toLowerCase()) || false;
    const matchKelas = siswaKelasFilter === 'Semua' || s.kelas === siswaKelasFilter;
    return matchName && matchKelas;
  });

  const uniqueHasilQuizTitles = [...new Set(hasilList.map(h => h.judulQuiz))];
  
  const filteredHasilList = hasilList.filter(h => {
    const matchKelas = hasilKelasFilter === 'Semua' || h.kelasSiswa === hasilKelasFilter;
    const matchQuiz = hasilQuizFilter === 'Semua' || h.judulQuiz === hasilQuizFilter;
    return matchKelas && matchQuiz;
  });

  // =====================
  // TAB C EXPORT CSV
  // =====================
  const handleExportCSV = () => {
    const dataToExport = filteredHasilList.map(h => ({
      Nama: h.namaSiswa || '-',
      Kelas: h.kelasSiswa || '-',
      'Judul Quiz': h.judulQuiz || '-',
      Nilai: h.nilai || 0,
      'Jumlah Benar': h.jawabanBenar || 0,
      'Jumlah Soal': h.totalSoal || 0,
      'Waktu Pengerjaan (detik)': h.waktuPengerjaanDetik || 0,
      'Tanggal Pengerjaan': h.timestamp ? h.timestamp.toDate().toLocaleString('id-ID') : '-',
      Status: h.status || '-'
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `hasil-quiz-${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // =====================
  // TAB D SUBMIT Logic
  // =====================
  const handleSubmitSoal = async (e) => {
    e.preventDefault();
    if (!submitForm.file || !submitForm.judul) {
      setSubmitMessage({ text: 'Mohon lengkapi judul dan file soal.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ text: '', type: '' });

    try {
      // 1. Upload file to Cloudinary
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'bvpemcqm';
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'preset_hai';

      const formData = new FormData();
      formData.append('file', submitForm.file);
      formData.append('upload_preset', uploadPreset);
      formData.append('resource_type', 'auto');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudRes.ok) {
        throw new Error('Gagal mengunggah file ke cloud storage.');
      }

      const cloudData = await cloudRes.json();
      const fileUrl = cloudData.secure_url || cloudData.url;
      
      // 2. Save record to firestore
      await submitSoalRecord({
        judul: submitForm.judul,
        kelasTarget: submitForm.kelasTarget,
        namaSensei: userProfile?.nama || 'Sensei',
        senseiId: currentUser.uid,
        driveFileUrl: fileUrl,
        namaFile: submitForm.file.name,
        status: 'menunggu_review'
      });

      setSubmitMessage({ 
        text: 'File soal berhasil dikirim! Admin akan memproses soal ini untuk dimasukkan ke sistem quiz.', 
        type: 'success' 
      });
      
      // Reset form
      setSubmitForm({ judul: '', kelasTarget: 'Kelas 1', file: null });
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setSubmitMessage({ 
        text: 'Terjadi kesalahan saat mengunggah soal. Silakan coba lagi.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check extension .pdf, .docx
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
        setSubmitMessage({ text: 'Format file tidak didukung. Harap unggah .pdf atau .docx', type: 'error' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSubmitForm({ ...submitForm, file });
    }
  };

  // =====================
  // RENDER HELPERS
  // =====================
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    }
    return new Date(timestamp).toLocaleDateString('id-ID');
  };

  const getNilaiColor = (nilai) => {
    if (nilai >= 80) return 'text-green-600 font-bold';
    if (nilai >= 60) return 'text-amber-500 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-inter">
      {/* HEADER */}
      <header className="bg-red-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-poppins font-bold">Dashboard Sensei</h1>
            <p className="text-red-100 text-sm">Selamat datang, {userProfile?.nama || 'Sensei'}</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 rounded-md transition-colors text-sm font-semibold"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2">
          {[
            { id: 'siswa', label: 'Daftar Siswa' },
            { id: 'quiz', label: 'Daftar Quiz' },
            { id: 'hasil', label: 'Hasil Nilai Siswa' },
            { id: 'submit', label: 'Submit Soal Baru' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 outline-none
                ${activeTab === tab.id 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-red-600 hover:border-red-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB A: DAFTAR SISWA */}
        {activeTab === 'siswa' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <h2 className="text-xl font-poppins font-semibold text-gray-800">Daftar Siswa ({filteredSiswaList.length})</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Cari nama siswa..." 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    value={siswaSearch}
                    onChange={(e) => setSiswaSearch(e.target.value)}
                  />
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                    value={siswaKelasFilter}
                    onChange={(e) => setSiswaKelasFilter(e.target.value)}
                  >
                    <option value="Semua">Semua Kelas</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                  </select>
                </div>
              </div>

              {isSiswaLoading ? (
                <div className="text-center py-10"><div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                        <th className="p-3 font-semibold">Nama</th>
                        <th className="p-3 font-semibold">Kelas</th>
                        <th className="p-3 font-semibold">No. Telepon</th>
                        <th className="p-3 font-semibold">Username</th>
                        <th className="p-3 font-semibold">Tgl Daftar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSiswaList.length > 0 ? (
                        filteredSiswaList.map((s, idx) => (
                          <tr key={s.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium text-gray-800">{s.nama || '-'}</td>
                            <td className="p-3">
                              <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium">{s.kelas || '-'}</span>
                            </td>
                            <td className="p-3 text-gray-600">{s.noTelp || '-'}</td>
                            <td className="p-3 text-gray-600">{s.username || '-'}</td>
                            <td className="p-3 text-gray-600 text-sm">{formatDate(s.createdAt)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-6 text-center text-gray-500">Tidak ada data siswa ditemukan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB B: DAFTAR QUIZ */}
        {activeTab === 'quiz' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-6">Daftar Quiz ({quizList.length})</h2>
              
              {isQuizLoading ? (
                <div className="text-center py-10"><div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quizList.length > 0 ? (
                    quizList.map((q) => (
                      <div key={q.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800 line-clamp-2">{q.judul}</h3>
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium whitespace-nowrap ml-2">
                            {q.kelasTarget}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p>Total Soal: <span className="font-medium">{q.jumlahSoal || 0}</span></p>
                          <p>Durasi: <span className="font-medium">{q.durasiMenit || 0} menit</span></p>
                          <p>Dibuat: {formatDate(q.createdAt)}</p>
                        </div>
                        <button 
                          onClick={() => handleLihatDetail(q)}
                          className="w-full bg-neutral-100 hover:bg-neutral-200 text-gray-700 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Lihat Detail Soal
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-500">
                      Tidak ada quiz yang tersedia.
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB C: HASIL NILAI SISWA */}
        {activeTab === 'hasil' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <h2 className="text-xl font-poppins font-semibold text-gray-800">Hasil Nilai Siswa</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                    value={hasilKelasFilter}
                    onChange={(e) => setHasilKelasFilter(e.target.value)}
                  >
                    <option value="Semua">Semua Kelas</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                  </select>
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white max-w-[200px]"
                    value={hasilQuizFilter}
                    onChange={(e) => setHasilQuizFilter(e.target.value)}
                  >
                    <option value="Semua">Semua Quiz</option>
                    {uniqueHasilQuizTitles.map((title, idx) => (
                      <option key={idx} value={title}>{title}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleExportCSV}
                    disabled={filteredHasilList.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Export ke CSV
                  </button>
                </div>
              </div>

              {isHasilLoading ? (
                <div className="text-center py-10"><div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                        <th className="p-3 font-semibold">Nama Siswa</th>
                        <th className="p-3 font-semibold">Kelas</th>
                        <th className="p-3 font-semibold">Judul Quiz</th>
                        <th className="p-3 font-semibold">Nilai</th>
                        <th className="p-3 font-semibold">Benar/Total</th>
                        <th className="p-3 font-semibold">Waktu (detik)</th>
                        <th className="p-3 font-semibold">Tanggal</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHasilList.length > 0 ? (
                        filteredHasilList.map((h, idx) => (
                          <tr key={h.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium text-gray-800">{h.namaSiswa || '-'}</td>
                            <td className="p-3 text-gray-600 text-sm">{h.kelasSiswa || '-'}</td>
                            <td className="p-3 text-gray-700">{h.judulQuiz || '-'}</td>
                            <td className={`p-3 text-lg ${getNilaiColor(h.nilai)}`}>{h.nilai || 0}</td>
                            <td className="p-3 text-gray-600">{h.jawabanBenar || 0} / {h.totalSoal || 0}</td>
                            <td className="p-3 text-gray-600">{h.waktuPengerjaanDetik || 0}s</td>
                            <td className="p-3 text-gray-600 text-sm">{formatDate(h.timestamp)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                h.status === 'lulus' ? 'bg-green-100 text-green-700' : 
                                h.status === 'tidak_lulus' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {h.status === 'lulus' ? 'Lulus' : h.status === 'tidak_lulus' ? 'Tidak Lulus' : (h.status || '-')}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="p-6 text-center text-gray-500">Tidak ada data hasil quiz.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB D: SUBMIT SOAL BARU */}
        {activeTab === 'submit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-6">Submit Soal Baru</h2>
              
              {submitMessage.text && (
                <div className={`p-4 rounded-md mb-6 text-sm ${
                  submitMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmitSoal} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Quiz / Materi Soal</label>
                  <input 
                    type="text" 
                    required
                    value={submitForm.judul}
                    onChange={(e) => setSubmitForm({...submitForm, judul: e.target.value})}
                    placeholder="Contoh: Tata Bahasa Dasar Bab 1"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas Target</label>
                  <select 
                    value={submitForm.kelasTarget}
                    onChange={(e) => setSubmitForm({...submitForm, kelasTarget: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Semua Kelas">Semua Kelas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Soal (.pdf, .docx)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-red-400 transition-colors bg-gray-50">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500 px-1">
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                      {submitForm.file && (
                        <p className="text-sm font-medium text-green-600 mt-2">
                          Terpilih: {submitForm.file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Mengirim...
                      </>
                    ) : 'Submit Soal'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </main>

      {/* MODAL DETAIL SOAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-poppins font-bold text-gray-800">
                  Detail Soal: {selectedQuiz?.judul}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
                {isSoalLoading ? (
                  <div className="text-center py-10"><div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div><p className="mt-4 text-gray-500">Memuat soal...</p></div>
                ) : quizSoalList.length > 0 ? (
                  <div className="space-y-6">
                    {quizSoalList.map((soal, index) => (
                      <div key={soal.id || index} className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                        <div className="flex gap-4">
                          <div className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {soal.urutan || index + 1}
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800 mb-4 whitespace-pre-wrap">{soal.teks_soal}</p>
                            <div className="space-y-2">
                              {['a', 'b', 'c', 'd'].map(opt => {
                                const optionText = soal[`pilihan_${opt}`];
                                if (!optionText) return null;
                                
                                const isCorrect = soal.jawaban_benar?.toLowerCase() === opt;
                                
                                return (
                                  <div 
                                    key={opt}
                                    className={`p-3 rounded-md border ${
                                      isCorrect 
                                        ? 'bg-green-50 border-green-300 text-green-800 font-medium' 
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                    } flex gap-3`}
                                  >
                                    <span className="uppercase font-bold w-6">{opt}.</span>
                                    <span>{optionText}</span>
                                    {isCorrect && (
                                      <span className="ml-auto flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded border border-gray-200">
                    <p className="text-gray-500">Belum ada soal untuk quiz ini.</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardSenseiPage;
