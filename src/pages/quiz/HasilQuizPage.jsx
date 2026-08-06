import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function HasilQuizPage() {
  const { hasilId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasil, setHasil] = useState(null);
  const [showPembahasan, setShowPembahasan] = useState(false);
  const [soalData, setSoalData] = useState([]); // if we need to fetch soal text for pembahasan

  // Number animation hook substitute directly via framer-motion approach or simple custom effect
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const fetchHasil = async () => {
      try {
        if (!hasilId) return;
        const docRef = doc(db, 'hasil_quiz', hasilId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHasil(data);
          
          // Trigger Confetti based on score
          const score = data.nilai;
          if (score >= 80) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          } else if (score >= 60) {
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
          }

          // Fetch full soal details if we need to show pembahasan (assuming jawabanDetail only has id)
          // Simplified here to just use jawabanDetail if it has text or fetch again if needed.
        } else {
          navigate('/quiz/dashboard-siswa');
        }
      } catch (error) {
        console.error("Error fetching hasil quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHasil();
  }, [hasilId, navigate]);

  // Animate Score Counter
  useEffect(() => {
    if (hasil && displayScore < hasil.nilai) {
      const timer = setTimeout(() => {
        setDisplayScore(prev => Math.min(prev + Math.ceil(hasil.nilai / 20), hasil.nilai));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasil, displayScore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasil) return null;

  const scoreColorClass = 
    hasil.nilai >= 80 ? 'text-green-600 border-green-500' :
    hasil.nilai >= 60 ? 'text-amber-500 border-amber-400' :
    'text-red-500 border-red-400';

  const themeClass =
    hasil.nilai >= 80 ? 'bg-green-50' :
    hasil.nilai >= 60 ? 'bg-amber-50' :
    'bg-blue-50'; // Using soft blue as requested for < 60

  const getMessage = (nilai) => {
    if (nilai >= 80) return "🎉 Luar biasa! Pertahankan terus!";
    if (nilai >= 60) return "👏 Bagus! Sedikit lagi lebih maksimal";
    return "💪 Jangan menyerah! Yuk pelajari lagi materinya, kamu pasti bisa lebih baik di quiz berikutnya";
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          {/* Top Banner */}
          <div className="bg-dark text-white p-6 text-center">
            <h1 className="font-poppins text-2xl font-bold">Hasil Quiz</h1>
            <p className="text-gray-300 mt-1">{hasil.quizJudul}</p>
          </div>

          <div className="p-8 text-center">
            {/* Score Circle */}
            <div className="flex justify-center mb-6">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className={`w-40 h-40 rounded-full flex items-center justify-center border-8 ${scoreColorClass} shadow-inner bg-white`}
              >
                <span className={`text-5xl font-bold font-poppins ${scoreColorClass.split(' ')[0]}`}>
                  {displayScore}
                </span>
              </motion.div>
            </div>

            {/* Message */}
            <div className={`inline-block px-6 py-3 rounded-full mb-8 ${themeClass}`}>
              <p className="font-medium text-gray-800 font-inter">
                {getMessage(hasil.nilai)}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="block text-sm text-gray-500 mb-1">Jumlah Benar</span>
                <span className="block text-lg font-bold text-gray-900">{hasil.jumlahBenar} / {hasil.totalSoal}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="block text-sm text-gray-500 mb-1">Soal Dijawab</span>
                <span className="block text-lg font-bold text-gray-900">{hasil.jumlahDijawab} / {hasil.totalSoal}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="block text-sm text-gray-500 mb-1">Waktu</span>
                <span className="block text-lg font-bold text-gray-900">{formatDuration(hasil.durasiPengerjaanDetik)}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="block text-sm text-gray-500 mb-1">Status</span>
                <span className="block text-sm font-bold text-gray-900 capitalize leading-tight">
                  {hasil.status === 'auto_submit_waktu_habis' ? 'Waktu Habis' : 'Selesai'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/quiz/dashboard-siswa')}
                className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
              >
                Kembali ke Dashboard
              </button>
              
              {hasil.jawabanDetail && hasil.jawabanDetail.length > 0 && (
                <button 
                  onClick={() => setShowPembahasan(!showPembahasan)}
                  className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {showPembahasan ? 'Tutup Pembahasan' : 'Lihat Pembahasan'}
                </button>
              )}
            </div>
          </div>
          
          {/* Pembahasan Section (Optional) */}
          {showPembahasan && hasil.jawabanDetail && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="border-t border-gray-200 bg-gray-50 p-6 md:p-8"
            >
              <h3 className="font-poppins text-lg font-bold text-gray-900 mb-6">Detail Jawaban</h3>
              <div className="space-y-4">
                {hasil.jawabanDetail.map((item, idx) => (
                  <div key={item.soalId || idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                      ${item.benarSalah ? 'bg-green-500' : 'bg-red-500'}
                    `}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Jawaban kamu: <span className="text-gray-900 font-bold">{item.jawabanDipilih || 'Tidak dijawab'}</span>
                      </p>
                      <p className={`text-sm font-semibold ${item.benarSalah ? 'text-green-600' : 'text-red-600'}`}>
                        {item.benarSalah ? 'Benar' : 'Salah'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
}
