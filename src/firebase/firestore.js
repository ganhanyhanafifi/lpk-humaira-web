import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config.js';

/**
 * Submits registration data to the 'pendaftaran_mahasiswa_baru' Firestore collection.
 * 
 * @param {Object} data - The registration data to be submitted.
 * @returns {Promise<import('firebase/firestore').DocumentReference>} The document reference of the newly added document.
 */
export const submitRegistration = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'pendaftaran_mahasiswa_baru'), {
      ...data,
      status: 'baru',
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
