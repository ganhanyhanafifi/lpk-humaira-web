#!/usr/bin/env node

/**
 * Import Quiz dari JSON ke Firestore
 * 
 * Script ini membaca file JSON berisi soal quiz dan menguploadnya
 * ke Firestore collection `quiz` beserta subcollection `soal`.
 * 
 * Usage:
 *   node scripts/importQuiz.js data/quiz-baru.json
 * 
 * Format JSON yang diharapkan:
 * {
 *   "judul": "Quiz Bahasa Jepang N5 - Hiragana",
 *   "kelasTarget": "Kelas 1",     // "Kelas 1" | "Kelas 2" | "Kelas 3" | "Semua Kelas"
 *   "durasiMenit": 30,
 *   "soal": [
 *     {
 *       "urutan": 1,
 *       "teks_soal": "Apa bacaan huruf あ?",
 *       "pilihan": { "A": "a", "B": "i", "C": "u", "D": "e" },
 *       "jawaban_benar": "A"
 *     }
 *   ]
 * }
 * 
 * Sebelum menjalankan script ini, pastikan:
 * 1. Sudah install firebase-admin: npm install firebase-admin
 * 2. Sudah memiliki file Service Account Key (JSON) dari Firebase Console
 * 3. Set environment variable GOOGLE_APPLICATION_CREDENTIALS ke path file key
 *    ATAU letakkan file key di scripts/serviceAccountKey.json
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
let serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
}

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  // Fallback: try default credentials (works in Google Cloud environment)
  console.warn('⚠️  Service Account Key tidak ditemukan.');
  console.warn('   Letakkan file key di scripts/serviceAccountKey.json');
  console.warn('   atau set GOOGLE_APPLICATION_CREDENTIALS environment variable.');
  console.warn('');
  console.warn('   Cara mendapatkan file key:');
  console.warn('   1. Buka Firebase Console → Project Settings → Service Accounts');
  console.warn('   2. Klik "Generate new private key"');
  console.warn('   3. Simpan file JSON yang terdownload ke scripts/serviceAccountKey.json');
  process.exit(1);
}

const db = admin.firestore();

async function importQuiz(jsonFilePath) {
  // Validate file exists
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`❌ File tidak ditemukan: ${jsonFilePath}`);
    process.exit(1);
  }

  // Read and parse JSON
  let quizData;
  try {
    const rawContent = fs.readFileSync(jsonFilePath, 'utf-8');
    quizData = JSON.parse(rawContent);
  } catch (err) {
    console.error(`❌ Gagal membaca/parse JSON: ${err.message}`);
    process.exit(1);
  }

  // Validate required fields
  const requiredFields = ['judul', 'kelasTarget', 'durasiMenit', 'soal'];
  for (const field of requiredFields) {
    if (!quizData[field]) {
      console.error(`❌ Field "${field}" wajib ada di file JSON`);
      process.exit(1);
    }
  }

  if (!Array.isArray(quizData.soal) || quizData.soal.length === 0) {
    console.error('❌ Field "soal" harus berupa array dan tidak boleh kosong');
    process.exit(1);
  }

  // Validate each soal
  for (let i = 0; i < quizData.soal.length; i++) {
    const soal = quizData.soal[i];
    if (!soal.teks_soal || !soal.pilihan || !soal.jawaban_benar) {
      console.error(`❌ Soal nomor ${i + 1} tidak lengkap (butuh: teks_soal, pilihan, jawaban_benar)`);
      process.exit(1);
    }
    if (!['A', 'B', 'C', 'D'].includes(soal.jawaban_benar)) {
      console.error(`❌ Soal nomor ${i + 1}: jawaban_benar harus A, B, C, atau D`);
      process.exit(1);
    }
  }

  console.log('');
  console.log('📋 Informasi Quiz:');
  console.log(`   Judul       : ${quizData.judul}`);
  console.log(`   Kelas Target: ${quizData.kelasTarget}`);
  console.log(`   Durasi      : ${quizData.durasiMenit} menit`);
  console.log(`   Jumlah Soal : ${quizData.soal.length}`);
  console.log('');

  try {
    // Create quiz document
    const quizRef = await db.collection('quiz').add({
      judul: quizData.judul,
      kelasTarget: quizData.kelasTarget,
      durasiMenit: quizData.durasiMenit,
      jumlahSoal: quizData.soal.length,
      status: 'aktif',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Quiz dibuat dengan ID: ${quizRef.id}`);

    // Create soal subcollection documents
    const batch = db.batch();
    
    for (let i = 0; i < quizData.soal.length; i++) {
      const soal = quizData.soal[i];
      const soalRef = quizRef.collection('soal').doc();
      
      batch.set(soalRef, {
        urutan: soal.urutan || (i + 1),
        teks_soal: soal.teks_soal,
        pilihan: soal.pilihan,
        jawaban_benar: soal.jawaban_benar,
      });
    }

    await batch.commit();
    console.log(`✅ ${quizData.soal.length} soal berhasil diimport!`);
    console.log('');
    console.log('🎉 Import selesai! Quiz sudah muncul di dashboard siswa.');
    console.log('');

  } catch (error) {
    console.error(`❌ Gagal import ke Firestore: ${error.message}`);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('');
  console.log('📖 Cara pakai:');
  console.log('   node scripts/importQuiz.js <path-ke-file-json>');
  console.log('');
  console.log('   Contoh:');
  console.log('   node scripts/importQuiz.js data/quiz-hiragana.json');
  console.log('');
  process.exit(0);
}

const jsonFile = path.resolve(args[0]);
importQuiz(jsonFile).then(() => process.exit(0));
