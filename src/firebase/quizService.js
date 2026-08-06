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
export const getQuizzesByKelas = async (kelas) => {
  try {
    const q = query(
      collection(db, 'quiz'),
      where('status', '==', 'aktif'),
      where('kelasTarget', 'in', [kelas, 'Semua Kelas'])
    );
    const querySnapshot = await getDocs(q);
    const quizList = [];
    querySnapshot.forEach((doc) => {
      quizList.push({ id: doc.id, ...doc.data() });
    });
    // orderBy pada firestore memerlukan indeks komposit bila dikombinasikan dengan 'in'
    // oleh karena itu, pengurutan dapat dilakukan di sisi klien
    return quizList.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
  } catch (error) {
    console.error('Error in getQuizzesByKelas:', error);
    throw new Error('Gagal mengambil data kuis berdasarkan kelas');
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
    return docRef;
  } catch (error) {
    console.error('Error in submitHasilQuiz:', error);
    throw new Error('Gagal menyimpan hasil kuis');
  }
};

/**
 * Mengambil riwayat hasil kuis seorang siswa
 * @param {string} siswaId - UID siswa
 * @returns {Promise<Array>} Array riwayat kuis yang telah dikerjakan siswa
 */
export const getHasilBySiswa = async (siswaId) => {
  try {
    const q = query(
      collection(db, 'hasil_quiz'),
      where('siswaId', '==', siswaId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const hasilList = [];
    querySnapshot.forEach((doc) => {
      hasilList.push({ id: doc.id, ...doc.data() });
    });
    return hasilList;
  } catch (error) {
    console.error('Error in getHasilBySiswa:', error);
    throw new Error('Gagal mengambil riwayat hasil kuis siswa');
  }
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
