import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  checkAlreadyTaken, 
  getQuizById, 
  getQuizSoal, 
  submitHasilQuiz 
} from '../../firebase/quizService';
import { shikenJLPTN4Questions } from '../../shiken/shikenService';

export default function KerjakanQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [soal, setSoal] = useState([]);
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [waktuMulai, setWaktuMulai] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quiz data and check if already taken
  useEffect(() => {
    const initData = async () => {
      try {
        if (!currentUser?.uid || !quizId) return;

        const alreadyTaken = await checkAlreadyTaken(currentUser.uid, quizId);
        if (alreadyTaken) {
          navigate('/quiz/dashboard-siswa', { state: { message: 'Kamu sudah mengerjakan quiz ini' } });
          return;
        }

        const quizData = await getQuizById(quizId);
        let soalData = await getQuizSoal(quizId);
        
        // Fallback jika Firestore belum di-seed atau kuis baru
        if (!soalData || soalData.length === 0) {
          soalData = shikenJLPTN4Questions;
        }

        const defaultQuiz = quizData || {
          id: quizId,
          judul: 'Ujian Bahasa Jepang (JLPT N4)',
          deskripsi: '20 Soal Pilihan Ganda JLPT N4 (Kosakata, Tata Bahasa & Dokkai)',
          durasiMenit: 60,
          kelasTarget: 'Semua Kelas'
        };

        setQuiz(defaultQuiz);
        setSoal(soalData);
        setTimeLeft((defaultQuiz.durasiMenit || 60) * 60);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        // Fallback to local shikenJLPTN4Questions on network error
        setQuiz({
          id: quizId,
          judul: 'Ujian Bahasa Jepang (JLPT N4)',
          deskripsi: '20 Soal Pilihan Ganda JLPT N4 (Kosakata, Tata Bahasa & Dokkai)',
          durasiMenit: 60,
          kelasTarget: 'Semua Kelas'
        });
        setSoal(shikenJLPTN4Questions);
        setTimeLeft(60 * 60);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [currentUser, quizId, navigate]);

  // Handle BeforeUnload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (quizStarted && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [quizStarted, isSubmitting]);

  // Submit Handler
  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting || !quiz || !soal.length || !currentUser) return;
    setIsSubmitting(true);

    try {
      const totalSoal = soal.length;
      let jumlahDijawab = 0;
      let jumlahBenar = 0;
      const jawabanDetail = [];

      const optionKeys = ['A', 'B', 'C', 'D'];

      soal.forEach((s) => {
        const jawabanDipilih = answers[s.id] || null;
        const correctKey = s.jawaban_benar || optionKeys[s.answerIndex] || 'A';
        const benar = jawabanDipilih === correctKey;
        
        if (jawabanDipilih) jumlahDijawab++;
        if (benar) jumlahBenar++;

        jawabanDetail.push({
          soalId: s.id,
          jawabanDipilih,
          benarSalah: benar
        });
      });

      const nilai = Math.round((jumlahBenar / totalSoal) * 100);
      const waktuSelesai = new Date();
      const durasiPengerjaanDetik = Math.floor((waktuSelesai.getTime() - waktuMulai.getTime()) / 1000);

      const hasilData = {
        siswaId: currentUser.uid,
        siswaNama: userProfile?.nama || userProfile?.namaLengkap || currentUser.displayName || 'Siswa',
        kelas: userProfile?.kelas || '-',
        quizId: quizId,
        quizJudul: quiz.judul,
        jumlahBenar,
        jumlahDijawab,
        totalSoal,
        nilai,
        waktuMulai,
        waktuSelesai,
        durasiPengerjaanDetik,
        status: isAutoSubmit ? 'auto_submit_waktu_habis' : 'selesai_manual',
        jawabanDetail
      };

      const resultId = await submitHasilQuiz(hasilData);

      if (isAutoSubmit) {
        alert('Waktu habis! Quiz otomatis dikumpulkan.');
        setTimeout(() => {
          navigate('/quiz/dashboard-siswa');
        }, 2000);
      } else {
        navigate(`/quiz/hasil/${resultId}`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Terjadi kesalahan saat mengumpulkan quiz. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  }, [isSubmitting, quiz, soal, currentUser, answers, waktuMulai, userProfile, quizId, navigate]);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !isSubmitting) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (quizStarted && timeLeft === 0 && !isSubmitting) {
      handleSubmit(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, timeLeft, isSubmitting, handleSubmit]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setWaktuMulai(new Date());
  };

  const handleAnswerSelect = (opsi) => {
    const currentSoalId = soal[currentIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [currentSoalId]: opsi
    }));
  };

  const handleNext = () => {
    if (currentIndex < soal.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (window.confirm('Apakah kamu yakin ingin menyelesaikan quiz ini?')) {
        handleSubmit(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center"
        >
          <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-2">{quiz?.judul}</h1>
          <p className="text-gray-600 mb-8">{quiz?.deskripsi || 'Persiapkan dirimu sebelum memulai quiz.'}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <span className="block text-sm text-red-600 font-medium">Jumlah Soal</span>
              <span className="block text-xl font-bold text-gray-900">{soal?.length} Soal</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <span className="block text-sm text-amber-600 font-medium">Waktu Pengerjaan</span>
              <span className="block text-xl font-bold text-gray-900">{quiz?.durasiMenit} Menit</span>
            </div>
          </div>

          <div className="bg-yellow-50 text-yellow-800 text-sm p-4 rounded-lg text-left mb-8 border border-yellow-200">
            <strong>Perhatian:</strong> Waktu akan mulai berjalan saat tombol diklik. Jangan menutup tab atau merefresh halaman selama mengerjakan.
          </div>

          <button 
            onClick={handleStartQuiz}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg px-6 py-3 transition-colors duration-200 shadow-md"
          >
            Mulai Sekarang
          </button>
        </motion.div>
      </div>
    );
  }

  const currentSoal = soal[currentIndex];
  const isTimeWarning = timeLeft < 60;
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-poppins font-semibold text-gray-900 truncate pr-4">{quiz?.judul}</h1>
          <div className={`flex items-center gap-2 font-mono text-lg font-bold px-3 py-1 rounded-md transition-colors ${isTimeWarning ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Soal {currentIndex + 1} dari {soal.length}
            </h2>
            {currentSoal?.section && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                {currentSoal.section}
              </span>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-lg md:text-xl text-gray-900 font-japanese leading-relaxed whitespace-pre-line">
              {currentSoal?.teks_soal || currentSoal?.question}
            </p>
          </div>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((opsi, idx) => {
              const isSelected = answers[currentSoal?.id] === opsi;
              const textKey = `opsi_${opsi.toLowerCase()}`;
              // Fallback ke array options jika opsi_a/b/c/d undefined
              const text = currentSoal?.[textKey] || currentSoal?.options?.[idx];
              
              if (!text) return null; // Fallback jika opsi kosong

              return (
                <button
                  key={opsi}
                  onClick={() => handleAnswerSelect(opsi)}
                  className={`w-full flex items-center text-left p-4 rounded-lg border-2 transition-all duration-200 group
                    ${isSelected 
                      ? 'border-red-600 bg-red-50 text-red-900' 
                      : 'border-gray-200 hover:border-red-300 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-4
                    ${isSelected ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 group-hover:bg-red-200'}`}>
                    {opsi}
                  </span>
                  <span className="font-japanese text-base md:text-lg leading-relaxed">{text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
              currentIndex === 0 || isSubmitting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Sebelumnya
          </button>
          
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors ${
              currentIndex === soal.length - 1
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {currentIndex === soal.length - 1 ? (isSubmitting ? 'Mengumpulkan...' : 'Quiz Selesai') : 'Selanjutnya'}
          </button>
        </div>
      </main>

      {/* Progress Indicators */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
          {soal.map((s, idx) => {
            const isAnswered = !!answers[s.id];
            const isCurrent = idx === currentIndex;
            
            return (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors
                  ${isCurrent ? 'ring-2 ring-red-600 ring-offset-1' : ''}
                  ${isAnswered 
                    ? 'bg-red-600 text-white border-transparent' 
                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
