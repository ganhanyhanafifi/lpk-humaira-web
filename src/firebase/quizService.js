import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// ==========================================
// Siswa Functions
// ==========================================

/**
 * Memeriksa apakah username tersedia di koleksi siswa
 * @param {string} username - Username yang akan diperiksa
 * @returns {Promise<boolean>} True jika tersedia (belum ada), False jika sudah digunakan
 */
export const checkUsernameAvailable = async (username) => {
  try {
    const q = query(collection(db, 'siswa'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error in checkUsernameAvailable:', error);
    throw new Error('Gagal memeriksa ketersediaan username');
  }
};

/**
 * Mengambil data profil siswa berdasarkan UID
 * @param {string} uid - UID dari siswa
 * @returns {Promise<Object|null>} Data profil siswa atau null jika tidak ditemukan
 */
export const getSiswaProfile = async (uid) => {
  try {
    const docRef = doc(db, 'siswa', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error in getSiswaProfile:', error);
    throw new Error('Gagal mengambil profil siswa');
  }
};

/**
 * Mengambil semua data siswa dari koleksi
 * @returns {Promise<Array>} Array berisi data semua siswa
 */
export const getAllSiswa = async () => {
  try {
    const q = query(collection(db, 'siswa'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const siswaList = [];
    querySnapshot.forEach((doc) => {
      siswaList.push({ id: doc.id, ...doc.data() });
    });
    return siswaList;
  } catch (error) {
    console.error('Error in getAllSiswa:', error);
    throw new Error('Gagal mengambil data semua siswa');
  }
};

// ==========================================
// Sensei Functions
// ==========================================

/**
 * Mengambil data profil sensei berdasarkan UID
 * @param {string} uid - UID dari sensei
 * @returns {Promise<Object|null>} Data profil sensei atau null jika tidak ditemukan
 */
export const getSenseiProfile = async (uid) => {
  try {
    const docRef = doc(db, 'sensei', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error in getSenseiProfile:', error);
    throw new Error('Gagal mengambil profil sensei');
  }
};

// ==========================================
// Quiz Functions
// ==========================================

/**
 * Mengambil semua data kuis dari koleksi
 * @returns {Promise<Array>} Array berisi data semua kuis
 */
export const getAllQuiz = async () => {
  try {
    const q = query(collection(db, 'quiz'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const quizList = [];
    querySnapshot.forEach((doc) => {
      quizList.push({ id: doc.id, ...doc.data() });
    });
    return quizList;
  } catch (error) {
    console.error('Error in getAllQuiz:', error);
    throw new Error('Gagal mengambil semua data kuis');
  }
};

/**
 * Mengambil data satu kuis berdasarkan ID
 * @param {string} quizId - ID kuis
 * @returns {Promise<Object|null>} Data kuis beserta id atau null jika tidak ditemukan
 */
export const getQuizById = async (quizId) => {
  try {
    const docRef = doc(db, 'quiz', quizId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error in getQuizById:', error);
    throw new Error('Gagal mengambil data kuis');
  }
};

/**
 * Mengambil kuis berdasarkan target kelas
 * @param {string} kelas - Kelas target (misal: 'Kelas 1')
 * @returns {Promise<Array>} Array kuis aktif untuk kelas tersebut atau 'Semua Kelas'
 */
export const getQuizzesByKelas = async (kelas = 'Semua Kelas') => {
  const defaultN4Quiz = {
    id: 'jlpt-n4-quiz-1',
    judul: 'Ujian Bahasa Jepang (JLPT N4)',
    deskripsi: '20 Soal Pilihan Ganda JLPT N4 (Kosakata, Tata Bahasa & Dokkai)',
    durasiMenit: 20,
    kelasTarget: 'Semua Kelas',
    status: 'aktif',
    jumlahSoal: 20,
    createdAt: new Date(),
  };

  try {
    const formattedKelas = String(kelas).startsWith('Kelas') ? String(kelas) : `Kelas ${kelas}`;
    const q = query(
      collection(db, 'quiz'),
      where('status', '==', 'aktif')
    );
    const querySnapshot = await getDocs(q);
    const quizList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.kelasTarget || data.kelasTarget === 'Semua Kelas' || data.kelasTarget === formattedKelas || data.kelasTarget === String(kelas)) {
        quizList.push({ id: doc.id, ...data });
      }
    });
    
    if (quizList.length === 0) {
      return [defaultN4Quiz];
    }

    return quizList.sort((a, b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0));
  } catch (error) {
    console.error('Error in getQuizzesByKelas, using default fallback:', error);
    return [defaultN4Quiz];
  }
};

/**
 * Mengambil semua soal untuk kuis tertentu dari subkoleksi soal
 * @param {string} quizId - ID kuis
 * @returns {Promise<Array>} Array soal dari kuis tersebut diurutkan berdasar urutan
 */
export const getQuizSoal = async (quizId) => {
  try {
    const q = query(
      collection(db, 'quiz', quizId, 'soal'),
      orderBy('urutan', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const soalList = [];
    querySnapshot.forEach((doc) => {
      soalList.push({ id: doc.id, ...doc.data() });
    });
    return soalList;
  } catch (error) {
    console.error('Error in getQuizSoal:', error);
    throw new Error('Gagal mengambil soal kuis');
  }
};

// ==========================================
// Hasil Quiz Functions
// ==========================================

/**
 * Menyimpan hasil pengerjaan kuis siswa
 * @param {Object} hasilData - Objek data hasil kuis
 * @returns {Promise<Object>} Referensi dokumen dari hasil yang baru ditambahkan
 */
export const submitHasilQuiz = async (hasilData) => {
  try {
    const docRef = await addDoc(collection(db, 'hasil_quiz'), {
      ...hasilData,
      createdAt: serverTimestamp(),
    });
    const resultId = docRef.id;
    // Simpan ke localStorage sebagai cache/fallback lokal
    try {
      const localResults = JSON.parse(localStorage.getItem('lpk_hasil_quiz') || '[]');
      localResults.unshift({ id: resultId, ...hasilData, createdAt: new Date().toISOString() });
      localStorage.setItem('lpk_hasil_quiz', JSON.stringify(localResults));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
    return resultId;
  } catch (error) {
    console.error('Error in submitHasilQuiz:', error);
    // Fallback ID jika offline / firestore error
    const fallbackId = `hasil_local_${Date.now()}`;
    const fallbackObj = { id: fallbackId, ...hasilData, createdAt: new Date().toISOString() };
    try {
      const localResults = JSON.parse(localStorage.getItem('lpk_hasil_quiz') || '[]');
      localResults.unshift(fallbackObj);
      localStorage.setItem('lpk_hasil_quiz', JSON.stringify(localResults));
    } catch (e) {
      console.warn('Could not save fallback to localStorage:', e);
    }
    return fallbackId;
  }
};

/**
 * Mengambil riwayat hasil kuis seorang siswa
 * @param {string} siswaId - UID siswa
 * @returns {Promise<Array>} Array riwayat kuis yang telah dikerjakan siswa
 */
export const getHasilBySiswa = async (siswaId) => {
  let firestoreList = [];
  try {
    const q = query(
      collection(db, 'hasil_quiz'),
      where('siswaId', '==', siswaId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      firestoreList.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error('Error fetching Firestore hasil_quiz:', error);
  }

  // Ambil data cache/fallback dari localStorage
  let localList = [];
  try {
    const saved = localStorage.getItem('lpk_hasil_quiz');
    if (saved) {
      const parsed = JSON.parse(saved);
      localList = parsed.filter(item => !siswaId || item.siswaId === siswaId);
    }
  } catch (e) {
    console.warn('Error reading localStorage hasil_quiz:', e);
  }

  // Gabungkan dan hilangkan duplikat berdasarkan ID
  const map = new Map();
  [...firestoreList, ...localList].forEach(item => {
    if (item && item.id) map.set(item.id, item);
  });

  const combined = Array.from(map.values());

  return combined.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB - dateA;
  });
};

/**
 * Memeriksa apakah siswa sudah pernah mengambil kuis tertentu
 * @param {string} siswaId - UID siswa
 * @param {string} quizId - ID kuis
 * @returns {Promise<boolean>} True jika sudah mengambil, False jika belum
 */
export const checkAlreadyTaken = async (siswaId, quizId) => {
  try {
    const q = query(
      collection(db, 'hasil_quiz'),
      where('siswaId', '==', siswaId),
      where('quizId', '==', quizId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error in checkAlreadyTaken:', error);
    throw new Error('Gagal memeriksa status pengerjaan kuis');
  }
};

/**
 * Mengambil semua data hasil kuis untuk laporan/analisis
 * @returns {Promise<Array>} Array berisi semua data hasil kuis
 */
export const getAllHasilQuiz = async () => {
  try {
    const q = query(collection(db, 'hasil_quiz'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const hasilList = [];
    querySnapshot.forEach((doc) => {
      hasilList.push({ id: doc.id, ...doc.data() });
    });
    return hasilList;
  } catch (error) {
    console.error('Error in getAllHasilQuiz:', error);
    throw new Error('Gagal mengambil semua hasil kuis');
  }
};

// ==========================================
// Submisi Soal Functions
// ==========================================

/**
 * Menyimpan rekor submisi soal dari Sensei untuk direview
 * @param {Object} data - Objek data submisi soal
 * @returns {Promise<Object>} Referensi dokumen dari submisi yang baru ditambahkan
 */
export const submitSoalRecord = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'submisi_soal'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error('Error in submitSoalRecord:', error);
    throw new Error('Gagal menyimpan submisi soal');
  }
};
