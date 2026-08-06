import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getQuizzesByKelas, getHasilBySiswa } from '../../firebase/quizService';
import { 
  ClipboardDocumentListIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
  PlayIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const DashboardSiswaPage = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('tersedia'); // 'tersedia' | 'histori'
  const [quizzes, setQuizzes] = useState([]);
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !userProfile?.kelas) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch quizzes for student's class and their results
        const [quizzesData, hasilData] = await Promise.all([
          getQuizzesByKelas(userProfile.kelas),
          getHasilBySiswa(currentUser.uid)
        ]);
        
        setQuizzes(quizzesData);
        // Sort hasil descending by date
        const sortedHasil = hasilData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        });
        
        setHasil(sortedHasil);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat data. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Check if a quiz has been taken
  const completedQuizIds = hasil.map(h => h.quizId);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-poppins text-gray-900 leading-tight">
                  Dashboard Siswa
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Selamat datang, <span className="font-semibold text-gray-700">{userProfile?.nama || 'Siswa'}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Welcome Message */}
        <div className="mb-6 sm:hidden">
          <p className="text-gray-600 text-lg">
            Selamat datang, <span className="font-bold text-gray-900">{userProfile?.nama || 'Siswa'}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Kelas: {userProfile?.kelas || '-'}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tersedia')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'tersedia'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <ClipboardDocumentListIcon className="h-5 w-5" />
            Quiz Tersedia
          </button>
          <button
            onClick={() => setActiveTab('histori')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === 'histori'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <DocumentChartBarIcon className="h-5 w-5" />
            Histori Nilai
          </button>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center justify-center gap-2">
              <XCircleIcon className="h-6 w-6" />
              {error}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'tersedia' && (
                <motion.div
                  key="tersedia"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {quizzes.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                      <ClipboardDocumentListIcon className="mx-auto h-16 w-16 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 font-poppins">Tidak ada quiz</h3>
                      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                        Saat ini tidak ada quiz yang tersedia untuk kelas Anda. Silakan periksa lagi nanti.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quizzes.map((quiz) => {
                        const isCompleted = completedQuizIds.includes(quiz.id);
                        
                        return (
                          <div 
                            key={quiz.id} 
                            className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
                              isCompleted ? 'border-gray-200 opacity-75' : 'border-gray-100 hover:shadow-md hover:border-red-100 hover:-translate-y-1'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-bold font-poppins text-gray-900 line-clamp-2 leading-tight">
                                {quiz.judul}
                              </h3>
                              {isCompleted && (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 whitespace-nowrap ml-3">
                                  Selesai
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-2 mb-6">
                              <div className="flex items-center text-sm text-gray-600">
                                <ClipboardDocumentListIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {quiz.jumlahSoal || 0} Soal
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                {quiz.durasiMenit || 0} Menit
                              </div>
                            </div>
                            
                            {isCompleted ? (
                              <button 
                                disabled
                                className="w-full flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-500 bg-gray-50 rounded-lg text-sm font-medium cursor-not-allowed"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                                Sudah Dikerjakan
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate(`/quiz/kerjakan/${quiz.id}`)}
                                className="w-full flex justify-center items-center gap-2 px-4 py-2.5 border border-transparent text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-red-600/20"
                              >
                                <PlayIcon className="h-5 w-5" />
                                Mulai Quiz
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'histori' && (
                <motion.div
                  key="histori"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {hasil.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                      <DocumentChartBarIcon className="mx-auto h-16 w-16 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 font-poppins">Belum ada histori</h3>
                      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                        Anda belum mengerjakan quiz apapun. Nilai akan muncul di sini setelah Anda menyelesaikan quiz.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hasil.map((item) => {
                        const scoreClass = getScoreColor(item.nilai);
                        
                        return (
                          <div 
                            key={item.id} 
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex-1">
                              <h4 className="text-base font-semibold font-poppins text-gray-900">
                                {item.quizJudul || 'Quiz'}
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {formatDate(item.createdAt)}
                                </span>
                                <span className="flex items-center">
                                  <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                                  Benar {item.jumlahBenar || 0} dari {item.totalSoal || 0}
                                </span>
                                {item.status && (
                                  <span className="flex items-center capitalize">
                                    Status: {item.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                              <span className="text-sm font-medium text-gray-500">Nilai Akhir:</span>
                              <div className={`flex items-center justify-center w-16 h-16 rounded-xl border ${scoreClass}`}>
                                <span className="text-xl font-bold">{item.nilai}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardSiswaPage;
