import { jlptN4Questions, jlptN4QuestionsFormatted } from './data/questionsData';

export { jlptN4Questions, jlptN4QuestionsFormatted };

export const shikenJLPTN4Questions = jlptN4QuestionsFormatted;

/**
 * Helper untuk mengambil daftar semua soal shiken (JLPT N4 & kuis lainnya)
 */
export const getShikenQuestions = () => {
  return shikenJLPTN4Questions;
};
