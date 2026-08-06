import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AcademicCapIcon, UserIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

/**
 * QuizModePage - Selection page for the quiz system mode
 */
const QuizModePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <motion.div 
        className="max-w-4xl w-full text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold font-poppins text-gray-900 mb-4">
          Quiz Online LPK Humaira
        </h1>
        <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
          Silakan pilih mode login yang sesuai untuk mengakses sistem ujian online LPK Humaira.
        </p>
      </motion.div>

      <motion.div 
        className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sensei Card */}
        <motion.div variants={itemVariants}>
          <Link to="/quiz/login-sensei" className="block h-full group">
            <div className="bg-[#111111] rounded-2xl p-8 h-full flex flex-col items-center text-center shadow-lg transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/20 border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              
              <div className="bg-gray-800/50 p-4 rounded-full mb-6 text-[#D4A017] group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold font-poppins text-white mb-3">Login sebagai Sensei</h3>
              <p className="text-gray-400 font-inter text-sm">
                Akses dashboard pengajar untuk membuat quiz, mengelola soal, dan melihat nilai siswa.
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Siswa Card */}
        <motion.div variants={itemVariants}>
          <Link to="/quiz/login-siswa" className="block h-full group">
            <div className="bg-red-700 bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-8 h-full flex flex-col items-center text-center shadow-lg transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-red-900/30 border border-red-600 relative overflow-hidden">
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              <div className="bg-white/10 p-4 rounded-full mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                <UserIcon className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold font-poppins text-white mb-3">Login sebagai Siswa</h3>
              <p className="text-red-100 font-inter text-sm">
                Masuk ke area siswa untuk mengerjakan quiz yang telah ditugaskan dan melihat riwayat nilai.
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Daftar Card */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <Link to="/quiz/daftar" className="block flex-grow group mb-3">
            <div className="bg-white rounded-2xl p-8 h-full flex flex-col items-center text-center shadow-md transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl border border-gray-200">
              <div className="bg-gray-50 p-4 rounded-full mb-6 text-red-700 group-hover:bg-red-50 group-hover:scale-110 transition-all duration-300">
                <UserPlusIcon className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold font-poppins text-gray-900 mb-3">Daftar Akun Baru</h3>
              <p className="text-gray-600 font-inter text-sm">
                Belum memiliki akun siswa? Buat akun baru untuk mulai mengikuti quiz online.
              </p>
            </div>
          </Link>
          <p className="text-xs text-center text-gray-500 font-inter px-2">
            Pendaftaran akun hanya untuk siswa. Akun sensei dibuatkan oleh admin.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizModePage;
