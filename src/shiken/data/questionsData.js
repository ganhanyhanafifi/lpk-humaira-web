import jlptN4QuestionsJson from './jlptN4Questions.json';

/**
 * Array 20 soal JLPT N4 standar (format objek asli)
 */
export const jlptN4Questions = jlptN4QuestionsJson;

/**
 * Formatted 20 soal JLPT N4 untuk UI / Firestore (dengan field opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar)
 */
export const jlptN4QuestionsFormatted = jlptN4QuestionsJson.map((q) => {
  const optionLetters = ['A', 'B', 'C', 'D'];
  return {
    id: q.id,
    soalId: `jlpt-n4-${q.id}`,
    urutan: q.id,
    section: q.section,
    question: q.question,
    teks_soal: q.question,
    options: q.options,
    answerIndex: q.answerIndex,
    opsi_a: q.options[0] || '',
    opsi_b: q.options[1] || '',
    opsi_c: q.options[2] || '',
    opsi_d: q.options[3] || '',
    jawaban_benar: optionLetters[q.answerIndex] || 'A',
  };
});
