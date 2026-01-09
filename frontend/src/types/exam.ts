export type QuestionType = 'multiple-choice' | 'short-answer' | 'true-false' | 'long-answer';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  isLatex?: boolean;
}

export interface ExamConfig {
  numberOfQuestions: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
  createdAt: Date;
  completedAt?: Date;
  score?: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'txt';
  folderId: string;
  size: string;
  uploadedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

export interface ExamHistoryItem {
  id: string;
  title: string;
  subject: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}
