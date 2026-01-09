import { ExamConfig, Question } from '@/types/exam';
import { generateMockQuestions } from './mockData';

export const generateExam = async (config: ExamConfig): Promise<Question[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const allQuestions = generateMockQuestions();
  
  // Return subset based on config
  const numQuestions = Math.min(config.numberOfQuestions, allQuestions.length);
  return allQuestions.slice(0, numQuestions);
};

export const submitExam = async (questions: Question[]): Promise<{ score: number; totalCorrect: number }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let correct = 0;
  questions.forEach(q => {
    if (q.userAnswer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
      correct++;
    }
  });
  
  return {
    score: Math.round((correct / questions.length) * 100),
    totalCorrect: correct,
  };
};
